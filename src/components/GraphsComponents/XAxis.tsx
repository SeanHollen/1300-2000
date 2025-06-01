import React from "react";
import { Config } from "../types/config";

type Props = {
  config: Config;
  yearToX: (year: number) => number;
  chartWidth: number;
};

export default function XAxis({ config, yearToX, chartWidth }: Props) {
  const startYear = config.timeline.startYear;
  const endYear = config.timeline.endYear;

  return (
    <g transform={`translate(0, ${config.layout.axisHeight})`}>
      {/* Draw axis line */}
      <line
        x1="0"
        y1="0"
        x2={chartWidth}
        y2="0"
        stroke="#374151"
        strokeWidth="1"
      />

      {/* Draw ticks */}
      {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
        .filter((year) => year % 10 === 0)
        .map((year) => {
          const x = yearToX(year);
          const isEdgeTick = year === startYear || year === endYear;

          return (
            <g key={year} transform={`translate(${x}, 0)`}>
              <line y1="0" y2="8" stroke="#374151" strokeWidth="1" />
              {!isEdgeTick && chartWidth >= 1900 && (
                <text y="20" textAnchor="middle" fontSize="12" fill="#374151">
                  {year}
                </text>
              )}
            </g>
          );
        })}
    </g>
  );
}
