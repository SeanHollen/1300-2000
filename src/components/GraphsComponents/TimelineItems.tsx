import React from "react";
import { Lane, LaneItem, Point, Segment } from "../types/timelineData";
import { Config } from "../types/config";
import TimelinePoint from "./TimelinePoint";

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
    pointY: number,
    laneIndex: number
  ) => void;
  handlePointUnhover: () => void;
  isMobile: boolean;
};

export default function TimelineItems({
  data,
  config,
  categoryStrategy,
  yearToX,
  handleItemHover,
  handlePointHover,
  handlePointUnhover,
  isMobile,
}: Props) {
  const pointRadius = config.point.radius;
  const laneDetails = config.lane.getLaneDetails();

  const handleItemClick = (e: React.MouseEvent, item: LaneItem, laneIndex: number, y: number) => {
    e.preventDefault(); // Prevent default anchor navigation
    
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
        y,
        laneIndex
      );
    }
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
                  const content = (
                    <g
                      key={`${item.type}-${laneIndex}-${idx}`}
                      onMouseEnter={() => handleItemHover(laneIndex, item)}
                      onClick={(e) => handleItemClick(e, item, laneIndex, y)}
                      style={{ cursor: item.url ? "pointer" : "default" }}
                    >
                      {item.type === "segment" ? (
                        getSegment(item)
                      ) : (
                        <TimelinePoint
                          item={item}
                          y={y}
                          categoryStrategy={categoryStrategy}
                          yearToX={yearToX}
                          pointRadius={pointRadius}
                          laneIndex={laneIndex}
                          handlePointHover={handlePointHover}
                          handlePointUnhover={handlePointUnhover}
                        />
                      )}
                    </g>
                  );

                  return item.url ? (
                    <a key={`link-${item.type}-${laneIndex}-${idx}`} href={item.url} style={{ textDecoration: 'none' }}>
                      {content}
                    </a>
                  ) : content;
                })}
            </g>
          );
        })}
    </>
  );
}
