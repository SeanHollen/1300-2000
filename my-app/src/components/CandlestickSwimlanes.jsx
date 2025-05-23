import React, { useState, useRef, useEffect } from "react";
import { mockData } from "../data/swimlaneRandomData";
// import { mockData } from "../data/revolutionsData";
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
      content: item.label,
    });
  };

  const svgPad = 100;
  const laneCount = data.length;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const laneUnit = windowHeight / (laneCount + 0.5);
  const lanePct = 0.1;
  const laneThickness = laneUnit * lanePct;
  const lanePadding = laneUnit * (1 - lanePct);
  const chartWidth = 5000;
  const segmentPct = 0.5;
  const segmentThickness = laneUnit * segmentPct;
  const pointRadius = 12;
  const startYear = 1400;
  const endYear = 2024;
  const yearRange = endYear - startYear;

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
                  const segmentX = yearToX(item.start);
                  const segmentWidth = yearToX(item.end) - yearToX(item.start);
                  const centerX = segmentX + segmentWidth / 2;
                  
                  return (
                    <g key={idx}>
                      <rect
                        x={segmentX}
                        y={-segmentThickness / 2}
                        width={segmentWidth}
                        height={String(segmentThickness)}
                        className="swimlane-segment"
                      />
                      <g transform={`translate(${centerX}, -30)`}>
                        <rect
                          x="-60"
                          y="-20"
                          width="120"
                          height="24"
                          rx="5"
                          ry="5"
                          fill="white"
                          stroke="rgba(0,0,0,0.1)"
                          strokeWidth="1"
                          ref={el => {
                            if (el) {
                              const text = el.nextSibling;
                              if (text) {
                                const bbox = text.getBBox();
                                el.setAttribute('width', bbox.width + 20);
                                el.setAttribute('x', -bbox.width/2 - 10);
                              }
                            }
                          }}
                        />
                        <text
                          x="0"
                          y="-8"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="12"
                          fill="#374151"
                        >
                          {item.label}
                        </text>
                      </g>
                    </g>
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
