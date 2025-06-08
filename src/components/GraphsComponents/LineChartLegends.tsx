import { useRef, useEffect } from "react";
import { CiSettings } from "react-icons/ci";
import { LineTS, TSPoint } from "../types/trendlineData";

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
  isMobile: boolean;
};

export default function LineChartLegends({
  lineChartData,
  hoveredYear,
  setModalOpen,
  modalOpen,
  onWrapChange,
  isMobile,
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
      <button
        {...(isMobile
          ? { onClick: () => setModalOpen(true) }
          : {
              onMouseDown: (e) => {
                e.preventDefault();
                setModalOpen(true);
              },
            })}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
          backgroundColor: "transparent",
          border: "1px solid #ccc",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "12px",
          fontFamily: "monospace",
          color: "black",
          transition: "all 0.2s ease",
          verticalAlign: "middle",
          lineHeight: "1",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#4a90e2";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.borderColor = "#4a90e2";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "black";
          e.currentTarget.style.borderColor = "#ccc";
        }}
      >
        <CiSettings
          style={{
            fontSize: "1rem",
            verticalAlign: "middle",
          }}
        />
        <span>More</span>
      </button>
      {showHoverView &&
        lineChartData
          .filter((lineData) => lineData.toShow && lineData.hasDataForYear)
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
      {!showHoverView && !isMobile &&
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
                  {lineData.unit ? " " : ""}
                  {lineData.unit || ""}
                  {/** Add an empty superscript so that vertical spacing is the same as the other view */}
                  <sup
                    style={{
                      fontSize: "0.6rem",
                    }}
                  >
                    {" "}
                  </sup>
                </a>
              </div>
            );
          })}
    </div>
  );
}
