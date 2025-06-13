import { Lane } from "../types/timelineData";
import { Config } from "../types/config";
import { TooltipMeasurement } from "../types/tooltipMeasurement";

type Props = {
  data: Lane[];
  yearToX: (year: number) => number;
  config: Config;
  tooltipMeasurements: TooltipMeasurement;
  constrainTooltipPosition: (x: number, width: number) => number;
  timelineState: Lane[];
  showAllPointTooltips: boolean;
};

export default function SegmentTooltips({
  data,
  yearToX,
  config,
  tooltipMeasurements,
  constrainTooltipPosition,
  timelineState,
  showAllPointTooltips,
}: Props) {
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
                const segmentWidth = yearToX(item.end) - yearToX(item.start);
                const centerX = segmentX + segmentWidth / 2;
                const constrainedX = constrainTooltipPosition(
                  centerX,
                  tooltipMeasurements.width
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
