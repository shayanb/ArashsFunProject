import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function AutocorrelationPlot({ autocorrelation }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!autocorrelation || autocorrelation.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(autocorrelation, d => d.lag)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([height, 0]);

    // Draw bars
    svg.selectAll('line')
      .data(autocorrelation)
      .join('line')
      .attr('x1', d => xScale(d.lag))
      .attr('x2', d => xScale(d.lag))
      .attr('y1', yScale(0))
      .attr('y2', d => yScale(d.value))
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    // Add zero line
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text('Lag');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text('Autocorrelation');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Autocorrelation Function');

  }, [autocorrelation]);

  return (
    <div className="plot-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default AutocorrelationPlot;
