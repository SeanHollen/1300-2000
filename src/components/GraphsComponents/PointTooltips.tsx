import { TooltipMeasurement, Tooltip } from "../types/tooltipMeasurement";
import { Point, Lane } from "../types/timelineData";
import { Config } from "../types/config";

type PointXY = {
  x: number;
  y: number;
};

type Props = {
  hoveredPointTooltip: Tooltip | null;
  tooltipMeasurements: TooltipMeasurement;
  config: Config;
  tooltipTextRef: (element: SVGTextElement | null) => void;
  constrainTooltipPosition: (x: number, width: number) => number;
  yearToX: (year: number) => number;
  timelineState: Lane[];
  showAllPointTooltips: boolean;
};

export default function hoveredPointTooltips({
  hoveredPointTooltip,
  tooltipMeasurements,
  config,
  tooltipTextRef,
  constrainTooltipPosition,
  yearToX,
  timelineState,
  showAllPointTooltips,
}: Props) {
  return (
    <>
      {hoveredPointTooltip && (
        <g
          transform={`translate(${constrainTooltipPosition(
            hoveredPointTooltip.x,
            tooltipMeasurements.width
          )}, ${hoveredPointTooltip.y - 25})`}
        >
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
            y="-7.5"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#374151"
          >
            {(() => {
              const year = hoveredPointTooltip.start
                ? `${hoveredPointTooltip.start}-${hoveredPointTooltip.end}`
                : hoveredPointTooltip.year;
              return `${hoveredPointTooltip.content} (${year})`;
            })()}
          </text>
        </g>
      )}
      {showAllPointTooltips &&
        timelineState &&
        timelineState.map((lane, laneIndex) => {
          const tooltipY = config.lane.getLaneYPos(laneIndex);
          return lane.items.map((item, itemIdx) => {
            if (item.type !== "point") {
              return null
            };
            const tooltipX = yearToX(item.at);
            const constrainedX = constrainTooltipPosition(
              tooltipX,
              tooltipMeasurements.width
            );
            return (<g
              key={`tooltip-${laneIndex}-${itemIdx}`}
              transform={`translate(0, ${tooltipY})`}
            >
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
            </g>);
          });
        })}
    </>
  );
}
