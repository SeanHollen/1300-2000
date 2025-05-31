import React from "react";
import { findYValueForYear } from "../util/findYValueForYear";

function createLinePath(points, range, config, totalHeight, yearToX) {
  return points.reduce((path, point, i) => {
    const x = yearToX(point.year);
    const normalizedValue =
      (point.value - range.start) / (range.end - range.start);
    const y =
      totalHeight -
      config.layout.bottomPadding -
      normalizedValue *
        (totalHeight - config.layout.bottomPadding - config.layout.axisHeight);
    return path + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
  }, "");
}

export default function LineCharts({
  lineChartData,
  config,
  yearToX,
  xToYear,
  totalHeight,
  cursorX,
  modalOpen,
}) {
  return (
    <>
      {lineChartData
        .filter((lineData) => lineData.toShow)
        .map((lineData, i) => {
          const year = typeof cursorX === "number" ? xToYear(cursorX) : cursorX;
          const normalizedY = findYValueForYear(
            lineData.points,
            lineData.range,
            year
          );
          const yPosition = normalizedY
            ? totalHeight -
              config.layout.bottomPadding -
              normalizedY *
                (totalHeight -
                  config.layout.bottomPadding -
                  config.layout.axisHeight)
            : null;

          return (
            <g key={lineData.id}>
              <path
                d={createLinePath(
                  lineData.points,
                  lineData.range,
                  config,
                  totalHeight,
                  yearToX
                )}
                stroke={lineData.color}
                strokeWidth="1.5"
                fill="none"
                opacity="0.4"
              />
              {!modalOpen && normalizedY && (
                <text
                  x={typeof cursorX === "number" ? cursorX : yearToX(cursorX)}
                  y={yPosition}
                  fill={lineData.color}
                  fontSize="0.6rem"
                  fontFamily="monospace"
                  opacity="0.7"
                  dy="-5"
                >
                  {i}
                </text>
              )}
            </g>
          );
        })}
    </>
  );
}
