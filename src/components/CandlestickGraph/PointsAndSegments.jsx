import React from 'react';

export default function PointsAndSegments({
  data,
  yearToX,
  laneThickness,
  lanePadding,
  config,
  handleSegmentHover,
  handlePointHover,
  onMobile,
  handlePointClick,
  handleSegmentClick
}) {
  const pointRadius = config.point.radius;
  const laneUnit = laneThickness / config.lane.percentages.lane;
  const segmentThickness = laneUnit * config.lane.percentages.segment;

  const handleItemClick = (e, item, type, laneIndex, itemIndex, pointXValue, pointYValue) => {
    if (onMobile) {
      if (type === "point") {
        handlePointClick(e, item, pointXValue, pointYValue);
      } else if (type === "segment") {
        handleSegmentClick(laneIndex, itemIndex);
      }
    }

    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <>
      {data.map((lane, laneIndex) => {
        const y = laneIndex * (laneThickness + lanePadding) + config.layout.svgPad;
        return (
          <g key={`lane-${laneIndex}`} transform={`translate(0, ${y})`}>
            {lane.items
              .sort((a, b) => (a.type === "segment" ? -1 : b.type === "segment" ? 1 : 0))
              .map((item, idx) => {
                if (item.type === "segment") {
                  const segmentX = yearToX(item.start);
                  const segmentWidth = yearToX(item.end) - yearToX(item.start);

                  return (
                    <g
                      key={`segment-${laneIndex}-${idx}`}
                      onMouseEnter={() => !onMobile && handleSegmentHover(laneIndex, idx)}
                      onClick={(e) => handleItemClick(e, item, "segment", laneIndex, idx)}
                      style={{ cursor: item.url || onMobile ? 'pointer' : 'default' }}
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
                      onClick={(e) => handleItemClick(e, item, "point", laneIndex, idx, pointX, y)}
                      style={{ cursor: item.url || onMobile ? 'pointer' : 'default' }}
                    >
                      <circle
                        cx={pointX}
                        cy="0"
                        r={String(pointRadius)}
                        className={`swimlane-point ${item.category ? `point-${item.category}` : ''}`}
                        onMouseEnter={(e) => !onMobile && handlePointHover(e, item, pointX, y)}
                        onMouseLeave={() => !onMobile && handlePointHover(null)}
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