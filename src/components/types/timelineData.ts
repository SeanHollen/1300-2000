export type Lane = {
  lane: string;
  icon: string;
  toShow: boolean;
  items: LaneItem[];
};

export type LaneItem = Segment | Point;

export type Segment = {
  type: "segment";
  start: number;
  end: number;
  url: string;
  imageUrl?: string;
  label: string;
  ongoing?: boolean;
  hoveredTs?: number;
};

export type Point = {
  type: "point";
  at: number;
  start?: number;
  end?: number;
  url: string;
  imageUrl?: string;
  label: string;
  category: string;
  hoveredTs?: number;
};
