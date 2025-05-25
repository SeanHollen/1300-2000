import React from 'react';

function createLinePath(points, range, config, totalHeight, yearToX) {
  return points.reduce((path, point, i) => {
    const x = yearToX(point.year);
    const normalizedValue = (point.value - range.start) / (range.end - range.start);
    const y = (totalHeight - config.layout.bottomPadding) - (normalizedValue * ((totalHeight - config.layout.bottomPadding) - config.layout.axisHeight));
    return path + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
  }, '');
}

export default function LineCharts({ 
  lineChartData, 
  config, 
  yearToX,
  totalHeight 
}) {
  return (
    <>
      {lineChartData
        .filter(lineData => lineData.toShow)
        .map((lineData) => (
          <path
            key={lineData.id}
            d={createLinePath(lineData.points, lineData.range, config, totalHeight, yearToX)}
            stroke={lineData.color}
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
        ))}
    </>
  );
} 