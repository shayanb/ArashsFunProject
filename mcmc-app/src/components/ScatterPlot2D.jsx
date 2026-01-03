import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ScatterPlot2D({ samples, targetPdf }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!samples || samples.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Extract x and y values
    const xValues = samples.map(s => s[0]);
    const yValues = samples.map(s => s[1]);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(xValues))
      .nice()
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(yValues))
      .nice()
      .range([height, 0]);

    // Draw contour plot of target PDF if provided
    if (targetPdf) {
      const gridSize = 50;
      const gridData = [];

      const [xMin, xMax] = xScale.domain();
      const [yMin, yMax] = yScale.domain();

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = xMin + (xMax - xMin) * (i / gridSize);
          const y = yMin + (yMax - yMin) * (j / gridSize);
          gridData.push({ x, y, value: targetPdf(x, y) });
        }
      }

      // Color scale for contours
      const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
        .domain([0, d3.max(gridData, d => d.value)]);

      // Draw heatmap
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;

      svg.selectAll('.heatmap-cell')
        .data(gridData)
        .join('rect')
        .attr('class', 'heatmap-cell')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y))
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', d => colorScale(d.value))
        .attr('opacity', 0.3);
    }

    // Draw sample path (connecting points in order)
    const pathLine = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    svg.append('path')
      .datum(samples)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1)
      .attr('opacity', 0.3)
      .attr('d', pathLine);

    // Draw sample points
    svg.selectAll('.sample-point')
      .data(samples)
      .join('circle')
      .attr('class', 'sample-point')
      .attr('cx', d => xScale(d[0]))
      .attr('cy', d => yScale(d[1]))
      .attr('r', 2)
      .attr('fill', '#2563eb')
      .attr('opacity', 0.5);

    // Highlight first point
    svg.append('circle')
      .attr('cx', xScale(samples[0][0]))
      .attr('cy', yScale(samples[0][1]))
      .attr('r', 5)
      .attr('fill', '#16a34a')
      .attr('stroke', '#000')
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
      .text('X');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text('Y');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('2D Sample Path with Target Distribution');

  }, [samples, targetPdf]);

  return (
    <div className="plot-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default ScatterPlot2D;
