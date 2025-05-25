import React, { useState, useRef, useEffect } from "react";
import { historicalData } from "../data/laneData/timelineData";
import { lineChartData } from "../data/lineChartData/historicalTrends";
import { FaCog, FaBook, FaBalanceScale, FaCloud } from "react-icons/fa";
import { GiCrossedSwords, GiSailboat, GiSyringe } from "react-icons/gi";
import { IoTelescopeSharp } from "react-icons/io5";
import "../styles/swimlanes.css";

export default function CandlestickGraph({ data = historicalData }) {
  const [pointTooltip, setPointTooltip] = useState(null);
  const [tooltipMeasurements, setTooltipMeasurements] = useState({ width: 120, x: -60 });
  const [interactionOrder, setInteractionOrder] = useState([]);
  const [cursorX, setCursorX] = useState(null);
  const [hoveredYear, setHoveredYear] = useState(null);
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
      start: item.start,
      end: item.end,
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
      setHoveredYear(xToYear(x));
    }
  };

  const handleMouseLeave = () => {
    setCursorX(null);
    setHoveredYear(null);
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

  const xToYear = (x) => {
    const yearPosition = x / chartWidth;
    return Math.round(startYear + yearPosition * yearRange);
  };

  const constrainTooltipPosition = (x, tooltipWidth) => {
    const padding = 10; // Minimum padding from SVG edges
    return Math.min(Math.max(x, tooltipWidth/2 + padding), chartWidth - tooltipWidth/2 - padding);
  };

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

  const createLinePath = (points, range) => {
    const totalHeight = data.length * (laneThickness + lanePadding) + svgPad;
    const bottomPadding = 20;
    
    return points.reduce((path, point, i) => {
      const x = yearToX(point.year);
      // Map the value to our SVG space using the provided range
      const normalizedValue = (point.value - range.start) / (range.end - range.start); // Convert to 0-1 range
      const y = (totalHeight - bottomPadding) - (normalizedValue * ((totalHeight - bottomPadding) - axisHeight));
      return path + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
    }, '');
  };

  const iconRadius = 20; // Smaller radius (was 24)

  // Map of icon types to components
  const iconMap = {
    sword: GiCrossedSwords,
    cog: FaCog,
    book: FaBook,
    vaccine: GiSyringe,
    scale: FaBalanceScale,
    ship: GiSailboat,
    telescope: IoTelescopeSharp,
    cloud: FaCloud,
  };

  const findValueForYear = (points, year) => {
    if (!year) return null;
    let closestPoint = points[0];
    let minDistance = Math.abs(points[0].year - year);
    for (let i = 1; i < points.length; i++) {
      const distance = Math.abs(points[i].year - year);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = points[i];
      }
    }
    
    return closestPoint.value;
  };

  const hasDataAtYear = (points, year) => {
    if (!year) return false;
    for (let i = 0; i < points.length - 1; i++) {
      if (points[i].year <= year && points[i + 1].year >= year) {
        return true;
      }
    }
    return false;
  };

  return (
    <div 
      className="w-screen h-screen swimlane-container relative m-0" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Legend */}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}
      >
        {lineChartData
          .filter(lineData => lineData.toShow && hasDataAtYear(lineData.points, hoveredYear))
          .map((lineData) => {
            const value = findValueForYear(lineData.points, hoveredYear);
            return (
              <div key={lineData.id} style={{ color: lineData.color }}>
                {lineData.label}: {value.toFixed(2)} {lineData.unit}
              </div>
            );
          })}
      </div>

      <svg width={chartWidth} height={data.length * (laneThickness + lanePadding) + svgPad} className="overflow-hidden">
        {/* Background Line Charts */}
        {lineChartData
          .filter(lineData => lineData.toShow)
          .map((lineData) => (
            <path
              key={lineData.id}
              d={createLinePath(lineData.points, lineData.range)}
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
            const isEdgeTick = year === startYear || year === endYear;
            return (
              <g key={`tick-${year}`} transform={`translate(${x}, 0)`}>
                <line
                  y1="0"
                  y2="10"
                  stroke="#374151"
                  strokeWidth="1"
                />
                {!isEdgeTick && (
                  <text
                    y="25"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#374151"
                  >
                    {year}
                  </text>
                )}
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

        {/* Swimlane Lines with Icons */}
        {data.map((lane, laneIndex) => {
          const y = laneIndex * (laneThickness + lanePadding) + svgPad;
          const IconComponent = iconMap[lane.icon] || FaCog; // Fallback to cog if icon not found
          
          return (
            <g key={`lane-${laneIndex}`} transform={`translate(0, ${y})`}>
              {/* Lane background */}
              <rect x="0" y={String(-laneThickness/2)} width={chartWidth} height={laneThickness} className="swimlane-lane" />
              
              {/* Lane Icon Container */}
              <foreignObject 
                x={90} 
                y={-iconRadius} 
                width={iconRadius * 2} 
                height={iconRadius * 2}
                style={{ overflow: 'visible' }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '200px',
                      left: '50%',
                      bottom: '100%',
                      transform: 'translateX(-50%)',
                      marginBottom: '5px',
                      fontSize: '14px',
                      color: '#374151',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      fontWeight: '500'
                    }}
                  >
                    {lane.lane}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '50%',
                      border: '2px solid rgba(55, 65, 81, 0.8)'
                    }}
                  >
                    <IconComponent 
                      style={{ 
                        width: '65%', 
                        height: '65%', 
                        color: 'rgba(55, 65, 81, 0.8)' 
                      }} 
                    />
                  </div>
                </div>
              </foreignObject>
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
                        className={`swimlane-point ${item.category ? `point-${item.category}` : ''}`}
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
                            {`${item.label} (${item.start}-${item.ongoing ? 'present' : item.end})`}
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
              {(() => {
                const year = pointTooltip.start ? `${pointTooltip.start}-${pointTooltip.end}` : pointTooltip.year;
                return `${pointTooltip.content} (${year})`;
              })()}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
