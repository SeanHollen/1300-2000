import React, { useState, useRef, useEffect } from "react";
import { historicalData } from "../data/laneData/timelineData";
import { lineChartData } from "../data/lineChartData/historicalTrends";
import LineChartLegends from "./CandlestickGraph/LineChartLegends";
import SwimlaneLines from "./CandlestickGraph/SwimlaneLines";
import XAxis from "./CandlestickGraph/XAxis";
import SwimlneIcons from "./CandlestickGraph/SwimlneIcons";
import CursorLine from "./CandlestickGraph/CursorLine";
import PointsAndSegments from "./CandlestickGraph/PointsAndSegments";
import SegmentTooltips from "./CandlestickGraph/SegmentTooltips";
import PointTooltips from "./CandlestickGraph/PointTooltips";
import "../styles/swimlanes.css";

export default function CandlestickGraph({ data = historicalData }) {
  const [pointTooltip, setPointTooltip] = useState(null);
  const [tooltipMeasurements, setTooltipMeasurements] = useState({ width: 120, x: -60 });
  const [interactionOrder, setInteractionOrder] = useState([]);
  const [cursorX, setCursorX] = useState(null);
  const [hoveredYear, setHoveredYear] = useState(null);
  const containerRef = useRef(null);

  const config = {
    layout: {
      svgPad: 150,
      axisHeight: 40,
      chartWidth: 5000,
      windowHeight: typeof window !== 'undefined' ? window.innerHeight - 20 : 800,
      bottomPadding: 20
    },
    lane: {
      percentages: {
        lane: 0.1,
        segment: 0.5
      },
      getUnit: (laneCount) => (config.layout.windowHeight - 50) / (laneCount + 0.5),
      getThickness: (unit) => unit * config.lane.percentages.lane,
      getPadding: (unit) => unit * (1 - config.lane.percentages.lane),
    },
    point: {
      radius: 12,
      iconRadius: 20
    },
    timeline: {
      startYear: 1300,
      endYear: 2000,
      getYearRange: () => config.timeline.endYear - config.timeline.startYear
    },
    tooltip: {
      defaultWidth: 120,
      defaultX: -60,
      padding: 10,
      yearLabelWidth: 40,
      yearLabelHeight: 20,
      yearLabelOffset: {
        x: -20,
        y: 12
      },
      segment: {
        x: -60,
        y: -20,
        width: 120,
        height: 24,
        textY: -8
      }
    }
  };

  const laneCount = data.length;
  const laneUnit = config.lane.getUnit(laneCount);
  const laneThickness = config.lane.getThickness(laneUnit);
  const lanePadding = config.lane.getPadding(laneUnit);
  const chartWidth = config.layout.chartWidth;
  const pointRadius = config.point.radius;

  const tooltipTextRef = (element) => {
    if (element) {
      const bbox = element.getBBox();
      const newWidth = bbox.width + 20;
      const newX = -bbox.width / 2 - 10;
      
      if (newWidth !== tooltipMeasurements.width || newX !== tooltipMeasurements.x) {
        setTooltipMeasurements({
          width: newWidth,
          x: newX
        });
      }
    }
  };

  const handlePointHover = (e, item, pointX, pointY) => {
    if (!item) {
      setPointTooltip(null);
      return;
    }
    setPointTooltip({
      x: pointX,
      y: pointY,
      year: item.at,
      start: item.start,
      end: item.end,
      content: item.label,
    });
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;
      setCursorX(x);
      setHoveredYear(xToYear(x));
    }
  };

  const handleMouseLeave = () => {
    setCursorX(null);
    setHoveredYear(null);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        document.documentElement.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel);
    
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const yearToX = (year) => {
    const yearPosition = (year - config.timeline.startYear) / config.timeline.getYearRange();
    return yearPosition * chartWidth;
  };

  const xToYear = (x) => {
    const yearPosition = x / chartWidth;
    return Math.round(config.timeline.startYear + yearPosition * config.timeline.getYearRange());
  };

  const constrainTooltipPosition = (x, tooltipWidth) => {
    return Math.min(
      Math.max(x, tooltipWidth/2 + config.tooltip.padding), 
      chartWidth - tooltipWidth/2 - config.tooltip.padding
    );
  };

  const handleSegmentHover = (laneIndex, idx) => {
    const segmentId = `${laneIndex}-${idx}`;
    setInteractionOrder(prev => {
      const newOrder = prev.filter(id => id !== segmentId);
      return [...newOrder, segmentId];
    });
  };

  const totalHeight = data.length * (laneThickness + lanePadding) + config.layout.svgPad;

  return (
    <div 
      className="w-screen h-screen swimlane-container relative m-0" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <LineChartLegends lineChartData={lineChartData} hoveredYear={hoveredYear} />

      <svg width={chartWidth} height={totalHeight} className="overflow-hidden">
        <SwimlaneLines 
          lineChartData={lineChartData}
          config={config}
          yearToX={yearToX}
          totalHeight={totalHeight}
        />

        <XAxis 
          config={config}
          yearToX={yearToX}
          chartWidth={chartWidth}
        />

        <SwimlneIcons 
          data={data}
          config={config}
          chartWidth={chartWidth}
          laneThickness={laneThickness}
          lanePadding={lanePadding}
        />

        <CursorLine 
          cursorX={cursorX}
          config={config}
          totalHeight={totalHeight}
          xToYear={xToYear}
        />

        <PointsAndSegments 
          data={data}
          yearToX={yearToX}
          laneThickness={laneThickness}
          lanePadding={lanePadding}
          config={config}
          handleSegmentHover={handleSegmentHover}
          handlePointHover={handlePointHover}
        />

        <SegmentTooltips 
          data={data}
          yearToX={yearToX}
          laneThickness={laneThickness}
          lanePadding={lanePadding}
          config={config}
          interactionOrder={interactionOrder}
          tooltipMeasurements={tooltipMeasurements}
          constrainTooltipPosition={constrainTooltipPosition}
        />

        <PointTooltips 
          pointTooltip={pointTooltip}
          tooltipMeasurements={tooltipMeasurements}
          tooltipTextRef={tooltipTextRef}
          constrainTooltipPosition={constrainTooltipPosition}
        />
      </svg>
    </div>
  );
}
