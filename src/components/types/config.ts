export type Config = {
  layout: Layout;
  lane: Lane;
  point: Point;
  timeline: Timeline;
  tooltip: Tooltip;
}

type Layout = {
  svgPad: number;
  axisHeight: number;
  windowHeight: number;
  bottomPadding: number;
}

export type LaneDetails = {
  laneUnit: number;
  laneThickness: number;
  lanePadding: number;
  segmentThickness: number;
}

type Lane = {
  percentages: {
    lane: number;
    segment: number;
  };
  getLaneDetails: () => LaneDetails
  getLaneYPos: (laneIndex: number) => number
}

type Point = {
  radius: number;
  iconRadius: number;
}

type Timeline = {
  startYear: number;
  endYear: number;
  getYearRange: () => number; 
}

type Tooltip = {
  defaultWidth: number;
  defaultX: number;
  padding: number;
  yearLabelWidth: number;
  yearLabelHeight: number;
  yearLabelOffset: {
    x: number;
    y: number;
  };
  segment: {
    x: number;
    y: number;
    width: number;
    height: number;
    textY: number;
  };
  imagePreview: {
    size: number;
  };
}