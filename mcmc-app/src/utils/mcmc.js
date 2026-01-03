import { randomNormal } from './distributions';

// Metropolis-Hastings algorithm
export function metropolisHastings(
  targetPdf,
  initialState,
  stepSize,
  numIterations,
  burnIn = 0,
  dimensions = 1
) {
  const samples = [];
  const acceptanceHistory = [];
  let current = Array.isArray(initialState) ? [...initialState] : [initialState];
  let accepted = 0;

  for (let i = 0; i < numIterations + burnIn; i++) {
    // Propose new state
    const proposal = current.map(x => x + randomNormal(0, stepSize));

    // Calculate acceptance ratio
    let currentPdf, proposalPdf;

    if (dimensions === 1) {
      currentPdf = targetPdf(current[0]);
      proposalPdf = targetPdf(proposal[0]);
    } else if (dimensions === 2) {
      currentPdf = targetPdf(current[0], current[1]);
      proposalPdf = targetPdf(proposal[0], proposal[1]);
    } else {
      // 3D case
      currentPdf = targetPdf(current[0], current[1], current[2]);
      proposalPdf = targetPdf(proposal[0], proposal[1], proposal[2]);
    }

    const acceptanceRatio = Math.min(1, proposalPdf / currentPdf);

    // Accept or reject
    const isAccepted = Math.random() < acceptanceRatio;
    if (isAccepted) {
      current = [...proposal];
      accepted++;
    }

    // Store sample after burn-in
    if (i >= burnIn) {
      samples.push([...current]);
      acceptanceHistory.push(accepted / (i + 1));
    }
  }

  return {
    samples,
    acceptanceRate: accepted / (numIterations + burnIn),
    acceptanceHistory
  };
}

// Random Walk Metropolis (symmetric proposal)
export function randomWalkMetropolis(
  targetPdf,
  initialState,
  stepSize,
  numIterations,
  burnIn = 0,
  dimensions = 1
) {
  // Same as Metropolis-Hastings with symmetric proposal
  return metropolisHastings(targetPdf, initialState, stepSize, numIterations, burnIn, dimensions);
}

// Hamiltonian Monte Carlo (simplified version)
export function hamiltonianMonteCarlo(
  targetPdf,
  gradLogPdf, // Gradient of log target density
  initialState,
  stepSize,
  numIterations,
  burnIn = 0,
  numLeapfrogSteps = 10,
  dimensions = 1
) {
  const samples = [];
  const acceptanceHistory = [];
  let current = Array.isArray(initialState) ? [...initialState] : [initialState];
  let accepted = 0;

  for (let i = 0; i < numIterations + burnIn; i++) {
    // Sample momentum
    const momentum = current.map(() => randomNormal(0, 1));

    // Leapfrog integration
    let q = [...current]; // position
    let p = [...momentum]; // momentum

    // Half step for momentum
    const grad = gradLogPdf(q, dimensions);
    p = p.map((pi, idx) => pi + 0.5 * stepSize * grad[idx]);

    // Full steps
    for (let step = 0; step < numLeapfrogSteps; step++) {
      // Full step for position
      q = q.map((qi, idx) => qi + stepSize * p[idx]);

      // Full step for momentum (except last step)
      if (step < numLeapfrogSteps - 1) {
        const gradStep = gradLogPdf(q, dimensions);
        p = p.map((pi, idx) => pi + stepSize * gradStep[idx]);
      }
    }

    // Half step for momentum at the end
    const gradFinal = gradLogPdf(q, dimensions);
    p = p.map((pi, idx) => pi + 0.5 * stepSize * gradFinal[idx]);

    // Negate momentum for reversibility
    p = p.map(pi => -pi);

    // Calculate acceptance ratio using Hamiltonian
    const currentH = hamiltonian(current, momentum, targetPdf, dimensions);
    const proposalH = hamiltonian(q, p, targetPdf, dimensions);
    const acceptanceRatio = Math.min(1, Math.exp(currentH - proposalH));

    // Accept or reject
    const isAccepted = Math.random() < acceptanceRatio;
    if (isAccepted) {
      current = [...q];
      accepted++;
    }

    // Store sample after burn-in
    if (i >= burnIn) {
      samples.push([...current]);
      acceptanceHistory.push(accepted / (i + 1));
    }
  }

  return {
    samples,
    acceptanceRate: accepted / (numIterations + burnIn),
    acceptanceHistory
  };
}

// Hamiltonian (total energy)
function hamiltonian(position, momentum, targetPdf, dimensions) {
  // Potential energy: -log(pdf)
  let pdf;
  if (dimensions === 1) {
    pdf = targetPdf(position[0]);
  } else if (dimensions === 2) {
    pdf = targetPdf(position[0], position[1]);
  } else {
    pdf = targetPdf(position[0], position[1], position[2]);
  }
  const potentialEnergy = -Math.log(pdf + 1e-10); // Add small constant to avoid log(0)

  // Kinetic energy: 0.5 * sum(p^2)
  const kineticEnergy = 0.5 * momentum.reduce((sum, p) => sum + p * p, 0);

  return -(potentialEnergy + kineticEnergy);
}

// Numerical gradient computation for HMC
export function numericalGradient(targetPdf, position, dimensions, epsilon = 1e-5) {
  const gradient = [];

  for (let i = 0; i < dimensions; i++) {
    const posPlus = [...position];
    const posMinus = [...position];
    posPlus[i] += epsilon;
    posMinus[i] -= epsilon;

    let pdfPlus, pdfMinus;
    if (dimensions === 1) {
      pdfPlus = targetPdf(posPlus[0]);
      pdfMinus = targetPdf(posMinus[0]);
    } else if (dimensions === 2) {
      pdfPlus = targetPdf(posPlus[0], posPlus[1]);
      pdfMinus = targetPdf(posMinus[0], posMinus[1]);
    } else {
      pdfPlus = targetPdf(posPlus[0], posPlus[1], posPlus[2]);
      pdfMinus = targetPdf(posMinus[0], posMinus[1], posMinus[2]);
    }

    // Gradient of log pdf
    gradient[i] = (Math.log(pdfPlus + 1e-10) - Math.log(pdfMinus + 1e-10)) / (2 * epsilon);
  }

  return gradient;
}

// Calculate autocorrelation
export function calculateAutocorrelation(samples, maxLag = 50) {
  if (!samples || samples.length === 0) return [];

  const n = samples.length;
  const mean = samples.reduce((sum, s) => sum + s[0], 0) / n;
  const variance = samples.reduce((sum, s) => sum + Math.pow(s[0] - mean, 2), 0) / n;

  const autocorr = [];
  for (let lag = 0; lag <= Math.min(maxLag, n - 1); lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += (samples[i][0] - mean) * (samples[i + lag][0] - mean);
    }
    autocorr.push({ lag, value: sum / ((n - lag) * variance) });
  }

  return autocorr;
}
