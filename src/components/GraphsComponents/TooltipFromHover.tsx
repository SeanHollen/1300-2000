import { TooltipMeasurement, Tooltip } from "../types/tooltipMeasurement";
import { Config } from "../types/config";
import { getThumbnailUrl } from "../../utils/imageUtils";

type Props = {
  hoveredPointTooltip: Tooltip | null;
  tooltipMeasurements: TooltipMeasurement;
  config: Config;
  tooltipTextRef: (element: SVGTextElement | null) => void;
  constrainTooltipPosition: (x: number, width: number) => number;
  showTooltipImages: boolean;
};

export default function hoveredPointTooltips({
  hoveredPointTooltip,
  tooltipMeasurements,
  config,
  tooltipTextRef,
  constrainTooltipPosition,
  showTooltipImages,
}: Props) {
  const imageSize = config.tooltip.imagePreview.size;
  const imageHeight = Math.round(imageSize * 0.67); // Maintain 3:2 aspect ratio
  
  // Check if the item is in the first lane (lane index 0)
  const isFirstLane = hoveredPointTooltip?.laneIndex === 0;
  const imageY = isFirstLane ? "50" : `-${imageHeight + 20}`;
  
  const optimizedImageUrl = hoveredPointTooltip?.item.imageUrl 
    ? getThumbnailUrl(hoveredPointTooltip.item.imageUrl, imageSize)
    : null;
  
  return (
    <>
      {hoveredPointTooltip && (
        <g
          transform={`translate(${constrainTooltipPosition(
            hoveredPointTooltip.x,
            tooltipMeasurements.width
          )}, ${hoveredPointTooltip.y - 25})`}
        >
          {showTooltipImages && optimizedImageUrl && (
            <foreignObject
              x={-imageSize / 2}
              y={imageY}
              width={imageSize}
              height={imageHeight}
            >
              <div
                style={{
                  width: `${imageSize}px`,
                  height: `${imageHeight}px`,
                  backgroundColor: "white",
                  borderRadius: "4px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (hoveredPointTooltip?.item.url) {
                    window.open(hoveredPointTooltip.item.url, '_blank');
                  }
                }}
              >
                <img
                  src={optimizedImageUrl}
                  alt="Wikipedia preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "4px",
                    pointerEvents: "none"
                  }}
                />
              </div>
            </foreignObject>
          )}
          
          {/* Existing tooltip */}
          <rect
            x={tooltipMeasurements.x}
            y="-20"
            width={tooltipMeasurements.width}
            height="24"
            rx="5"
            ry="5"
            fill="white"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
          />
          <text
            ref={tooltipTextRef}
            x="0"
            y="-7.5"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#374151"
          >
            {(() => {
              const item = hoveredPointTooltip.item;
              const year = item.start
                ? `${item.start}-${item.end}`
                : item.at;
              return `${item.label} (${year})`;
            })()}
          </text>
        </g>
      )}
    </>
  );
}
