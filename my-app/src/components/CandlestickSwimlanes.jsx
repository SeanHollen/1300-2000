import React, { useState, useRef, useEffect } from "react";
import { mockData } from "../data/swimlaneRandomData";
import "../styles/swimlanes.css";
// import { Tooltip } from "@/components/ui/tooltip";

export default function CandlestickSwimlanes({ data = mockData }) {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipDimensions, setTooltipDimensions] = useState({ width: 120, x: -60 });
  const containerRef = useRef(null);

  const tooltipTextRef = (element) => {
    if (element) {
      const bbox = element.getBBox();
      const newWidth = bbox.width + 20;
      const newX = -bbox.width / 2 - 10;
      
      // Only update if dimensions have changed
      if (newWidth !== tooltipDimensions.width || newX !== tooltipDimensions.x) {
        setTooltipDimensions({
          width: newWidth,
          x: newX
        });
      }
    }
  };

  const handlePointHover = (e, item, pointX, pointY) => {
    if (!item) {
      setTooltip(null);
      return;
    }
    setTooltip({
      x: pointX,
      y: pointY,
      content: item.description,
    });
  };

  const svgPad = 100;
  const screenHeight = window.innerHeight - svgPad;
  const laneCount = data.length;
  const laneUnit = (screenHeight / laneCount);
  const lanePct = 0.1;
  const laneThickness = laneUnit * lanePct;
  const lanePadding = laneUnit * (1 - lanePct);
  const chartWidth = 5000;
  const segmentPct = 0.5;
  const segmentThickness = laneUnit * segmentPct;
  const pointRadius = 12;

  // Define the year range for the timeline
  const startYear = 1400;  // Adjust these values based on your needs
  const endYear = 2024;
  const yearRange = endYear - startYear;

  // Convert a year to x-coordinate
  const yearToX = (year) => {
    const yearPosition = (year - startYear) / yearRange;
    return yearPosition * chartWidth;
  };

  return (
    <div className="w-screen h-screen swimlane-container relative m-0" ref={containerRef}>
      <svg width={chartWidth} height={data.length * (laneThickness + lanePadding) + svgPad} className="overflow-hidden">
        {data.map((lane, laneIndex) => {
          const y = laneIndex * (laneThickness + lanePadding) + svgPad;
          return (
            <g key={laneIndex} transform={`translate(0, ${y})`}>
              <rect x="0" y={String(-laneThickness/2)} width={chartWidth} height={laneThickness} className="swimlane-lane" />
              {lane.items.map((item, idx) => {
                if (item.type === "segment") {
                  return (
                    <rect
                      key={idx}
                      x={yearToX(item.start)}
                      y={-segmentThickness / 2}
                      width={yearToX(item.end) - yearToX(item.start)}
                      height={String(segmentThickness)}
                      className="swimlane-segment"
                    />
                  );
                } else if (item.type === "point") {
                  const pointX = yearToX(item.at);
                  return (
                    <circle
                      key={idx}
                      cx={pointX}
                      cy="0"
                      r={String(pointRadius)}
                      className="swimlane-point"
                      onMouseEnter={(e) => handlePointHover(e, item, pointX, y)}
                      onMouseLeave={() => handlePointHover(null)}
                    />
                  );
                }
                return null;
              })}
            </g>
          );
        })}

        {/* Place the tooltip elements after all lanes are rendered */}
        {tooltip && (
          <g transform={`translate(${tooltip.x}, ${tooltip.y - 30})`}>
            <rect
              x={tooltipDimensions.x}
              y="-20"
              width={tooltipDimensions.width}
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
              y="-8"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#374151"
            >
              {tooltip.content}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
