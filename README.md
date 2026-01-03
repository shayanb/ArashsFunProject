# Arash's Fun Project - MCMC Visualizer

🎲 **Interactive Markov Chain Monte Carlo Visualization Tool**

A modern web application for exploring and understanding MCMC algorithms through stunning 3D visualizations and real-time animations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://shayanb.github.io/ArashsFunProject/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-Latest-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![D3.js](https://img.shields.io/badge/D3.js-Latest-F9A03C?style=for-the-badge&logo=d3.js)](https://d3js.org/)

## 🎯 Project Overview

This educational tool makes Markov Chain Monte Carlo (MCMC) algorithms accessible and understandable through interactive visualizations. Watch as MCMC chains explore probability distributions in real-time, with beautiful color gradients showing temporal evolution and full control over the simulation parameters.

### 🌟 Key Features

- **3 MCMC Algorithms**: Metropolis-Hastings, Random Walk Metropolis, and Hamiltonian Monte Carlo
- **Multi-dimensional Support**: Visualize 1D, 2D, and 3D distributions
- **Interactive 3D Graphics**: Rotate, zoom, and explore chains in 3D space with Three.js
- **Real-time Animation**: Step through iterations, play/pause, and scrub through the chain history
- **Temperature Coloring**: Beautiful gradients showing sample age (blue → green → yellow → red)
- **Detailed Statistics**: Comprehensive metrics including ESS, acceptance rates, and per-dimension stats
- **8+ Distributions**: Normal, Uniform, Exponential, Beta, Gamma, Bimodal, Rosenbrock, Banana, Funnel

## 🚀 Quick Start

### Online Demo

Visit the live demo: **[https://shayanb.github.io/ArashsFunProject/](https://shayanb.github.io/ArashsFunProject/)**

### Local Development

```bash
# Navigate to the app directory
cd mcmc-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Building for Production

```bash
cd mcmc-app
npm run build
```

The production build will be in `mcmc-app/dist/`.

## 📁 Repository Structure

```
newIdea/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── mcmc-app/                   # Main application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ScatterPlot3D.jsx       # 3D visualization
│   │   │   ├── ScatterPlot2D.jsx       # 2D visualization
│   │   │   ├── AnimationControls.jsx   # Play/pause/step controls
│   │   │   ├── StatisticsPanel.jsx     # Detailed statistics
│   │   │   ├── TracePlot.jsx           # Trace plots
│   │   │   ├── HistogramPlot.jsx       # Histogram with PDF
│   │   │   ├── AcceptanceRatePlot.jsx  # Acceptance tracking
│   │   │   └── AutocorrelationPlot.jsx # Autocorrelation
│   │   ├── utils/
│   │   │   ├── distributions.js        # Probability distributions
│   │   │   └── mcmc.js                 # MCMC algorithms
│   │   ├── App.jsx             # Main app component
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js          # Vite configuration
│   └── README.md               # Detailed documentation
├── arashidea.md                # Original project idea
└── README.md                   # This file
```

## 🎨 What You Can Do

### 1D Distributions
- See trace plots showing parameter evolution over time
- Compare histogram of samples with true probability density
- Analyze autocorrelation to assess chain mixing
- View detailed statistics (mean, median, variance, quantiles)

### 2D Distributions
- Watch the chain explore bivariate distributions with animated scatter plots
- See the target distribution as a heatmap background
- Control animation speed and step through iterations
- Analyze each dimension separately

### 3D Distributions
- **Experience stunning 3D visualization** with interactive camera controls
- **Temperature gradient coloring**: oldest samples are blue, newest are red
- See the complete chain path through 3D space
- Auto-rotate option for continuous viewing
- Full animation controls with step-by-step navigation

## 🔧 Technologies

- **Frontend**: React 18.3 with Hooks
- **Build Tool**: Vite (fast HMR and optimized builds)
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **2D Visualizations**: D3.js
- **Deployment**: GitHub Actions + GitHub Pages
- **Language**: JavaScript (ES6+)

## 📊 Understanding MCMC

MCMC algorithms generate samples from probability distributions that are difficult to sample from directly. This tool helps you understand:

- **How algorithms explore parameter space**: Watch the chain move through the distribution
- **Acceptance rate tuning**: See how step size affects exploration efficiency
- **Burn-in behavior**: Observe how chains converge to the target distribution
- **Algorithm comparison**: Compare Metropolis-Hastings vs HMC efficiency
- **Autocorrelation**: Understand sample independence and effective sample size

## 🎓 Educational Use Cases

Perfect for:
- **Statistics courses**: Teaching MCMC concepts visually
- **Bayesian inference**: Understanding posterior sampling
- **Computational methods**: Comparing algorithm efficiency
- **Self-learning**: Experimenting with parameters and distributions
- **Research**: Prototyping and understanding MCMC behavior

## 🤝 Contributing

Contributions are welcome! See `mcmc-app/README.md` for detailed TODO list and contribution guidelines.

### Priority improvements:
- CSV data upload for custom distributions
- More 3D distributions (multivariate normal, custom PDFs)
- Additional algorithms (Gibbs sampling, NUTS)
- Convergence diagnostics (Gelman-Rubin, Geweke)
- Export functionality (CSV, PNG, configuration)

## 📝 Documentation

- **Detailed README**: See `mcmc-app/README.md` for complete documentation
- **Original Idea**: See `arashidea.md` for the initial concept
- **Live Demo**: Visit [GitHub Pages](https://shayanb.github.io/ArashsFunProject/)

## 🐛 Known Issues

- Performance may degrade with >10,000 iterations
- 3D rendering requires modern GPU
- HMC uses numerical gradients (not analytical)
- 3D distributions limited to product distributions

## 📄 License

MIT License - Free for educational and commercial use.

## 🙏 Acknowledgments

Built with modern web technologies to make computational statistics accessible and engaging. Special thanks to the open-source communities behind React, Three.js, D3.js, and the statistical computing research community.

---

**Live Demo**: [https://shayanb.github.io/ArashsFunProject/](https://shayanb.github.io/ArashsFunProject/)

**Questions or Feedback?** Open an issue on GitHub!

---

Made with ❤️ for statistics education and MCMC exploration
