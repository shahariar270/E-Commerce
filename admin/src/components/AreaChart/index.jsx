import React from 'react';

// Sample data formatted based on your structure
const SAMPLE_DATA = [
  { date: "22/5/2026", value: 10 },
  { date: "23/5/2026", value: 45 },
  { date: "24/5/2026", value: 23 },
  { date: "25/5/2026", value: 70 },
  { date: "26/5/2026", value: 55 },
  { date: "27/5/2026", value: 95 },
  { date: "28/5/2026", value: 60 }
];

export default function AreaChart({ data = SAMPLE_DATA }) {
  // 1. Chart dimensions (viewBox units)
  const width = 600;
  const height = 300;
  const padding = 40; // Space for labels

  // Helper to parse "DD/MM/YYYY" string into a Unix timestamp
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
  };

  // 2. Process data and find boundaries
  const processedData = data.map(d => ({
    timestamp: parseDate(d.date),
    originalDate: d.date,
    value: d.value
  })).sort((a, b) => a.timestamp - b.timestamp); // Ensure chronological order

  const timestamps = processedData.map(d => d.timestamp);
  const values = processedData.map(d => d.value);

  const minX = Math.min(...timestamps);
  const maxX = Math.max(...timestamps);
  const minY = 0; // Base of the area chart
  const maxY = Math.max(...values) * 1.1; // Add 10% headroom at the top

  // 3. Map data points to SVG pixel coordinates
  const points = processedData.map(d => {
    // Prevent division by zero if there's only one data point
    const xRange = maxX - minX || 1;
    const yRange = maxY - minY || 1;

    const x = padding + ((d.timestamp - minX) / xRange) * (width - padding * 2);
    const y = (height - padding) - ((d.value - minY) / yRange) * (height - padding * 2);
    
    return { x, y, originalDate: d.originalDate, value: d.value };
  });

  // 4. Generate the SVG Path strings
  if (points.length === 0) return <p>No data available</p>;

  // Line path (the top stroke)
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Area path (closes the shape at the bottom of the chart grid)
  const chartBottom = height - padding;
  const areaPath = `
    ${linePath} 
    L ${points[points.length - 1].x} ${chartBottom} 
    L ${points[0].x} ${chartBottom} 
    Z
  `;

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          {/* Subtle gradient fill for the area */}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#db4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#db4444" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines (Background) */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const yPos = padding + ratio * (height - padding * 2);
          const gridValue = Math.round(maxY - ratio * (maxY - minY));
          return (
            <g key={i}>
              <line x1={padding} y1={yPos} x2={width - padding} y2={yPos} stroke="#e5e7eb" strokeDasharray="4 4" />
              <text x={padding - 10} y={yPos + 4} textAnchor="end" fontSize="12" fill="#9ca3af">{gridValue}</text>
            </g>
          );
        })}

        {/* The Filled Area */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* The Top Line Stroke */}
        <path d={linePath} fill="none" stroke="#db4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Interactive Dots & Bottom Date Labels */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Dots on line junctions */}
            <circle cx={p.x} cy={p.y} r="5" fill="#db4444" stroke="#ffffff" strokeWidth="2" />
            
            {/* Tooltip value shown right above the dot */}
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1f2937">
              {p.value}
            </text>

            {/* X-Axis Date Labels */}
            <text x={p.x} y={height - 15} textAnchor="middle" fontSize="11" fill="#6b7280" transform={`rotate(-15, ${p.x}, ${height - 15})`}>
              {p.originalDate.split('/')[0] + '/' + p.originalDate.split('/')[1]} {/* Truncated to DD/MM for space */}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}