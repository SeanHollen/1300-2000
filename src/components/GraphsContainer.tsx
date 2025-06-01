import React, { useState, useRef, useEffect } from "react";
import { timelineData as _timelineData } from "../data/laneData/timelineData";
import { lineChartData as _lineChartData } from "../data/lineChartData/historicalTrends";
import LineChartLegends from "./GraphsComponents/LineChartLegends";
import LineChartLines from "./GraphsComponents/LineChartLines";
import XAxis from "./GraphsComponents/XAxis";
import SwimlaneLines from "./GraphsComponents/SwimlaneLines";
import CursorLine from "./GraphsComponents/CursorLine";
import PointsAndSegments from "./GraphsComponents/PointsAndSegments";
import SegmentTooltips from "./GraphsComponents/SegmentTooltips";
import PointTooltips from "./GraphsComponents/PointTooltips";
import SettingsModal from "./GraphsComponents/SettingsModal";
import "../styles/swimlanes.css";
import { Config } from "./types/config";
import { LaneItem, Point } from "./types/timelineData";
import { Tooltip } from "./types/tooltipMeasurement";

export default function GraphsContainer() {
  const USE_CACHE = false;
  const DEFAULT_CHART_WIDTH = 10000;
  const containerRef = useRef<HTMLDivElement>(null);

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
  (window as any).lineChartState = lineChartState;

  const [timelineState, setTimelineState] = useState(() => {
    const savedState = localStorage.getItem("timelineState");
    return USE_CACHE && savedState ? JSON.parse(savedState) : getTimelineData();
  });
  (window as any).timelineState = timelineState;

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

  const config: Config = {
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
      getUnit: (laneCount: number) =>
        (config.layout.windowHeight - 50) / (laneCount + 0.5),
      getThickness: (unit: number) => unit * config.lane.percentages.lane,
      getPadding: (unit: number) => unit * (1 - config.lane.percentages.lane),
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

  const tooltipTextRef = (element: SVGTextElement | null) => {
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

  const [pointTooltip, setPointTooltip] = useState<Tooltip | null>(null);

  const handlePointUnhover = () => {
    setPointTooltip(null);
  }

  const handlePointHover = (_e: React.MouseEvent<SVGElement>, item: Point, pointX: number, pointY: number) => {
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

  const [cursorX, setCursorX] = useState<number | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    const container = containerRef.current as HTMLDivElement | null;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !modalOpen) {
        document.documentElement.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel);

    return () => container.removeEventListener("wheel", handleWheel);
  }, [modalOpen]);

  const yearToX = (year: number) => {
    const yearPosition =
      (year - config.timeline.startYear) / config.timeline.getYearRange();
    return yearPosition * chartWidth;
  };

  const xToYear = (x: number) => {
    const yearPosition = x / chartWidth;
    return Math.round(
      config.timeline.startYear + yearPosition * config.timeline.getYearRange()
    );
  };

  const constrainTooltipPosition = (x: number, tooltipWidth: number) => {
    return Math.min(
      Math.max(x, tooltipWidth / 2 + config.tooltip.padding),
      chartWidth - tooltipWidth / 2 - config.tooltip.padding
    );
  };

  const [interactionOrder, setInteractionOrder] = useState<string[]>([]);

  const handleSegmentHover = (laneIndex: number, idx: number) => {
    const segmentId = `${laneIndex}-${idx}`;
    setInteractionOrder((prev: string[]) => {
      const newOrder = prev.filter((id) => id !== segmentId);
      return [...newOrder, segmentId];
    });
  };

  const totalHeight =
    timelineState.length * (laneThickness + lanePadding) + config.layout.svgPad;

  const updateLineChartState = (label: string, toShow: boolean) => {
    setLineChartState((prev: LaneItem[]) =>
      prev.map((item: LaneItem) =>
        item.label === label ? { ...item, toShow: toShow } : item
      )
    );
  };

  const updateChartWidth = (value: number) => {
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
        onWrapChange={(clientHeight: number) => {setAxisHeight(20 + clientHeight)}}
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
            handlePointUnhover={handlePointUnhover}
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
