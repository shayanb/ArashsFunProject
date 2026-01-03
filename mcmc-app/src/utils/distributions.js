// Probability density functions and sampling utilities

export const distributions = {
  normal: {
    name: 'Normal',
    pdf: (x, params = { mean: 0, std: 1 }) => {
      const { mean, std } = params;
      const coefficient = 1 / (std * Math.sqrt(2 * Math.PI));
      const exponent = -0.5 * Math.pow((x - mean) / std, 2);
      return coefficient * Math.exp(exponent);
    },
    pdf2d: (x, y, params = { meanX: 0, meanY: 0, stdX: 1, stdY: 1, correlation: 0 }) => {
      const { meanX, meanY, stdX, stdY, correlation } = params;
      const rho = correlation;
      const z1 = (x - meanX) / stdX;
      const z2 = (y - meanY) / stdY;
      const coefficient = 1 / (2 * Math.PI * stdX * stdY * Math.sqrt(1 - rho * rho));
      const exponent = -1 / (2 * (1 - rho * rho)) * (z1 * z1 + z2 * z2 - 2 * rho * z1 * z2);
      return coefficient * Math.exp(exponent);
    },
    defaultParams: { mean: 0, std: 1 },
    defaultParams2d: { meanX: 0, meanY: 0, stdX: 1, stdY: 1, correlation: 0 }
  },

  uniform: {
    name: 'Uniform',
    pdf: (x, params = { min: -2, max: 2 }) => {
      const { min, max } = params;
      return (x >= min && x <= max) ? 1 / (max - min) : 0;
    },
    defaultParams: { min: -2, max: 2 }
  },

  exponential: {
    name: 'Exponential',
    pdf: (x, params = { lambda: 1 }) => {
      const { lambda } = params;
      return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
    },
    defaultParams: { lambda: 1 }
  },

  beta: {
    name: 'Beta',
    pdf: (x, params = { alpha: 2, beta: 5 }) => {
      if (x < 0 || x > 1) return 0;
      const { alpha, beta } = params;
      // Simplified beta function approximation
      const B = (Math.exp(logGamma(alpha) + logGamma(beta) - logGamma(alpha + beta)));
      return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / B;
    },
    defaultParams: { alpha: 2, beta: 5 }
  },

  gamma: {
    name: 'Gamma',
    pdf: (x, params = { shape: 2, scale: 2 }) => {
      if (x <= 0) return 0;
      const { shape, scale } = params;
      const k = shape;
      const theta = scale;
      const coefficient = 1 / (Math.exp(logGamma(k)) * Math.pow(theta, k));
      return coefficient * Math.pow(x, k - 1) * Math.exp(-x / theta);
    },
    defaultParams: { shape: 2, scale: 2 }
  },

  // Real-world examples
  rosenbrock: {
    name: 'Rosenbrock',
    pdf2d: (x, y, params = { a: 1, b: 100 }) => {
      const { a, b } = params;
      const term1 = Math.pow(a - x, 2);
      const term2 = b * Math.pow(y - x * x, 2);
      // Convert to probability-like (unnormalized)
      return Math.exp(-(term1 + term2) / 20);
    },
    defaultParams2d: { a: 1, b: 100 }
  },

  banana: {
    name: 'Banana (Curved Gaussian)',
    pdf2d: (x, y, params = { b: 0.1 }) => {
      const { b } = params;
      const y_transformed = y - b * x * x;
      const z1 = x / 2;
      const z2 = y_transformed;
      return Math.exp(-0.5 * (z1 * z1 + z2 * z2)) / (2 * Math.PI * 2);
    },
    defaultParams2d: { b: 0.1 }
  },

  funnel: {
    name: 'Funnel',
    pdf2d: (x, y, params = { scale: 3 }) => {
      const { scale } = params;
      const logPdfX = -0.5 * (x * x) / (scale * scale);
      const sigmaY = Math.exp(x / 2);
      const logPdfY = -0.5 * (y * y) / (sigmaY * sigmaY) - Math.log(sigmaY);
      return Math.exp(logPdfX + logPdfY);
    },
    defaultParams2d: { scale: 3 }
  },

  bimodal: {
    name: 'Bimodal (Mixture of Gaussians)',
    pdf: (x, params = { mean1: -2, mean2: 2, std: 0.5, weight: 0.5 }) => {
      const { mean1, mean2, std, weight } = params;
      const pdf1 = Math.exp(-0.5 * Math.pow((x - mean1) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
      const pdf2 = Math.exp(-0.5 * Math.pow((x - mean2) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
      return weight * pdf1 + (1 - weight) * pdf2;
    },
    defaultParams: { mean1: -2, mean2: 2, std: 0.5, weight: 0.5 }
  }
};

// Log gamma function (Stirling's approximation)
function logGamma(z) {
  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  const base = z + 5.5;
  let sum = 1.000000000190015;
  const coefficients = [
    76.18009172947146, -86.50532032941677,
    24.01409824083091, -1.231739572450155,
    0.1208650973866179e-2, -0.5395239384953e-5
  ];

  for (let i = 0; i < 6; i++) {
    sum += coefficients[i] / (z + i + 1);
  }

  return Math.log(2.5066282746310005 * sum) + (z + 0.5) * Math.log(base) - base;
}

// Random number generators
export function randomNormal(mean = 0, std = 1) {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * std + mean;
}

export function randomUniform(min, max) {
  return min + Math.random() * (max - min);
}
