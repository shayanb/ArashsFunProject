import { useMemo } from 'react';

function StatisticsPanel({ samples, acceptanceRate, dimensions }) {
  const stats = useMemo(() => {
    if (!samples || samples.length === 0) return null;

    const calculateSimpleAutocorr = (values, lag) => {
      if (values.length < lag) return 0;

      const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
      let sum = 0;

      for (let i = 0; i < values.length - lag; i++) {
        sum += (values[i] - mean) * (values[i + lag] - mean);
      }

      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0);
      return (sum / (values.length - lag)) / (variance / values.length);
    };

    const calculateDimensionStats = (dimIndex) => {
      const values = samples.map(s => s[dimIndex]);
      const n = values.length;

      const mean = values.reduce((sum, v) => sum + v, 0) / n;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
      const std = Math.sqrt(variance);

      const sorted = [...values].sort((a, b) => a - b);
      const median = sorted[Math.floor(n / 2)];
      const min = sorted[0];
      const max = sorted[n - 1];

      // Calculate quantiles
      const q25 = sorted[Math.floor(n * 0.25)];
      const q75 = sorted[Math.floor(n * 0.75)];

      return { mean, std, variance, median, min, max, q25, q75 };
    };

    const dimStats = [];
    for (let i = 0; i < dimensions; i++) {
      dimStats.push(calculateDimensionStats(i));
    }

    // Calculate effective sample size (simplified)
    const autocorr = calculateSimpleAutocorr(samples.map(s => s[0]), 10);
    const ess = samples.length / (1 + 2 * autocorr);

    return {
      totalSamples: samples.length,
      dimensions: dimStats,
      effectiveSampleSize: ess
    };
  }, [samples, dimensions]);

  if (!stats) return null;

  const dimLabels = ['X', 'Y', 'Z'];

  return (
    <div className="statistics-panel">
      <h3>Detailed Statistics</h3>

      <div className="stat-section">
        <h4>General</h4>
        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-label">Total Samples:</span>
            <span className="stat-value">{stats.totalSamples}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Acceptance Rate:</span>
            <span className="stat-value">{(acceptanceRate * 100).toFixed(2)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Effective Sample Size:</span>
            <span className="stat-value">{Math.round(stats.effectiveSampleSize)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Efficiency:</span>
            <span className="stat-value">
              {((stats.effectiveSampleSize / stats.totalSamples) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {stats.dimensions.map((dimStat, i) => (
        <div key={i} className="stat-section">
          <h4>Dimension {dimLabels[i]}</h4>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Mean:</span>
              <span className="stat-value">{dimStat.mean.toFixed(4)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Std Dev:</span>
              <span className="stat-value">{dimStat.std.toFixed(4)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Median:</span>
              <span className="stat-value">{dimStat.median.toFixed(4)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Variance:</span>
              <span className="stat-value">{dimStat.variance.toFixed(4)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Min:</span>
              <span className="stat-value">{dimStat.min.toFixed(4)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Max:</span>
              <span className="stat-value">{dimStat.max.toFixed(4)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Q1 (25%):</span>
              <span className="stat-value">{dimStat.q25.toFixed(4)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Q3 (75%):</span>
              <span className="stat-value">{dimStat.q75.toFixed(4)}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="stat-section">
        <h4>Acceptance Rate Guide</h4>
        <div className="guide-text">
          <p><strong>Optimal ranges:</strong></p>
          <ul>
            <li>1D: 40-50%</li>
            <li>2D+: 23-40%</li>
          </ul>
          <p>
            {acceptanceRate < 0.15 && "⚠️ Too low - increase step size"}
            {acceptanceRate >= 0.15 && acceptanceRate < 0.23 && "📊 Acceptable"}
            {acceptanceRate >= 0.23 && acceptanceRate <= 0.5 && "✅ Optimal range"}
            {acceptanceRate > 0.5 && acceptanceRate <= 0.7 && "📊 Acceptable"}
            {acceptanceRate > 0.7 && "⚠️ Too high - decrease step size"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;
