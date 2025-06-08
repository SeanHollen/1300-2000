import { Point } from "./timelineData";

export type TooltipMeasurement = {
  x: number;
  width: number;
}

export type Tooltip = {
  x: number;
  y: number;
  item: Point;
  laneIndex: number;
}