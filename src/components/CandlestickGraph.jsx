import React, { useState, useRef, useEffect } from "react";
import { timelineData as _timelineData } from "../data/laneData/timelineData";
import { lineChartData as _lineChartData } from "../data/lineChartData/historicalTrends";
import LineChartLegends from "./CandlestickGraph/LineChartLegends";
import LineChartLines from "./CandlestickGraph/LineChartLines";
import XAxis from "./CandlestickGraph/XAxis";
import SwimlaneLines from "./CandlestickGraph/SwimlaneLines";
import CursorLine from "./CandlestickGraph/CursorLine";
import PointsAndSegments from "./CandlestickGraph/PointsAndSegments";
import SegmentTooltips from "./CandlestickGraph/SegmentTooltips";
import PointTooltips from "./CandlestickGraph/PointTooltips";
import SettingsModal from "./CandlestickGraph/SettingsModal";
import "../styles/swimlanes.css";

export default function CandlestickGraph() {
  const USE_CACHE = false;
  const DEFAULT_CHART_WIDTH = 10000;
  const containerRef = useRef(null);

  const getLineChartState = () => {
    return _lineChartData
      .map((item) => ({ ...item }))
      .map((item) => ({
        ...item,
        points: item.points.sort((a, b) => a.year - b.year),
      }))
      .sort((a, b) => {
        const aLength = a.points[a.points.length - 1].year - a.points[0].year;
        const bLength = b.points[b.points.length - 1].year - b.points[0].year;
        return bLength - aLength;
      });
  };

  const getTimelineData = () => {
    return _timelineData.map((item) => ({ ...item }));
  };

  const [lineChartState, setLineChartState] = useState(() => {
    const savedState = localStorage.getItem("lineChartState");
    return USE_CACHE && savedState ? JSON.parse(savedState) : getLineChartState();
  });
  window.lineChartState = lineChartState;

  const [timelineState, setTimelineState] = useState(() => {
    const savedState = localStorage.getItem("timelineState");
    return USE_CACHE && savedState ? JSON.parse(savedState) : getTimelineData();
  });
  window.timelineState = timelineState;

  const [chartWidth, setChartWidth] = useState(() => {
    const savedWidth = localStorage.getItem("chartWidth");
    return USE_CACHE && savedWidth ? Number(savedWidth) : DEFAULT_CHART_WIDTH;
  });

  const [showTimelineChart, setShowTimelineChart] = useState(() => {
    const savedState = localStorage.getItem("showTimelineChart");
    return USE_CACHE && savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem("lineChartState", JSON.stringify(lineChartState));
  }, [lineChartState]);

  useEffect(() => {
    localStorage.setItem("timelineState", JSON.stringify(timelineState));
  }, [timelineState]);

  useEffect(() => {
    localStorage.setItem("chartWidth", chartWidth.toString());
  }, [chartWidth]);

  useEffect(() => {
    localStorage.setItem("showTimelineChart", showTimelineChart.toString());
  }, [showTimelineChart]);

  const onRestoreDefaults = () => {
    setLineChartState(getLineChartState());
    setTimelineState(getTimelineData());
    setChartWidth(DEFAULT_CHART_WIDTH);
    setShowTimelineChart(true);
  };

  const [axisHeight, setAxisHeight] = useState(40);

  const config = {
    layout: {
      svgPad: 150,
      axisHeight: axisHeight,
      windowHeight:
        typeof window !== "undefined" ? window.innerHeight - 20 : 800,
      bottomPadding: 20,
    },
    lane: {
      percentages: {
        lane: 0.1,
        segment: 0.5,
      },
      getUnit: (laneCount) =>
        (config.layout.windowHeight - 50) / (laneCount + 0.5),
      getThickness: (unit) => unit * config.lane.percentages.lane,
      getPadding: (unit) => unit * (1 - config.lane.percentages.lane),
    },
    point: {
      radius: 12,
      iconRadius: 20,
    },
    timeline: {
      startYear: 1300,
      endYear: 2000,
      getYearRange: () => config.timeline.endYear - config.timeline.startYear,
    },
    tooltip: {
      defaultWidth: 120,
      defaultX: -60,
      padding: 10,
      yearLabelWidth: 40,
      yearLabelHeight: 20,
      yearLabelOffset: {
        x: -20,
        y: 12,
      },
      segment: {
        x: -60,
        y: -20,
        width: 120,
        height: 24,
        textY: -8,
      },
    },
  };

  const laneCount = timelineState.length;
  const laneUnit = config.lane.getUnit(laneCount);
  const laneThickness = config.lane.getThickness(laneUnit);
  const lanePadding = config.lane.getPadding(laneUnit);

  const [tooltipMeasurements, setTooltipMeasurements] = useState({
    width: 120,
    x: -60,
  });

  const tooltipTextRef = (element) => {
    if (element) {
      const bbox = element.getBBox();
      const newWidth = bbox.width + 20;
      const newX = -bbox.width / 2 - 10;

      if (
        newWidth !== tooltipMeasurements.width ||
        newX !== tooltipMeasurements.x
      ) {
        setTooltipMeasurements({
          width: newWidth,
          x: newX,
        });
      }
    }
  };

  const [pointTooltip, setPointTooltip] = useState(null);

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

  const [cursorX, setCursorX] = useState(null);
  const [hoveredYear, setHoveredYear] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !modalOpen) {
        document.documentElement.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel);

    return () => container.removeEventListener("wheel", handleWheel);
  }, [modalOpen]);

  const yearToX = (year) => {
    const yearPosition =
      (year - config.timeline.startYear) / config.timeline.getYearRange();
    return yearPosition * chartWidth;
  };

  const xToYear = (x) => {
    const yearPosition = x / chartWidth;
    return Math.round(
      config.timeline.startYear + yearPosition * config.timeline.getYearRange()
    );
  };

  const constrainTooltipPosition = (x, tooltipWidth) => {
    return Math.min(
      Math.max(x, tooltipWidth / 2 + config.tooltip.padding),
      chartWidth - tooltipWidth / 2 - config.tooltip.padding
    );
  };

  const [interactionOrder, setInteractionOrder] = useState([]);

  const handleSegmentHover = (laneIndex, idx) => {
    const segmentId = `${laneIndex}-${idx}`;
    setInteractionOrder((prev) => {
      const newOrder = prev.filter((id) => id !== segmentId);
      return [...newOrder, segmentId];
    });
  };

  const totalHeight =
    timelineState.length * (laneThickness + lanePadding) + config.layout.svgPad;

  const updateLineChartState = (label, toShow) => {
    setLineChartState((prev) =>
      prev.map((item) =>
        item.label === label ? { ...item, toShow: toShow } : item
      )
    );
  };

  const updateChartWidth = (value) => {
    setChartWidth(value);
  };

  return (
    <div
      className="w-screen h-screen swimlane-container relative m-0"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <LineChartLegends
        lineChartData={lineChartState}
        hoveredYear={hoveredYear}
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        onWrapChange={(clientHeight) => {setAxisHeight(20 + clientHeight)}}
      />

      {modalOpen && (
        <SettingsModal
          lineChartData={lineChartState}
          onClose={() => setModalOpen(false)}
          onToggle={updateLineChartState}
          onSliderChange={updateChartWidth}
          sliderValue={chartWidth}
          onRestoreDefaults={onRestoreDefaults}
          setShowTimelineChart={setShowTimelineChart}
          showTimelineChart={showTimelineChart}
        />
      )}

      <svg width={chartWidth} height={totalHeight} className="overflow-hidden">
        <LineChartLines
          lineChartData={lineChartState}
          config={config}
          yearToX={yearToX}
          xToYear={xToYear}
          totalHeight={totalHeight}
          cursorX={cursorX}
          modalOpen={modalOpen}
        />

        <XAxis config={config} yearToX={yearToX} chartWidth={chartWidth} />

        <SwimlaneLines
          data={timelineState}
          config={config}
          chartWidth={chartWidth}
          laneThickness={laneThickness}
          lanePadding={lanePadding}
          showTimelineChart={showTimelineChart}
        />

        {!modalOpen && (
          <CursorLine
            cursorX={cursorX}
            config={config}
            totalHeight={totalHeight}
            xToYear={xToYear}
          />
        )}

        {showTimelineChart && (
          <PointsAndSegments
            data={timelineState}
            yearToX={yearToX}
            laneThickness={laneThickness}
            lanePadding={lanePadding}
            config={config}
            handleSegmentHover={handleSegmentHover}
            handlePointHover={handlePointHover}
          />
        )}

        {showTimelineChart && (
          <SegmentTooltips
            data={timelineState}
            yearToX={yearToX}
            laneThickness={laneThickness}
            lanePadding={lanePadding}
            config={config}
            interactionOrder={interactionOrder}
            tooltipMeasurements={tooltipMeasurements}
            constrainTooltipPosition={constrainTooltipPosition}
          />
        )}

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
