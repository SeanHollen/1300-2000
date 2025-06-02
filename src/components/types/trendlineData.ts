export type LineTS = {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  prefix: string;
  unit: string;
  toShow: boolean;
  range: Range;
  sourceUrl: string;
  sourceIcon: string;
  points: TSPoint[];
  hasDataForYear?: boolean;
}

export type TSPoint = {
  year: number;
  value: number;
}

export type Range = {
  start: number;
  end: number;
}