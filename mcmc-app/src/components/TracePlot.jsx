import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TracePlot({ samples, dimension = 0, label = '' }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!samples || samples.length === 0) return;

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

    // Extract values for the specified dimension
    const values = samples.map((s, i) => ({ iteration: i, value: s[dimension] }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, samples.length])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(values, d => d.value))
      .nice()
      .range([height, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.iteration))
      .y(d => yScale(d.value));

    // Draw line
    svg.append('path')
      .datum(values)
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 1.5)
      .attr('d', line);

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
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text(label || 'Value');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(`Trace Plot${label ? ` (${label})` : ''}`);

  }, [samples, dimension, label]);

  return (
    <div className="plot-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default TracePlot;
