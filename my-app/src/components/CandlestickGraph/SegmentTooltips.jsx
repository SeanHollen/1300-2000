import React from 'react';

export default function SegmentTooltips({
  data,
  yearToX,
  laneThickness,
  lanePadding,
  config,
  interactionOrder,
  tooltipMeasurements,
  constrainTooltipPosition
}) {
  return (
    <>
      {data.map((lane, laneIndex) => {
        const y = laneIndex * (laneThickness + lanePadding) + config.layout.svgPad;
        return (
          <g key={`tooltips-${laneIndex}`}>
            {lane.items
              .map((item, idx) => ({ item, idx, order: interactionOrder.indexOf(`${laneIndex}-${idx}`) }))
              .sort((a, b) => {
                // If neither has been interacted with, maintain original order
                if (a.order === -1 && b.order === -1) return 0;
                // If only one has been interacted with, it goes on top
                if (a.order === -1) return -1;
                if (b.order === -1) return 1;
                // Otherwise, sort by interaction order
                return a.order - b.order;
              })
              .map(({ item, idx }) => {
                if (item.type === "segment") {
                  const segmentX = yearToX(item.start);
                  const segmentWidth = yearToX(item.end) - yearToX(item.start);
                  const centerX = segmentX + segmentWidth / 2;
                  const constrainedX = constrainTooltipPosition(centerX, tooltipMeasurements.width);
                  
                  return (
                    <g key={`tooltip-${laneIndex}-${idx}`} transform={`translate(0, ${y})`}>
                      <g transform={`translate(${constrainedX}, -25)`}>
                        <rect
                          x={config.tooltip.segment.x}
                          y={config.tooltip.segment.y}
                          width={config.tooltip.segment.width}
                          height={config.tooltip.segment.height}
                          rx="5"
                          ry="5"
                          fill="white"
                          stroke="rgba(0,0,0,0.1)"
                          strokeWidth="1"
                          ref={el => {
                            if (el) {
                              const text = el.nextSibling;
                              if (text) {
                                const bbox = text.getBBox();
                                el.setAttribute('width', bbox.width + 20);
                                el.setAttribute('x', -bbox.width/2 - 10);
                              }
                            }
                          }}
                        />
                        <text
                          x="0"
                          y={config.tooltip.segment.textY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="12"
                          fill="#374151"
                        >
                          {`${item.label} (${item.start}-${item.ongoing ? 'present' : item.end})`}
                        </text>
                      </g>
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