import { Config } from '../types/config';

type Props = {
  cursorX: number | null;
  config: Config;
  totalHeight: number;
  xToYear: (x: number) => number;
};

export default function CursorLineSimple({ 
  cursorX,
  config,
  totalHeight,
  xToYear
}: Props) {
  if (cursorX === null) return null;

  return (
    <>
      <line
        x1={cursorX}
        y1={config.layout.axisHeight}
        x2={cursorX}
        y2={totalHeight}
        stroke="#374151"
        strokeWidth="1"
        strokeDasharray="4 4"
        pointerEvents="none"
      />
      <g transform={`translate(${cursorX}, ${config.layout.axisHeight})`}>
        <rect
          x="-20"
          y="8"
          width="40"
          height="20"
          fill="white"
          rx="4"
        />
        <text
          y="20"
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
        >
          {xToYear(cursorX)}
        </text>
      </g>
    </>
  );
} 