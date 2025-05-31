import React, { useRef, useEffect } from "react";
import { CiSettings } from "react-icons/ci";
import { LineTS, TSPoint, Range } from "../types/trendlineData";

export const findXValueForYear = (points: TSPoint[], year: number) => {
  if (!year) return null;
  let closestPoint = points[0];
  let minDistance = Math.abs(points[0].year - year);
  
  for (let i = 1; i < points.length; i++) {
    const distance = Math.abs(points[i].year - year);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = points[i];
    }
  }

  return closestPoint.value;
};

const hasDataAtYear = (points: TSPoint[], year: number) => {
  if (!year) return false;
  for (let i = 0; i < points.length - 1; i++) {
    if (points[i].year <= year && points[i + 1].year >= year) {
      return true;
    }
  }
  return false;
};

const formatValue = (value: number | null) => {
  if (value === null) return "";
  const withDecimals = parseFloat(value.toFixed(2)).toString();
  const withCommas = withDecimals
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return withCommas;
};

type Props = {
  lineChartData: LineTS[];
  hoveredYear: number | null;
  setModalOpen: (open: boolean) => void;
  modalOpen: boolean;
  onWrapChange: (height: number) => void;
};

export default function LineChartLegends({
  lineChartData,
  hoveredYear,
  setModalOpen,
  modalOpen,
  onWrapChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      onWrapChange(ref.current.clientHeight);
    }
  }, [onWrapChange, hoveredYear]);

  const showHoverView = hoveredYear && !modalOpen;
  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        zIndex: 1000,
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "10px",
        fontSize: "12px",
        fontFamily: "monospace",
      }}
    >
      <span style={{ display: "inline-block" }}>
        <CiSettings
          onClick={() => setModalOpen(true)}
          style={{
            fontSize: "1.2rem",
            verticalAlign: "middle",
            cursor: "pointer",
          }}
        />
      </span>
      {showHoverView &&
        lineChartData
          .filter(
            (lineData) =>
              lineData.toShow && hasDataAtYear(lineData.points, hoveredYear)
          )
          .map((lineData, i) => {
            const value = findXValueForYear(lineData.points, hoveredYear);
            return (
              <div key={lineData.id}>
                <a
                  href={lineData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: lineData.color,
                    cursor: "pointer",
                  }}
                >
                  {lineData.shortLabel || lineData.label}: {lineData.prefix}
                  {formatValue(value)}
                  {lineData.unit || ""}
                  <sup
                    style={{
                      fontSize: "0.6rem",
                    }}
                  >
                    {i}
                  </sup>
                </a>
              </div>
            );
          })}
      {!showHoverView &&
        lineChartData
          .filter((lineData) => lineData.toShow)
          .map((lineData) => {
            return (
              <div key={lineData.id}>
                <a
                  href={lineData.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: lineData.color,
                    cursor: "pointer",
                  }}
                >
                  {lineData.shortLabel || lineData.label}
                  {lineData.unit ? ", " : ""}
                  {lineData.unit || ""}
                </a>
              </div>
            );
          })}
    </div>
  );
}
