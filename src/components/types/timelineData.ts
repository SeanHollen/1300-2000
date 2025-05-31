export type Lane = {
  lane: string;
  icon: string;
  items: LaneItem[];
};

export type LaneItem = Segment | Point;

export type Segment = {
  type: "segment";
  start: number;
  end: number;
  url: string;
  label: string;
  ongoing?: boolean;
};

export type Point = {
  type: "point";
  at: number;
  start?: number;
  end?: number;
  url: string;
  label: string;
  category: string;
};
