import React from 'react';

export default function PointTooltips({
  pointTooltip,
  tooltipMeasurements,
  tooltipTextRef,
  constrainTooltipPosition
}) {
  if (!pointTooltip) return null;

  return (
    <g transform={`translate(${constrainTooltipPosition(pointTooltip.x, tooltipMeasurements.width)}, ${pointTooltip.y - 25})`}>
      <rect
        x={tooltipMeasurements.x}
        y="-20"
        width={tooltipMeasurements.width}
        height="24"
        rx="5"
        ry="5"
        fill="white"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
      />
      <text
        ref={tooltipTextRef}
        x="0"
        y="-8"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill="#374151"
      >
        {(() => {
          const year = pointTooltip.start ? `${pointTooltip.start}-${pointTooltip.end}` : pointTooltip.year;
          return `${pointTooltip.content} (${year})`;
        })()}
      </text>
    </g>
  );
} 