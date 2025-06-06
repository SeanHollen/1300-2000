import React, { useState, useRef, useEffect } from "react";
import { timelineData as _timelineData } from "../data/laneData/timelineData";
import { lineChartData as _lineChartData } from "../data/lineChartData/historicalTrends";
import LineChartLegends from "./GraphsComponents/LineChartLegends";
import LineChartLines from "./GraphsComponents/LineChartLines";
import XAxis from "./GraphsComponents/XAxis";
import TimelineBackground from "./GraphsComponents/TimelineBackground";
import CursorLine from "./GraphsComponents/CursorLine";
import TimelineItems from "./GraphsComponents/TimelineItems";
import SegmentTooltips from "./GraphsComponents/SegmentTooltips";
import PointTooltips from "./GraphsComponents/PointTooltips";
import SettingsModal from "./GraphsComponents/SettingsModal";
import "../styles/swimlanes.css";
import { Config } from "./types/config";
import { LaneItem, Lane, Point } from "./types/timelineData";
import { Tooltip } from "./types/tooltipMeasurement";
import { LineTS, TSPoint } from "./types/trendlineData";

export default function GraphsContainer() {
  const USE_CACHE = false;
  const DEFAULT_CHART_WIDTH = 10000;
  const CATEGORY_STRATEGY = "icons";
  const containerRef = useRef<HTMLDivElement>(null);

  const getLineChartState = () => {
    return _lineChartData
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
    return USE_CACHE && savedState
      ? JSON.parse(savedState)
      : getLineChartState();
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

  const [showAllPointTooltips, setShowAllPointTooltips] = useState(false);

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

  useEffect(() => {
    localStorage.setItem(
      "showAllPointTooltips",
      showAllPointTooltips.toString()
    );
  }, [showAllPointTooltips]);

  const onRestoreDefaults = () => {
    setLineChartState(getLineChartState());
    setTimelineState(getTimelineData());
    setChartWidth(DEFAULT_CHART_WIDTH);
    setShowTimelineChart(true);
    setShowAllPointTooltips(false);
  };

  const [axisHeight, setAxisHeight] = useState(40);

  const filteredTimeline = timelineState.filter((lane: Lane) => lane.toShow);

  const config: Config = {
    layout: {
      svgPad: 140,
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
      getLaneDetails: () => {
        const laneUnit =
          (config.layout.windowHeight - 50) / (filteredTimeline.length + 0.5);
        const laneThickness = laneUnit * config.lane.percentages.lane;
        const lanePadding = laneUnit * (1 - config.lane.percentages.lane);
        const segmentThickness = laneUnit * config.lane.percentages.segment;
        return { laneUnit, laneThickness, lanePadding, segmentThickness };
      },
      getLaneYPos: (laneIndex: number) => {
        return (
          laneIndex * (laneDetails.laneThickness + laneDetails.lanePadding) +
          config.layout.svgPad
        );
      },
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

  const laneDetails = config.lane.getLaneDetails();

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
  };

  const handlePointHover = (
    _e: React.MouseEvent<SVGElement>,
    item: Point,
    pointX: number,
    pointY: number
  ) => {
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; scrollLeft: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      if (isDragging && dragStart) {
        const deltaX = e.clientX - dragStart.x;
        document.documentElement.scrollLeft = dragStart.scrollLeft - deltaX;
      }
      
      const scrollLeft = containerRef.current.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;
      setCursorX(x);
      setHoveredYear(xToYear(x));
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && !modalOpen) {
      // Check if the click target is an interactive element (has a cursor pointer style)
      const target = e.target as HTMLElement;
      const isInteractive = target.style.cursor === "pointer" || 
                           target.closest('[style*="cursor: pointer"]') ||
                           target.closest('.swimlane-segment');
      
      if (!isInteractive) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX,
          scrollLeft: document.documentElement.scrollLeft,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleMouseLeave = () => {
    setCursorX(null);
    setHoveredYear(null);
    setIsDragging(false);
    setDragStart(null);
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

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
    }
  }, [isDragging]);

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

  const handleItemHover = (laneIndex: number, highlighted: LaneItem) => {
    // timelineState[laneIndex].items.find(i => i === highlighted).hoveredTs = Date.now()
    setTimelineState((prev: Lane[]) =>
      prev.map((lane, li) => {
        if (li !== laneIndex) return lane;
        return {
          ...lane,
          items: lane.items.map((item) => {
            if (item !== highlighted) return item;
            return { 
              ...item, 
              hoveredTs: Date.now() 
            };
          }),
        };
      })
    );
  };

  const totalHeight =
    filteredTimeline.length *
      (laneDetails.laneThickness + laneDetails.lanePadding) +
    config.layout.svgPad;

  const toggleSelectTrendline = (label: string, toShow: boolean) => {
    setLineChartState((prev: LaneItem[]) =>
      prev.map((item: LaneItem) =>
        item.label === label ? { ...item, toShow: toShow } : item
      )
    );
  };

  const deselectAllTrendlines = () => {
    setLineChartState((prev: LaneItem[]) =>
      prev.map((item: LaneItem) => ({ ...item, toShow: false }))
    );
  };

  const updateChartWidth = (value: number) => {
    setChartWidth(value);
  };

  const hasDataAtYear = (points: TSPoint[], year: number | null) => {
    if (!year) return false;
    for (let i = 0; i < points.length - 1; i++) {
      if (points[i].year <= year && points[i + 1].year >= year) {
        return true;
      }
    }
    return false;
  };

  const markedLineChartData = lineChartState.map((lineData: LineTS) => {
    return {
      ...lineData,
      hasDataForYear: hasDataAtYear(lineData.points, hoveredYear),
    };
  });

  return (
    <div
      className="w-screen h-screen swimlane-container relative m-0"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      <LineChartLegends
        lineChartData={markedLineChartData}
        hoveredYear={hoveredYear}
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        onWrapChange={(clientHeight: number) => {
          setAxisHeight(20 + clientHeight);
        }}
      />

      {modalOpen && (
        <SettingsModal
          lineChartData={markedLineChartData}
          onClose={() => setModalOpen(false)}
          onToggleSelectTendline={toggleSelectTrendline}
          onDeselectAllTrendlines={deselectAllTrendlines}
          onSliderChange={updateChartWidth}
          sliderValue={chartWidth}
          onRestoreDefaults={onRestoreDefaults}
          setShowTimelineChart={setShowTimelineChart}
          showTimelineChart={showTimelineChart}
          showAllPointTooltips={showAllPointTooltips}
          setShowAllPointTooltips={setShowAllPointTooltips}
        />
      )}

      <svg width={chartWidth} height={totalHeight} className="overflow-hidden">
        <TimelineBackground
          data={filteredTimeline}
          config={config}
          chartWidth={chartWidth}
          showTimelineChart={showTimelineChart}
        />

        <LineChartLines
          lineChartData={markedLineChartData}
          config={config}
          yearToX={yearToX}
          totalHeight={totalHeight}
          cursorX={cursorX}
          modalOpen={modalOpen}
          hoveredYear={hoveredYear}
          showTimelineChart={showTimelineChart}
        />

        <XAxis config={config} yearToX={yearToX} chartWidth={chartWidth} />

        {!modalOpen && (
          <CursorLine
            cursorX={cursorX}
            config={config}
            totalHeight={totalHeight}
            xToYear={xToYear}
          />
        )}

        {showTimelineChart && (
          <TimelineItems
            data={filteredTimeline}
            config={config}
            categoryStrategy={CATEGORY_STRATEGY}
            yearToX={yearToX}
            handleItemHover={handleItemHover}
            handlePointHover={handlePointHover}
            handlePointUnhover={handlePointUnhover}
          />
        )}

        {showTimelineChart && (
          <SegmentTooltips
            data={filteredTimeline}
            yearToX={yearToX}
            config={config}
            tooltipMeasurements={tooltipMeasurements}
            constrainTooltipPosition={constrainTooltipPosition}
          />
        )}

        <PointTooltips
          config={config}
          hoveredPointTooltip={pointTooltip}
          tooltipMeasurements={tooltipMeasurements}
          tooltipTextRef={tooltipTextRef}
          constrainTooltipPosition={constrainTooltipPosition}
          yearToX={yearToX}
          timelineState={filteredTimeline}
          showAllPointTooltips={showAllPointTooltips && showTimelineChart}
        />
      </svg>
    </div>
  );
}
