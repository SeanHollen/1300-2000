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
  timelineState: Lane[];
  showAllPointTooltips: boolean;
};

export default function hoveredPointTooltips({
  hoveredPointTooltip,
  tooltipMeasurements,
  config,
  tooltipTextRef,
  constrainTooltipPosition,
  timelineState,
  showAllPointTooltips,
}: Props) {
  const laneDetails = config.lane.getLaneDetails();
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
          const y = config.lane.getLaneYPos(laneIndex);
          return <div>

          </div>;
        })}
    </>
  );
}
