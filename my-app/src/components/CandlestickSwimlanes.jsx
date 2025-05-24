import React, { useState, useRef, useEffect } from "react";
import { historicalData } from "../data/laneData/revolutionsData";
import { lineChartData } from "../data/lineChartData/historicalTrends";
import "../styles/swimlanes.css";

export default function CandlestickSwimlanes({ data = historicalData }) {
  const [pointTooltip, setPointTooltip] = useState(null);
  const [tooltipMeasurements, setTooltipMeasurements] = useState({ width: 120, x: -60 });
  const [interactionOrder, setInteractionOrder] = useState([]);
  const [cursorX, setCursorX] = useState(null);
  const containerRef = useRef(null);

  const tooltipTextRef = (element) => {
    if (element) {
      const bbox = element.getBBox();
      const newWidth = bbox.width + 20;
      const newX = -bbox.width / 2 - 10;
      
      if (newWidth !== tooltipMeasurements.width || newX !== tooltipMeasurements.x) {
        setTooltipMeasurements({
          width: newWidth,
          x: newX
        });
      }
    }
  };

  const handlePointHover = (e, item, pointX, pointY) => {
    if (!item) {
      setPointTooltip(null);
      return;
    }
    setPointTooltip({
      x: pointX,
      y: pointY,
      year: item.at,
      content: item.label,
    });
  };

  const handleClick = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;
      setCursorX(x);
    }
  };

  const handleMouseLeave = () => {
    setCursorX(null);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        document.documentElement.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel);
    
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const svgPad = 150;
  const axisHeight = 40;
  const laneCount = data.length;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight - 20 : 800;
  const laneUnit = (windowHeight - 50) / (laneCount + 0.5);
  const lanePct = 0.1;
  const laneThickness = laneUnit * lanePct;
  const lanePadding = laneUnit * (1 - lanePct);
  const chartWidth = 5000;
  const segmentPct = 0.5;
  const segmentThickness = laneUnit * segmentPct;
  const pointRadius = 12;
  const startYear = 1300;
  const endYear = 2000;
  const yearRange = endYear - startYear;

  const yearToX = (year) => {
    const yearPosition = (year - startYear) / yearRange;
    return yearPosition * chartWidth;
  };

  // Convert x position back to year
  const xToYear = (x) => {
    const yearPosition = x / chartWidth;
    return Math.round(startYear + yearPosition * yearRange);
  };

  // Helper function to constrain tooltip position
  const constrainTooltipPosition = (x, tooltipWidth) => {
    const padding = 10; // Minimum padding from SVG edges
    return Math.min(Math.max(x, tooltipWidth/2 + padding), chartWidth - tooltipWidth/2 - padding);
  };

  // Generate decade ticks
  const generateDecadeTicks = () => {
    const ticks = [];
    const startDecade = Math.floor(startYear / 10) * 10;
    const endDecade = Math.ceil(endYear / 10) * 10;
    for (let year = startDecade; year <= endDecade; year += 10) {
      ticks.push(year);
    }
    return ticks;
  };

  const handleSegmentHover = (laneIndex, idx) => {
    const segmentId = `${laneIndex}-${idx}`;
    setInteractionOrder(prev => {
      const newOrder = prev.filter(id => id !== segmentId);
      return [...newOrder, segmentId];
    });
  };

  // Create the SVG path string for a single line
  const createLinePath = (points) => {
    const totalHeight = data.length * (laneThickness + lanePadding) + svgPad;
    const bottomPadding = 20;
    
    return points.reduce((path, point, i) => {
      const x = yearToX(point.year);
      // Map the value (100-800) to our SVG space
      const normalizedValue = (point.value - 100) / (800 - 100); // Convert to 0-1 range
      const y = (totalHeight - bottomPadding) - (normalizedValue * ((totalHeight - bottomPadding) - axisHeight));
      return path + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
    }, '');
  };

  return (
    <div 
      className="w-screen h-screen swimlane-container relative m-0" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg width={chartWidth} height={data.length * (laneThickness + lanePadding) + svgPad} className="overflow-hidden">
        {/* Background Line Charts */}
        {lineChartData.map((lineData) => (
          <path
            key={lineData.id}
            d={createLinePath(lineData.points)}
            stroke={lineData.color}
            strokeWidth="2"
            fill="none"
            opacity="0.2"
          />
        ))}

        {/* X-Axis Ticks and Labels */}
        <g transform={`translate(0, ${axisHeight})`}>
          {generateDecadeTicks().map(year => {
            const x = yearToX(year);
            return (
              <g key={`tick-${year}`} transform={`translate(${x}, 0)`}>
                <line
                  y1="0"
                  y2="10"
                  stroke="#374151"
                  strokeWidth="1"
                />
                <text
                  y="25"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                >
                  {year}
                </text>
              </g>
            );
          })}
          <line
            x1="0"
            y1="0"
            x2={chartWidth}
            y2="0"
            stroke="#374151"
            strokeWidth="1"
          />
        </g>

        {/* Swimlane Lines */}
        {data.map((lane, laneIndex) => {
          const y = laneIndex * (laneThickness + lanePadding) + svgPad;
          return (
            <g key={`lane-${laneIndex}`} transform={`translate(0, ${y})`}>
              <rect x="0" y={String(-laneThickness/2)} width={chartWidth} height={laneThickness} className="swimlane-lane" />
            </g>
          );
        })}

        {/* Vertical Cursor Line */}
        {cursorX !== null && (
          <>
            <line
              x1={cursorX}
              y1={axisHeight}
              x2={cursorX}
              y2={data.length * (laneThickness + lanePadding) + svgPad}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <g transform={`translate(${cursorX}, ${axisHeight})`}>
              <rect
                x="-20"
                y="12"
                width="40"
                height="20"
                fill="white"
                rx="4"
              />
              <text
                y="25"
                textAnchor="middle"
                fontSize="12"
                fill="#374151"
              >
                {xToYear(cursorX)}
              </text>
            </g>
          </>
        )}

        {/* Segments and Points */}
        {data.map((lane, laneIndex) => {
          const y = laneIndex * (laneThickness + lanePadding) + svgPad;
          return (
            <g key={`lane-${laneIndex}`} transform={`translate(0, ${y})`}>
              {lane.items.map((item, idx) => {
                if (item.type === "segment") {
                  const segmentX = yearToX(item.start);
                  const segmentWidth = yearToX(item.end) - yearToX(item.start);
                  
                  return (
                    <g 
                      key={`segment-${laneIndex}-${idx}`}
                      onMouseEnter={() => handleSegmentHover(laneIndex, idx)}
                      onClick={() => handleClick(item.url)}
                      style={{ cursor: item.url ? 'pointer' : 'default' }}
                    >
                      <rect
                        x={segmentX}
                        y={-segmentThickness / 2}
                        width={segmentWidth}
                        height={String(segmentThickness)}
                        className="swimlane-segment"
                      />
                    </g>
                  );
                } else if (item.type === "point") {
                  const pointX = yearToX(item.at);
                  return (
                    <g
                      key={`point-${laneIndex}-${idx}`}
                      onClick={() => handleClick(item.url)}
                      style={{ cursor: item.url ? 'pointer' : 'default' }}
                    >
                      <circle
                        cx={pointX}
                        cy="0"
                        r={String(pointRadius)}
                        className="swimlane-point"
                        onMouseEnter={(e) => handlePointHover(e, item, pointX, y)}
                        onMouseLeave={() => handlePointHover(null)}
                      />
                    </g>
                  );
                }
                return null;
              })}
            </g>
          );
        })}

        {/* Segment Tooltips (permanent) */}
        {data.map((lane, laneIndex) => {
          const y = laneIndex * (laneThickness + lanePadding) + svgPad;
          return (
            <g key={`tooltips-${laneIndex}`}>
              {lane.items
                .map((item, idx) => ({ item, idx, order: interactionOrder.indexOf(`${laneIndex}-${idx}`) }))
                .sort((a, b) => {
                  // If neither has been interacted with, maintain original order
                  if (a.order === -1 && b.order === -1) return 0;
                  // If only one has been interacted with, it goes on top
                  if (a.order === -1) return -1;
                  if (b.order === -1) return 1;
                  // Otherwise, sort by interaction order
                  return a.order - b.order;
                })
                .map(({ item, idx }) => {
                  if (item.type === "segment") {
                    const segmentX = yearToX(item.start);
                    const segmentWidth = yearToX(item.end) - yearToX(item.start);
                    const centerX = segmentX + segmentWidth / 2;
                    const constrainedX = constrainTooltipPosition(centerX, tooltipMeasurements.width);
                    
                    return (
                      <g key={`tooltip-${laneIndex}-${idx}`} transform={`translate(0, ${y})`}>
                        <g transform={`translate(${constrainedX}, -30)`}>
                          <rect
                            x="-60"
                            y="-20"
                            width="120"
                            height="24"
                            rx="5"
                            ry="5"
                            fill="white"
                            stroke="rgba(0,0,0,0.1)"
                            strokeWidth="1"
                            ref={el => {
                              if (el) {
                                const text = el.nextSibling;
                                if (text) {
                                  const bbox = text.getBBox();
                                  el.setAttribute('width', bbox.width + 20);
                                  el.setAttribute('x', -bbox.width/2 - 10);
                                }
                              }
                            }}
                          />
                          <text
                            x="0"
                            y="-8"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="12"
                            fill="#374151"
                          >
                            {`${item.label} (${item.start})`}
                          </text>
                        </g>
                      </g>
                    );
                  }
                  return null;
                })}
            </g>
          );
        })}

        {/* Point Tooltips (temporary) */}
        {pointTooltip && (
          <g transform={`translate(${constrainTooltipPosition(pointTooltip.x, tooltipMeasurements.width)}, ${pointTooltip.y - 30})`}>
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
              y="-8"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#374151"
            >
              {`${pointTooltip.content} (${pointTooltip.year})`}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
