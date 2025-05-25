import React from 'react';

export default function PointsAndSegments({ 
  data,
  yearToX,
  laneThickness,
  lanePadding,
  config,
  handleSegmentHover,
  handlePointHover
}) {
  const pointRadius = config.point.radius;
  const laneUnit = laneThickness / config.lane.percentages.lane;
  const segmentThickness = laneUnit * config.lane.percentages.segment;

  const handleClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <>
      {data.map((lane, laneIndex) => {
        const y = laneIndex * (laneThickness + lanePadding) + config.layout.svgPad;
        return (
          <g key={`lane-${laneIndex}`} transform={`translate(0, ${y})`}>
            {lane.items.map((item, idx) => {
              if (item.type === "segment") {
                const segmentX = yearToX(item.start);
                const segmentWidth = yearToX(item.end) - yearToX(item.start);
                
                return (
                  <g 
                    key={`segment-${laneIndex}-${idx}`}
                    onMouseEnter={() => handleSegmentHover(laneIndex, idx)}
                    onClick={() => handleClick(item.url)}
                    style={{ cursor: item.url ? 'pointer' : 'default' }}
                  >
                    <rect
                      x={segmentX}
                      y={-segmentThickness / 2}
                      width={segmentWidth}
                      height={String(segmentThickness)}
                      className="swimlane-segment"
                    />
                  </g>
                );
              } else if (item.type === "point") {
                const pointX = yearToX(item.at);
                return (
                  <g
                    key={`point-${laneIndex}-${idx}`}
                    onClick={() => handleClick(item.url)}
                    style={{ cursor: item.url ? 'pointer' : 'default' }}
                  >
                    <circle
                      cx={pointX}
                      cy="0"
                      r={String(pointRadius)}
                      className={`swimlane-point ${item.category ? `point-${item.category}` : ''}`}
                      onMouseEnter={(e) => handlePointHover(e, item, pointX, y)}
                      onMouseLeave={() => handlePointHover(null)}
                    />
                  </g>
                );
              }
              return null;
            })}
          </g>
        );
      })}
    </>
  );
} 