import React from "react";
import { Point } from "../types/timelineData";
import { FaSkull, FaDove } from "react-icons/fa";

type Props = {
  item: Point;
  y: number;
  categoryStrategy: string;
  yearToX: (year: number) => number;
  pointRadius: number;
  handlePointHover: (
    _e: React.MouseEvent<SVGElement>,
    item: Point,
    pointX: number,
    pointY: number
  ) => void;
  handlePointUnhover: () => void;
};

export default function TimelinePoint({
  item,
  y,
  categoryStrategy,
  yearToX,
  pointRadius,
  handlePointHover,
  handlePointUnhover,
}: Props) {
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

  const IconComponent = pointIcon(item.category);

  return (
    <>
      <circle
        cx={yearToX(item.at)}
        cy="0"
        r={String(pointRadius)}
        style={{ fill: pointColor(item.category) }}
        onMouseEnter={(e) => handlePointHover(e, item, yearToX(item.at), y)}
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
            <IconComponent size={pointRadius * 1.2} color="white" />
          </div>
        </foreignObject>
      )}
    </>
  );
}
