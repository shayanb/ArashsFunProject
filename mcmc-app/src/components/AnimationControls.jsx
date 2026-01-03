import { useState, useEffect } from 'react';

function AnimationControls({ maxSteps, currentStep, onStepChange, onPlay, onPause, isPlaying }) {
  const [speed, setSpeed] = useState(50);

  const handleStepForward = () => {
    if (currentStep < maxSteps - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleReset = () => {
    onStepChange(0);
    onPause();
  };

  const handleEnd = () => {
    onStepChange(maxSteps - 1);
    onPause();
  };

  return (
    <div className="animation-controls">
      <div className="controls-header">
        <h3>Animation Controls</h3>
        <div className="step-counter">
          Step: {currentStep + 1} / {maxSteps}
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleReset} title="Reset to start">
          ⏮
        </button>
        <button onClick={handleStepBackward} disabled={currentStep === 0} title="Step backward">
          ⏪
        </button>
        <button onClick={isPlaying ? onPause : onPlay} className="play-pause-btn" title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={handleStepForward} disabled={currentStep >= maxSteps - 1} title="Step forward">
          ⏩
        </button>
        <button onClick={handleEnd} title="Jump to end">
          ⏭
        </button>
      </div>

      <div className="speed-control">
        <label>
          Speed: {speed} steps/sec
          <input
            type="range"
            min="1"
            max="200"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max={maxSteps - 1}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default AnimationControls;
