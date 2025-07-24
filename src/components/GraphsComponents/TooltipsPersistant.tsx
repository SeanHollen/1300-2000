import { Lane } from "../types/timelineData";
import { Config } from "../types/config";
import { TooltipMeasurement } from "../types/tooltipMeasurement";
import { useState, useEffect } from "react";

type Props = {
  data: Lane[];
  yearToX: (year: number) => number;
  config: Config;
  tooltipMeasurements: TooltipMeasurement;
  constrainTooltipPosition: (x: number, width: number) => number;
  timelineState: Lane[];
  showAllPointTooltips: boolean;
};

function calculateSegmentTooltipPosition(
  segmentStartX: number,
  segmentEndX: number,
  tooltipText: string,
  scrollLeft: number,
  viewportWidth: number,
  padding: number
): number {
  const segmentWidth = segmentEndX - segmentStartX;
  const segmentCenterX = segmentStartX + segmentWidth / 2;
  
  const estimatedTextWidth = tooltipText.length * 6.5;
  const tooltipWidth = Math.max(estimatedTextWidth + 20, 60);
  
  const tooltipLeftEdge = segmentCenterX - tooltipWidth / 2;
  const tooltipRightEdge = segmentCenterX + tooltipWidth / 2;
  
  const minAllowedX = scrollLeft + padding;
  const maxAllowedX = scrollLeft + viewportWidth - padding;
  
  if (tooltipLeftEdge >= minAllowedX && tooltipRightEdge <= maxAllowedX) {
    return segmentCenterX;
  }
  
  const maxLeftShift = Math.min(segmentWidth, tooltipWidth / 2);
  const maxRightShift = Math.min(segmentWidth, tooltipWidth / 2);
  
  const leftmostTooltipCenter = segmentStartX + maxLeftShift;
  const rightmostTooltipCenter = segmentEndX - maxRightShift;
  
  if (segmentWidth < tooltipWidth) {
    return segmentCenterX;
  }
  
  let adjustedX = segmentCenterX;
  
  if (tooltipLeftEdge < minAllowedX) {
    const neededShift = minAllowedX - tooltipLeftEdge;
    adjustedX = Math.min(segmentCenterX + neededShift, rightmostTooltipCenter);
  } else if (tooltipRightEdge > maxAllowedX) {
    const neededShift = tooltipRightEdge - maxAllowedX;
    adjustedX = Math.max(segmentCenterX - neededShift, leftmostTooltipCenter);
  }
  
  return adjustedX;
}

export default function SegmentTooltips({
  data,
  yearToX,
  config,
  tooltipMeasurements,
  constrainTooltipPosition,
  timelineState,
  showAllPointTooltips,
}: Props) {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  useEffect(() => {
    const updateScrollPosition = () => {
      const currentScrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
      const currentViewportWidth = window.innerWidth;
      
      setScrollLeft(currentScrollLeft);
      setViewportWidth(currentViewportWidth);
    };

    updateScrollPosition();

    const handleScroll = () => {
      updateScrollPosition();
    };

    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {data.map((lane, laneIndex) => {
        const y = config.lane.getLaneYPos(laneIndex);
        return (
          <g key={`tooltips-${laneIndex}`}>
            {lane.items
              .sort((a, b) => {
                // if neither was hovered do deterministic sort order
                if (!a.hoveredTs && !b.hoveredTs) return Number(a.label) - Number(b.label);
                return (a.hoveredTs || 0) - (b.hoveredTs || 0);
              })
              .map((item, idx) => {
                if (item.type !== "segment") {
                  return undefined;
                }

                const segmentX = yearToX(item.start);
                const segmentEndX = yearToX(item.end);
                
                const constrainedX = calculateSegmentTooltipPosition(
                  segmentX,
                  segmentEndX,
                  `${item.label} (${item.start}-${
                    item.ongoing ? "present" : item.end
                  })`,
                  scrollLeft,
                  viewportWidth,
                  config.tooltip.padding
                );

                return (
                  <g
                    key={`tooltip-${laneIndex}-${idx}`}
                    transform={`translate(0, ${y})`}
                  >
                    <g transform={`translate(${constrainedX}, -25)`}>
                      <rect
                        id="tooltips-persistant-rect-1"
                        x={config.tooltip.segment.x}
                        y={config.tooltip.segment.y}
                        width={config.tooltip.segment.width}
                        height={config.tooltip.segment.height}
                        rx="5"
                        ry="5"
                        fill="white"
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth="1"
                        ref={(el) => {
                          if (el) {
                            const text = el.nextSibling as SVGGraphicsElement;
                            if (text) {
                              const bbox: SVGRect = text.getBBox();
                              el.setAttribute(
                                "width",
                                (bbox.width + 20).toString()
                              );
                              el.setAttribute(
                                "x",
                                (-bbox.width / 2 - 10).toString()
                              );
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
                        {`${item.label} (${item.start}-${
                          item.ongoing ? "present" : item.end
                        })`}
                      </text>
                    </g>
                  </g>
                );
              })}
          </g>
        );
      })}
      {showAllPointTooltips &&
        timelineState &&
        timelineState.map((lane, laneIndex) => {
          const tooltipY = config.lane.getLaneYPos(laneIndex);
          return lane.items
            .sort((a, b) => {
              // if neither was hovered do deterministic sort order
              if (!a.hoveredTs && !b.hoveredTs)
                return Number(a.label) - Number(b.label);
              return (a.hoveredTs || 0) - (b.hoveredTs || 0);
            })
            .map((item, itemIdx) => {
              if (item.type !== "point") {
                return null;
              }
              const tooltipX = yearToX(item.at);
              const constrainedX = constrainTooltipPosition(
                tooltipX,
                tooltipMeasurements.width
              );
              return (
                <g
                  key={`tooltip-${laneIndex}-${itemIdx}`}
                  transform={`translate(0, ${tooltipY})`}
                >
                  <g transform={`translate(${constrainedX}, -25)`}>
                    <rect
                      id="tooltips-persistant-rect-2"
                      x={config.tooltip.segment.x}
                      y={config.tooltip.segment.y}
                      width={config.tooltip.segment.width}
                      height={config.tooltip.segment.height}
                      rx="5"
                      ry="5"
                      fill="white"
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="1"
                      ref={(el) => {
                        if (el) {
                          const text = el.nextSibling as SVGGraphicsElement;
                          if (text) {
                            const bbox: SVGRect = text.getBBox();
                            el.setAttribute(
                              "width",
                              (bbox.width + 20).toString()
                            );
                            el.setAttribute(
                              "x",
                              (-bbox.width / 2 - 10).toString()
                            );
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
                      {(() => {
                        const year = item.start
                          ? `${item.start}-${item.end}`
                          : item.at;
                        return `${item.label} (${year})`;
                      })()}
                    </text>
                  </g>
                </g>
              );
            });
        })}
    </>
  );
}
