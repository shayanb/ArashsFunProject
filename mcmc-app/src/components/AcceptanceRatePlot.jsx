import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function AcceptanceRatePlot({ acceptanceHistory }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!acceptanceHistory || acceptanceHistory.length === 0) return;

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

    // Prepare data
    const data = acceptanceHistory.map((rate, i) => ({ iteration: i, rate }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, acceptanceHistory.length])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.iteration))
      .y(d => yScale(d.rate));

    // Draw line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#16a34a')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add reference lines for optimal acceptance rate
    // Optimal for MH is typically 0.234 (for high dimensions) to 0.44 (for 1D)
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(0.234))
      .attr('y2', yScale(0.234))
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.5);

    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(0.44))
      .attr('y2', yScale(0.44))
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.5);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text('Iteration');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => `${(d * 100).toFixed(0)}%`))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text('Acceptance Rate');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Acceptance Rate Over Time');

  }, [acceptanceHistory]);

  return (
    <div className="plot-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default AcceptanceRatePlot;
