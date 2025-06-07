export type TooltipMeasurement = {
  x: number;
  width: number;
}

export type Tooltip = {
  x: number,
  y: number,
  year?: number,
  start?: number,
  end?: number,
  content: string,
  url?: string,
  imageUrl?: string,
  laneIndex?: number,
}