import React from "react";
import { Lane, LaneItem, Point } from "../types/timelineData";
import { Config } from "../types/config";

type Props = {
  data: Lane[];
  yearToX: (year: number) => number;
  config: Config;
  handleItemHover: (laneIndex: number, highlighted: LaneItem) => void;
  handlePointHover: (
    _e: React.MouseEvent<SVGElement>,
    item: Point,
    pointX: number,
    pointY: number
  ) => void;
  handlePointUnhover: () => void;
};

export default function PointsAndSegments({
  data,
  yearToX,
  config,
  handleItemHover,
  handlePointHover,
  handlePointUnhover,
}: Props) {
  const pointRadius = config.point.radius;
  const laneDetails = config.lane.getLaneDetails();

  return (
    <>
      {data
        .filter((lane) => lane.toShow)
        .map((lane, laneIndex) => {
          const y = config.lane.getLaneYPos(laneIndex);
          return (
            <g key={`lane-${laneIndex}`} transform={`translate(0, ${y})`}>
              {lane.items
                .sort((a, b) =>
                  a.type === "segment" ? -1 : b.type === "segment" ? 1 : 0
                )
                .map((item, idx) => {                  
                  return (
                    <g 
                      key={`${item.type}-${laneIndex}-${idx}`}
                      onMouseEnter={() => handleItemHover(laneIndex, item)}
                      onClick={() => item.url && window.open(item.url, "_blank")}
                      style={{ cursor: item.url ? "pointer" : "default" }}
                    >
                      {item.type === "segment" ? (
                        <rect
                          x={yearToX(item.start)}
                          y={-laneDetails.segmentThickness / 2}
                          width={yearToX(item.end) - yearToX(item.start)}
                          height={String(laneDetails.segmentThickness)}
                          className="swimlane-segment"
                        />
                      ) : (
                        <circle
                          cx={yearToX(item.at)}
                          cy="0"
                          r={String(pointRadius)}
                          className={`swimlane-point ${
                            item.category ? `point-${item.category}` : ""
                          }`}
                          onMouseEnter={(e) => handlePointHover(e, item, yearToX(item.at), y)}
                          onMouseLeave={() => handlePointUnhover()}
                        />
                      )}
                    </g>
                  );
                })}
            </g>
          );
        })}
    </>
  );
}
