import React from "react";
import { Point } from "../types/timelineData";
import { FaSkull, FaDove, FaLightbulb, FaScroll, FaCompass, FaPaintBrush } from "react-icons/fa";
import { CiBank } from "react-icons/ci";
import { GiSwordClash } from "react-icons/gi";
import { RiBankFill } from "react-icons/ri";


type Props = {
  item: Point;
  y: number;
  categoryStrategy: string;
  yearToX: (year: number) => number;
  pointRadius: number;
  laneIndex: number;
  handlePointHover: (
    _e: React.MouseEvent<SVGElement>,
    item: Point,
    pointX: number,
    pointY: number,
    laneIndex: number
  ) => void;
  handlePointUnhover: () => void;
};

export default function TimelinePoint({
  item,
  y,
  categoryStrategy,
  yearToX,
  pointRadius,
  laneIndex,
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
      lightbulb: "#4CAF50",
      scroll: "#666666",
      compass: "#666666",
      paintbrush: "#4CAF50",
      sword: "#666666",
      bank: "#4CAF50",
    };
    if (categoryStrategy !== "color") return colorMap.neutral;
    return colorMap[category] || colorMap.neutral;
  };

  const pointIcon = (category: string) => {
    const iconMap: any = {
      bad: FaSkull,
      peace: FaDove,
      lightbulb: FaLightbulb,
      writing: FaScroll,
      document: FaScroll,
      exchange: FaCompass,
      art: FaPaintBrush,
      conflict: GiSwordClash,
      institution: RiBankFill,
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
        onMouseEnter={(e) => handlePointHover(e, item, yearToX(item.at), y, laneIndex)}
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
