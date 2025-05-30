import React from "react";
import { interpolateYValueForYear } from "../util/interpolateYValueForYear";
import { Config } from "../types/config";
import { LineTS, TSPoint, Range } from "../types/trendlineData";

export const findYValueForYear = (points: TSPoint[], range: Range, year: number | null) => {
  if (!year) {
    return null;
  }
  // get value of closest point(s)
  const value = interpolateYValueForYear(points, year);

  const normalizedInterpolated = (value - range.start) / (range.end - range.start);
  return normalizedInterpolated;
};

function createLinePath(
  points: TSPoint[],
  range: Range,
  config: Config,
  totalHeight: number,
  yearToX: (year: number) => number
) {
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

type Props = {
  lineChartData: LineTS[];
  config: Config;
  yearToX: (year: number) => number;
  xToYear: (x: number) => number;
  totalHeight: number;
  cursorX: number | null;
  modalOpen: boolean;
};

export default function LineCharts({
  lineChartData,
  config,
  yearToX,
  xToYear,
  totalHeight,
  cursorX,
  modalOpen,
}: Props) {
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
            : undefined;

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
                  x={cursorX || undefined}
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
