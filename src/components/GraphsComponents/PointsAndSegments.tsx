import React, { useMemo } from "react";
import { Lane, LaneItem, Point, Segment } from "../types/timelineData";
import { Config } from "../types/config";
import { isMobileDevice } from "../../utils/deviceUtils";
import { FaSkull } from "react-icons/fa";
import { FaDove } from "react-icons/fa";

type Props = {
  data: Lane[];
  config: Config;
  categoryStrategy: string;
  yearToX: (year: number) => number;
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
  config,
  categoryStrategy,
  yearToX,
  handleItemHover,
  handlePointHover,
  handlePointUnhover,
}: Props) {
  const pointRadius = config.point.radius;
  const laneDetails = config.lane.getLaneDetails();
  const isMobile = useMemo(() => isMobileDevice(), []);

  const handleItemClick = (item: LaneItem, laneIndex: number, y: number) => {
    if (!isMobile) {
      // open link
      item.url && window.open(item.url, "_blank");
      return;
    }
    if (item.type === "segment") {
      handleItemHover(laneIndex, item);
    } else {
      const pointX = yearToX(item.at);
      handlePointHover(
        {} as React.MouseEvent<SVGElement>,
        item,
        pointX,
        y
      );
    }
  };

  const pointColor = (category: string) => {
    const colorMap: any = {
      bad: "#d54b5b",
      neutral: "#666666",
      lightGray: "#808080",
      good: "#4CAF50",
      peace: "#4CAF50",
    };
    if (categoryStrategy !== "color") return colorMap.neutral;
    return colorMap[category] || colorMap.neutral;
  };

  const pointIcon = (category: string) => {
    const iconMap: any = {
      bad: FaSkull,
      peace: FaDove,
      neutral: null,
      good: null,
    };
    return iconMap[category] || null;
  };

  const getSegment = (item: Segment) => {
    return <rect
      x={yearToX(item.start)}
      y={-laneDetails.segmentThickness / 2}
      width={yearToX(item.end) - yearToX(item.start)}
      height={String(laneDetails.segmentThickness)}
      className="swimlane-segment"
    />
  }

  const getPoint = (item: Point, y: number) => {
    const IconComponent = pointIcon(item.category);
    return <>
      <circle
        cx={yearToX(item.at)}
        cy="0"
        r={String(pointRadius)}
        style={{ fill: pointColor(item.category) }}
        onMouseEnter={(e) =>
          handlePointHover(e, item, yearToX(item.at), y)
        }
        onMouseLeave={() => handlePointUnhover()}
      />
      {categoryStrategy === "icons" && IconComponent && (
        <foreignObject
          x={yearToX(item.at) - pointRadius}
          y={-pointRadius}
          width={pointRadius * 2}
          height={pointRadius * 2}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <IconComponent
              size={pointRadius * 1.2}
              color="white"
            />
          </div>
        </foreignObject>
      )}
    </>
  }

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
                      onClick={() => handleItemClick(item, laneIndex, y)}
                      style={{ cursor: item.url ? "pointer" : "default" }}
                    >
                      {item.type === "segment" ? getSegment(item) : getPoint(item, y)}
                    </g>
                  );
                })}
            </g>
          );
        })}
    </>
  );
}
