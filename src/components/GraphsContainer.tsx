import React, { useState, useRef, useEffect, useMemo } from "react";
import { timelineData as _timelineData } from "../data/laneData/timelineData";
import { lineChartData as _lineChartData } from "../data/lineChartData/historicalTrends";
import { isMobileDevice } from "../utils/deviceUtils";
import { useCursor } from "../utils/useCursor";
import { createConfig } from "../utils/createConfig";
import LineChartLegends from "./GraphsComponents/LineChartLegends";
import LineChartLines from "./GraphsComponents/LineChartLines";
import XAxis from "./GraphsComponents/XAxis";
import TimelineBackground from "./GraphsComponents/TimelineBackground";
import CursorLine, { CursorLineRef } from "./GraphsComponents/CursorLine";
import TimelineItems from "./GraphsComponents/TimelineItems";
import TooltipsPersistant from "./GraphsComponents/TooltipsPersistant";
import TooltipFromHover from "./GraphsComponents/TooltipFromHover";
import SettingsModal from "./GraphsComponents/SettingsModal";
import "../styles/swimlanes.css";
import { LaneItem, Lane, Point } from "./types/timelineData";
import { Tooltip } from "./types/tooltipMeasurement";
import { LineTS, TSPoint } from "./types/trendlineData";
import { getOptimizedImageUrl } from "../utils/imageUtils";
import { USE_CACHE, DEFAULT_CHART_WIDTH, CATEGORY_STRATEGY, SHOW_TOOLTIP_IMAGES } from "../constants";

export default function GraphsContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorLineRef = useRef<CursorLineRef>(null);

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

  const [showTooltipImages, setShowTooltipImages] = useState(() => {
    const savedState = localStorage.getItem("showTooltipImages");
    return USE_CACHE && savedState ? JSON.parse(savedState) : SHOW_TOOLTIP_IMAGES;
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

  useEffect(() => {
    localStorage.setItem(
      "showAllPointTooltips",
      showAllPointTooltips.toString()
    );
  }, [showAllPointTooltips]);

  useEffect(() => {
    localStorage.setItem("showTooltipImages", showTooltipImages.toString());
  }, [showTooltipImages]);

  const onRestoreDefaults = () => {
    setLineChartState(getLineChartState());
    setTimelineState(getTimelineData());
    setChartWidth(DEFAULT_CHART_WIDTH);
    setShowTimelineChart(true);
    setShowAllPointTooltips(false);
    setShowTooltipImages(SHOW_TOOLTIP_IMAGES);
  };

  const isMobile = useMemo(() => isMobileDevice(), []);

  const [axisHeight, setAxisHeight] = useState(46);

  const filteredTimeline = timelineState.filter((lane: Lane) => lane.toShow);

  const config = useMemo(() => createConfig({
    axisHeight,
    filteredTimeline,
  }), [axisHeight, filteredTimeline]);

  const laneDetails = config.lane.getLaneDetails();

  const [tooltipMeasurements, setTooltipMeasurements] = useState({
    width: 120,
    x: -60,
  });

   useEffect(() => {
    const prefetchImage = (imageUrl: string) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = imageUrl;
      // image is no where visible, but since it's part of the
      // html, it's "cached" for use elsewhere
      document.head.appendChild(link);
    };
    
    const prefetchImages = () => {
      const getStart = (item: LaneItem) => {
        return item.type === "point" ? item.at : item.start;
      };

      const urls = timelineState
        .flatMap((lane: Lane) => lane.items)
        .sort((a: LaneItem, b: LaneItem) => getStart(a) - getStart(b))
        .map((item: LaneItem) => getOptimizedImageUrl(item.imageUrl, config))
        .filter((url: string) => url);
        
      urls.forEach((url: string) => {
        prefetchImage(url);
      });
    };
    
    setTimeout(prefetchImages, 0);
  }, []);

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
    pointY: number,
    laneIndex: number
  ) => {
    if (!item) {
      setPointTooltip(null);
      return;
    }
    setPointTooltip({
      x: pointX,
      y: pointY,
      item,
      laneIndex,
    });
  };

  const [modalOpen, setModalOpen] = useState(false);

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

  const {
    debouncedCursorX,
    hoveredYear,
    isDragging,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
  } = useCursor({
    containerRef,
    cursorLineRef,
    xToYear,
    modalOpen,
  });

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
    config.layout.svgPad / 2;

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
        isMobile={isMobile}
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
          showTooltipImages={showTooltipImages}
          setShowTooltipImages={setShowTooltipImages}
          isMobile={isMobile}
        />
      )}

      <svg width={chartWidth} height={totalHeight} className="overflow-hidden">
        <TimelineBackground
          data={filteredTimeline}
          config={config}
          chartWidth={chartWidth}
          showTimelineChart={showTimelineChart}
          isMobile={isMobile}
        />

        <LineChartLines
          lineChartData={markedLineChartData}
          config={config}
          yearToX={yearToX}
          totalHeight={totalHeight}
          cursorX={debouncedCursorX}
          modalOpen={modalOpen}
          hoveredYear={hoveredYear}
          showTimelineChart={showTimelineChart}
        />

        <XAxis config={config} yearToX={yearToX} chartWidth={chartWidth} />

        {!modalOpen && (
          <CursorLine
            ref={cursorLineRef}
            config={config}
            totalHeight={totalHeight}
            xToYear={xToYear}
            chartWidth={chartWidth}
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
            isMobile={isMobile}
          />
        )}

        {showTimelineChart && (
          <TooltipsPersistant
            data={filteredTimeline}
            yearToX={yearToX}
            config={config}
            tooltipMeasurements={tooltipMeasurements}
            constrainTooltipPosition={constrainTooltipPosition}
            timelineState={timelineState}
            showAllPointTooltips={showAllPointTooltips}
          />
        )}

        <TooltipFromHover
          config={config}
          hoveredPointTooltip={pointTooltip}
          tooltipMeasurements={tooltipMeasurements}
          tooltipTextRef={tooltipTextRef}
          constrainTooltipPosition={constrainTooltipPosition}
          showTooltipImages={showTooltipImages}
          isMobile={isMobile}
        />
      </svg>
    </div>
  );
}
