import { useState, useEffect, useRef } from 'react';
import './App.css';
import { distributions } from './utils/distributions';
import {
  metropolisHastings,
  randomWalkMetropolis,
  hamiltonianMonteCarlo,
  numericalGradient,
  calculateAutocorrelation
} from './utils/mcmc';
import TracePlot from './components/TracePlot';
import HistogramPlot from './components/HistogramPlot';
import AcceptanceRatePlot from './components/AcceptanceRatePlot';
import AutocorrelationPlot from './components/AutocorrelationPlot';
import ScatterPlot2D from './components/ScatterPlot2D';
import ScatterPlot3D from './components/ScatterPlot3D';
import AnimationControls from './components/AnimationControls';
import StatisticsPanel from './components/StatisticsPanel';

function App() {
  // MCMC parameters
  const [algorithm, setAlgorithm] = useState('metropolis-hastings');
  const [distribution, setDistribution] = useState('normal');
  const [dimensions, setDimensions] = useState(1);
  const [numIterations, setNumIterations] = useState(1000);
  const [burnIn, setBurnIn] = useState(100);
  const [stepSize, setStepSize] = useState(0.5);
  const [initialX, setInitialX] = useState(0);
  const [initialY, setInitialY] = useState(0);
  const [initialZ, setInitialZ] = useState(0);

  // Results
  const [samples, setSamples] = useState([]);
  const [acceptanceRate, setAcceptanceRate] = useState(0);
  const [acceptanceHistory, setAcceptanceHistory] = useState([]);
  const [autocorrelation, setAutocorrelation] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Animation state
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const animationRef = useRef(null);

  const runMCMC = () => {
    setIsRunning(true);

    // Get target distribution
    const dist = distributions[distribution];
    let targetPdf;

    if (dimensions === 1) {
      const params = dist.defaultParams || {};
      targetPdf = (x) => dist.pdf(x, params);
    } else if (dimensions === 2) {
      const params = dist.defaultParams2d || dist.defaultParams || {};
      targetPdf = (x, y) => (dist.pdf2d || dist.pdf)(x, y, params);
    } else {
      // For 3D, use a product of 1D distributions or default
      targetPdf = (x, y, z) => {
        const params = dist.defaultParams || {};
        return dist.pdf(x, params) * dist.pdf(y, params) * dist.pdf(z, params);
      };
    }

    // Set initial state
    const initialState = dimensions === 1
      ? [initialX]
      : dimensions === 2
        ? [initialX, initialY]
        : [initialX, initialY, initialZ];

    // Run selected algorithm
    let result;
    if (algorithm === 'metropolis-hastings') {
      result = metropolisHastings(
        targetPdf,
        initialState,
        stepSize,
        numIterations,
        burnIn,
        dimensions
      );
    } else if (algorithm === 'random-walk') {
      result = randomWalkMetropolis(
        targetPdf,
        initialState,
        stepSize,
        numIterations,
        burnIn,
        dimensions
      );
    } else if (algorithm === 'hmc') {
      const gradFn = (pos, dim) => numericalGradient(targetPdf, pos, dim);
      result = hamiltonianMonteCarlo(
        targetPdf,
        gradFn,
        initialState,
        stepSize * 0.1, // Smaller step size for HMC
        numIterations,
        burnIn,
        10, // leapfrog steps
        dimensions
      );
    }

    setSamples(result.samples);
    setAcceptanceRate(result.acceptanceRate);
    setAcceptanceHistory(result.acceptanceHistory);

    // Calculate autocorrelation for 1D
    if (dimensions === 1) {
      const autocorr = calculateAutocorrelation(result.samples);
      setAutocorrelation(autocorr);
    }

    // Reset animation
    setCurrentStep(0);
    setIsPlaying(false);

    setIsRunning(false);
  };

  // Animation control handlers
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // Animation effect
  useEffect(() => {
    if (isPlaying && samples.length > 0) {
      animationRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= samples.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 20); // 50 steps per second
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, samples.length]);

  // Get available distributions for selected dimensions
  const getAvailableDistributions = () => {
    if (dimensions === 1) {
      return Object.keys(distributions).filter(key => distributions[key].pdf);
    } else if (dimensions === 2) {
      return Object.keys(distributions).filter(key => distributions[key].pdf2d);
    } else {
      // For 3D, only use distributions that have a 1D pdf (we'll use product distribution)
      return Object.keys(distributions).filter(key => distributions[key].pdf && !distributions[key].pdf2d);
    }
  };

  // Update distribution when dimensions change
  useEffect(() => {
    const available = getAvailableDistributions();
    if (!available.includes(distribution)) {
      setDistribution(available[0]);
    }
  }, [dimensions]);

  return (
    <div className="app">
      <header>
        <h1>MCMC Simulation Visualizer</h1>
        <p>Interactive Markov Chain Monte Carlo Explorer</p>
      </header>

      <div className="container">
        <div className="controls">
          <h2>Controls</h2>

          <div className="control-group">
            <label>Algorithm</label>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
              <option value="metropolis-hastings">Metropolis-Hastings</option>
              <option value="random-walk">Random Walk Metropolis</option>
              <option value="hmc">Hamiltonian Monte Carlo</option>
            </select>
          </div>

          <div className="control-group">
            <label>Dimensions</label>
            <select value={dimensions} onChange={(e) => setDimensions(Number(e.target.value))}>
              <option value={1}>1D</option>
              <option value={2}>2D</option>
              <option value={3}>3D</option>
            </select>
          </div>

          <div className="control-group">
            <label>Distribution</label>
            <select value={distribution} onChange={(e) => setDistribution(e.target.value)}>
              {getAvailableDistributions().map(key => (
                <option key={key} value={key}>{distributions[key].name}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Iterations: {numIterations}</label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={numIterations}
              onChange={(e) => setNumIterations(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Burn-in: {burnIn}</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={burnIn}
              onChange={(e) => setBurnIn(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Step Size: {stepSize.toFixed(2)}</label>
            <input
              type="range"
              min="0.01"
              max="2"
              step="0.01"
              value={stepSize}
              onChange={(e) => setStepSize(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Initial X: {initialX.toFixed(2)}</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={initialX}
              onChange={(e) => setInitialX(Number(e.target.value))}
            />
          </div>

          {dimensions >= 2 && (
            <div className="control-group">
              <label>Initial Y: {initialY.toFixed(2)}</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={initialY}
                onChange={(e) => setInitialY(Number(e.target.value))}
              />
            </div>
          )}

          {dimensions === 3 && (
            <div className="control-group">
              <label>Initial Z: {initialZ.toFixed(2)}</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={initialZ}
                onChange={(e) => setInitialZ(Number(e.target.value))}
              />
            </div>
          )}

          <button onClick={runMCMC} disabled={isRunning} className="run-button">
            {isRunning ? 'Running...' : 'Run MCMC'}
          </button>

          {acceptanceRate > 0 && (
            <div className="stats">
              <h3>Statistics</h3>
              <p>Acceptance Rate: {(acceptanceRate * 100).toFixed(1)}%</p>
              <p>Samples: {samples.length}</p>
            </div>
          )}
        </div>

        <div className="visualizations">
          {samples.length === 0 ? (
            <div className="placeholder">
              <p>Configure parameters and click "Run MCMC" to start simulation</p>
            </div>
          ) : (
            <>
              {dimensions === 1 && (
                <>
                  <StatisticsPanel
                    samples={samples}
                    acceptanceRate={acceptanceRate}
                    dimensions={dimensions}
                  />
                  <TracePlot samples={samples} />
                  <HistogramPlot
                    samples={samples}
                    targetPdf={(x) => {
                      const dist = distributions[distribution];
                      return dist.pdf(x, dist.defaultParams || {});
                    }}
                  />
                  <AcceptanceRatePlot acceptanceHistory={acceptanceHistory} />
                  <AutocorrelationPlot autocorrelation={autocorrelation} />
                </>
              )}

              {dimensions === 2 && (
                <>
                  <AnimationControls
                    maxSteps={samples.length}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    isPlaying={isPlaying}
                  />
                  <StatisticsPanel
                    samples={samples.slice(0, currentStep + 1)}
                    acceptanceRate={acceptanceRate}
                    dimensions={dimensions}
                  />
                  <ScatterPlot2D
                    samples={samples.slice(0, currentStep + 1)}
                    targetPdf={(x, y) => {
                      const dist = distributions[distribution];
                      return (dist.pdf2d || dist.pdf)(x, y, dist.defaultParams2d || dist.defaultParams || {});
                    }}
                  />
                  <TracePlot samples={samples} dimension={0} label="X" />
                  <TracePlot samples={samples} dimension={1} label="Y" />
                  <AcceptanceRatePlot acceptanceHistory={acceptanceHistory} />
                </>
              )}

              {dimensions === 3 && (
                <>
                  <AnimationControls
                    maxSteps={samples.length}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    isPlaying={isPlaying}
                  />
                  <ScatterPlot3D
                    samples={samples}
                    currentStep={currentStep}
                    autoRotate={autoRotate}
                  />
                  <div className="view-controls">
                    <label>
                      <input
                        type="checkbox"
                        checked={autoRotate}
                        onChange={(e) => setAutoRotate(e.target.checked)}
                      />
                      Auto-rotate view
                    </label>
                  </div>
                  <StatisticsPanel
                    samples={samples.slice(0, currentStep + 1)}
                    acceptanceRate={acceptanceRate}
                    dimensions={dimensions}
                  />
                  <TracePlot samples={samples} dimension={0} label="X" />
                  <TracePlot samples={samples} dimension={1} label="Y" />
                  <TracePlot samples={samples} dimension={2} label="Z" />
                  <AcceptanceRatePlot acceptanceHistory={acceptanceHistory} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
