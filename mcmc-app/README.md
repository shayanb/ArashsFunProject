# MCMC Simulation Visualizer

An interactive web application for visualizing Markov Chain Monte Carlo (MCMC) algorithms in 1D, 2D, and 3D. This educational tool helps users understand how different MCMC algorithms explore probability distributions through real-time animation and detailed statistics.

![MCMC Visualizer](https://img.shields.io/badge/React-18.3-blue) ![Three.js](https://img.shields.io/badge/Three.js-Latest-green) ![D3.js](https://img.shields.io/badge/D3.js-Latest-orange)

## 🌐 Live Demo

**Try it now**: [https://shayanb.github.io/ArashsFunProject/](https://shayanb.github.io/ArashsFunProject/)

The app is automatically deployed to GitHub Pages on every push to the main branch.

## Features

### ✅ Implemented

#### MCMC Algorithms
- **Metropolis-Hastings**: Classic MCMC algorithm with adjustable proposal distribution
- **Random Walk Metropolis**: Symmetric proposal variant of Metropolis-Hastings
- **Hamiltonian Monte Carlo (HMC)**: Advanced algorithm using gradient information for efficient sampling

#### Probability Distributions

**1D Distributions:**
- Normal (Gaussian)
- Uniform
- Exponential
- Beta
- Gamma
- Bimodal (Mixture of Gaussians)

**2D Distributions:**
- Bivariate Normal
- Rosenbrock (banana-shaped)
- Banana (curved Gaussian)
- Funnel

**3D Distributions:**
- Product of 1D distributions (Normal, Uniform, Exponential, Beta, Gamma)

#### Visualizations

**1D Visualizations:**
- Trace plot showing parameter evolution
- Histogram with target PDF overlay
- Acceptance rate tracker over iterations
- Autocorrelation function plot
- Detailed statistics panel

**2D Visualizations:**
- Interactive scatter plot with target distribution heatmap
- Animation controls for step-by-step exploration
- Separate trace plots for X and Y dimensions
- Acceptance rate tracker
- Detailed statistics panel

**3D Visualizations:**
- **Interactive 3D scatter plot** with Three.js
  - Rotate, zoom, and pan with mouse
  - Temperature-based color gradient (blue=old, red=new)
  - Animated chain path visualization
  - Auto-rotate option
- Animation controls (play/pause/step/scrub)
- Trace plots for X, Y, Z dimensions
- Acceptance rate tracker
- Comprehensive statistics panel

#### Interactive Controls
- Algorithm selection
- Dimension selection (1D/2D/3D)
- Distribution selection (auto-filtered by dimension)
- Adjustable parameters:
  - Iterations (100-10,000)
  - Burn-in period (0-1,000)
  - Step size (0.01-2.00)
  - Initial values for X, Y, Z

#### Animation System
- Play/Pause controls
- Step forward/backward buttons
- Jump to start/end
- Progress bar scrubbing
- Speed control (1-200 steps/sec)
- Real-time step counter

#### Statistics
- Total samples generated
- Acceptance rate with optimization guidance
- Effective Sample Size (ESS)
- Sampling efficiency percentage
- Per-dimension statistics:
  - Mean, Median, Mode
  - Standard Deviation, Variance
  - Min, Max
  - Q1 (25%), Q3 (75%) quantiles

## Technologies Used

- **React 18.3** - UI framework
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **D3.js** - 2D data visualizations and charting

## Project Structure

```
mcmc-app/
├── src/
│   ├── components/          # React components
│   │   ├── AcceptanceRatePlot.jsx    # Acceptance rate visualization
│   │   ├── AnimationControls.jsx     # Play/pause/step controls
│   │   ├── AutocorrelationPlot.jsx   # Autocorrelation function plot
│   │   ├── HistogramPlot.jsx         # Histogram with PDF overlay
│   │   ├── ScatterPlot2D.jsx         # 2D scatter plot with heatmap
│   │   ├── ScatterPlot3D.jsx         # 3D interactive visualization
│   │   ├── StatisticsPanel.jsx       # Detailed statistics display
│   │   └── TracePlot.jsx             # Parameter trace over iterations
│   │
│   ├── utils/               # Core logic and algorithms
│   │   ├── distributions.js # Probability distributions and PDFs
│   │   └── mcmc.js         # MCMC algorithm implementations
│   │
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
│
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd mcmc-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### GitHub Pages Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions:

1. **Automatic Deployment**: Every push to `main` or `master` branch triggers a build and deployment
2. **Workflow Location**: `.github/workflows/deploy.yml` in the repository root
3. **Live URL**: [https://shayanb.github.io/ArashsFunProject/](https://shayanb.github.io/ArashsFunProject/)

**To enable GitHub Pages for your fork:**
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main/master branch to trigger deployment
4. Update `base` in `vite.config.js` to match your repository name

## Usage Guide

### Basic Workflow

1. **Select an algorithm** (start with Metropolis-Hastings)
2. **Choose dimensions** (1D is simplest to understand)
3. **Pick a distribution** (Normal is a good starting point)
4. **Adjust parameters**:
   - Iterations: Higher = more samples (try 2000-5000)
   - Burn-in: Initial samples to discard (typically 10-20% of iterations)
   - Step Size: Controls proposal distribution width
   - Initial values: Starting point for the chain
5. **Click "Run MCMC"** to generate samples
6. **Use animation controls** to step through the chain (2D/3D only)
7. **Observe visualizations** and statistics

### Understanding Parameters

#### Step Size
- **Too small**: High acceptance rate (>70%) but slow exploration
- **Optimal**: 23-50% acceptance rate, efficient exploration
- **Too large**: Low acceptance rate (<15%), chain gets stuck

#### Burn-In Period
- Discards initial samples before chain reaches stationary distribution
- Typically 10-50% of total iterations
- Longer for complex distributions or poor starting values

#### Acceptance Rate Guidelines
- **1D**: Optimal range 40-50%
- **2D+**: Optimal range 23-40%
- The app provides real-time feedback on acceptance rate

### Tips for Best Results

1. **Start simple**: Use 1D Normal distribution to understand basics
2. **Experiment with step size**: Adjust to achieve optimal acceptance rate
3. **Use animation**: In 2D/3D, animate to see how chain explores space
4. **Try different algorithms**: Compare HMC vs Metropolis-Hastings efficiency
5. **Increase iterations**: Use 5000+ for smooth visualizations and accurate statistics

## Algorithm Details

### Metropolis-Hastings
- Proposes new states from Gaussian centered at current state
- Accepts/rejects based on ratio of target densities
- Step size controls proposal standard deviation

### Random Walk Metropolis
- Special case of Metropolis-Hastings with symmetric proposal
- Implements same logic but emphasizes random walk nature

### Hamiltonian Monte Carlo (HMC)
- Uses gradient information to propose distant states
- Leapfrog integration with momentum variable
- More efficient for high-dimensional problems
- Requires numerical gradient computation

## Known Issues & Limitations

1. **Performance**: Large iteration counts (>10,000) may slow down browser
2. **3D Rendering**: May be sluggish on older hardware
3. **HMC Gradients**: Uses numerical approximation (not analytical)
4. **3D Distributions**: Limited to product distributions only
5. **CSV Upload**: Planned but not yet implemented

## TODO / Future Improvements

### High Priority
- [ ] Implement CSV file upload for custom data
- [ ] Add more 3D distributions (multivariate normal, custom)
- [ ] Improve HMC with analytical gradients where possible
- [ ] Add Gibbs sampling algorithm
- [ ] Performance optimization for large sample sizes

### Medium Priority
- [ ] Add diagnostic plots:
  - [ ] Geweke diagnostic
  - [ ] Gelman-Rubin convergence diagnostic
  - [ ] Trace plot with multiple chains
- [ ] Export functionality:
  - [ ] Download samples as CSV
  - [ ] Export plots as PNG/SVG
  - [ ] Save configuration as JSON
- [ ] Add tutorial/guided tour for new users
- [ ] Implement parallel chains comparison
- [ ] Add thinning option to reduce autocorrelation

### Low Priority
- [ ] Dark mode UI
- [ ] Customizable color schemes
- [ ] More distribution parameters exposed to UI
- [ ] Real-time likelihood/posterior computation for Bayesian inference
- [ ] Share/save session via URL parameters
- [ ] Mobile responsive design improvements
- [ ] Keyboard shortcuts for animation controls

### Educational Enhancements
- [ ] Tooltips explaining MCMC concepts
- [ ] Built-in examples/presets (e.g., "Bimodal Exploration", "HMC vs MH")
- [ ] Side-by-side algorithm comparison
- [ ] Explanation text for each distribution
- [ ] Video tutorials or interactive walkthrough

### Advanced Features
- [ ] Adaptive MCMC (automatic step size tuning)
- [ ] Delayed rejection MCMC
- [ ] Slice sampling algorithm
- [ ] Multiple chains with convergence checking
- [ ] Custom distribution definition via JavaScript
- [ ] Integration with probabilistic programming concepts

## Contributing

This is an educational project. Contributions are welcome! Areas for improvement:

1. **Algorithm implementations**: Add new MCMC variants
2. **Distributions**: Expand distribution library
3. **Visualizations**: Create new plot types
4. **Performance**: Optimize rendering and computation
5. **Documentation**: Improve explanations and tutorials

## Mathematical Background

### Metropolis-Hastings Algorithm

For target distribution π(x):

1. Initialize x₀
2. For t = 1 to N:
   - Propose x* ~ q(·|xₜ)
   - Calculate acceptance ratio: α = min(1, π(x*)q(xₜ|x*) / π(xₜ)q(x*|xₜ))
   - Accept x* with probability α
   - Set xₜ₊₁ = x* if accepted, else xₜ₊₁ = xₜ

### Effective Sample Size (ESS)

ESS = N / (1 + 2Σρₖ)

Where ρₖ is the autocorrelation at lag k. Higher ESS = more independent samples.

## License

MIT License - Feel free to use for educational purposes.

## Acknowledgments

- Built as an educational tool for understanding MCMC methods
- Inspired by statistical computing courses and research in Bayesian inference
- Uses modern web technologies to make computational statistics accessible

## Resources

- [MCMC Handbook](https://www.mcmchandbook.net/)
- [Betancourt's Intro to HMC](https://arxiv.org/abs/1701.02434)
- [Three.js Documentation](https://threejs.org/docs/)
- [D3.js Gallery](https://d3-graph-gallery.com/)

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Author**: Interactive MCMC Visualizer Team
