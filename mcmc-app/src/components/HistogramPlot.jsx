import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function HistogramPlot({ samples, targetPdf }) {
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

    // Extract 1D values
    const values = samples.map(s => s[0]);

    // Create histogram
    const xScale = d3.scaleLinear()
      .domain(d3.extent(values))
      .nice()
      .range([0, width]);

    const bins = d3.bin()
      .domain(xScale.domain())
      .thresholds(30)(values);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .nice()
      .range([height, 0]);

    // Draw histogram bars
    svg.selectAll('rect')
      .data(bins)
      .join('rect')
      .attr('x', d => xScale(d.x0))
      .attr('y', d => yScale(d.length))
      .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr('height', d => height - yScale(d.length))
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.6);

    // Draw target PDF if provided
    if (targetPdf) {
      const pdfData = [];
      const numPoints = 200;
      const [min, max] = xScale.domain();

      for (let i = 0; i <= numPoints; i++) {
        const x = min + (max - min) * (i / numPoints);
        pdfData.push({ x, y: targetPdf(x) });
      }

      // Normalize PDF to match histogram scale
      const maxPdf = d3.max(pdfData, d => d.y);
      const maxHist = d3.max(bins, d => d.length);
      const scale = maxHist / maxPdf;

      const pdfLine = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y * scale));

      svg.append('path')
        .datum(pdfData)
        .attr('fill', 'none')
        .attr('stroke', '#dc2626')
        .attr('stroke-width', 2)
        .attr('d', pdfLine);
    }

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 35)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text('Value');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('fill', 'black')
      .style('font-size', '12px')
      .text('Frequency');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Histogram with Target Distribution');

    // Legend
    if (targetPdf) {
      const legend = svg.append('g')
        .attr('transform', `translate(${width - 150}, 10)`);

      legend.append('rect')
        .attr('width', 20)
        .attr('height', 10)
        .attr('fill', '#3b82f6')
        .attr('opacity', 0.6);

      legend.append('text')
        .attr('x', 25)
        .attr('y', 9)
        .style('font-size', '11px')
        .text('Samples');

      legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 25)
        .attr('y2', 25)
        .attr('stroke', '#dc2626')
        .attr('stroke-width', 2);

      legend.append('text')
        .attr('x', 25)
        .attr('y', 29)
        .style('font-size', '11px')
        .text('Target PDF');
    }

  }, [samples, targetPdf]);

  return (
    <div className="plot-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default HistogramPlot;
