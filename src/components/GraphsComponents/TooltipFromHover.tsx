import { TooltipMeasurement, Tooltip } from "../types/tooltipMeasurement";
import { Config } from "../types/config";

type Props = {
  hoveredPointTooltip: Tooltip | null;
  tooltipMeasurements: TooltipMeasurement;
  config: Config;
  tooltipTextRef: (element: SVGTextElement | null) => void;
  constrainTooltipPosition: (x: number, width: number) => number;
  showTooltipImages: boolean;
};

// Function to get thumbnail URL from Wikipedia image URL
const getThumbnailUrl = (imageUrl: string, size: number = 240) => {
  if (!imageUrl) return imageUrl;
  
  // For Wikipedia images, we can request a specific thumbnail size
  if (imageUrl.includes('upload.wikimedia.org')) {
    // Pattern: /thumb/.../.../NNNpx-filename or /.../.../filename
    const thumbMatch = imageUrl.match(/\/thumb\/(.+)\/(\d+px-.+)$/);
    if (thumbMatch) {
      // Already a thumbnail, replace the size
      const [, path, filename] = thumbMatch;
      const newFilename = filename.replace(/^\d+px-/, `${size}px-`);
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${newFilename}`;
    } else {
      // Original image, convert to thumbnail
      const pathMatch = imageUrl.match(/\/wikipedia\/commons\/(.+)$/);
      if (pathMatch) {
        const [, path] = pathMatch;
        const filename = path.split('/').pop();
        return `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${size}px-${filename}`;
      }
    }
  }
  
  return imageUrl;
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
  
  const optimizedImageUrl = hoveredPointTooltip?.imageUrl 
    ? getThumbnailUrl(hoveredPointTooltip.imageUrl, imageSize)
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
                  justifyContent: "center"
                }}
              >
                <img
                  src={optimizedImageUrl}
                  alt="Wikipedia preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "4px"
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
              const year = hoveredPointTooltip.start
                ? `${hoveredPointTooltip.start}-${hoveredPointTooltip.end}`
                : hoveredPointTooltip.year;
              return `${hoveredPointTooltip.content} (${year})`;
            })()}
          </text>
        </g>
      )}
    </>
  );
}
