import React from "react";
import {
  FaCog,
  FaBook,
  FaBalanceScale,
  FaCloud,
  FaCross,
} from "react-icons/fa";
import {
  GiCrossedSwords,
  GiSailboat,
  GiSyringe,
  GiGears,
} from "react-icons/gi";
import { IoTelescopeSharp } from "react-icons/io5";
import { LuWheat } from "react-icons/lu";
import { GiQuillInk } from "react-icons/gi";

const iconMap = {
  sword: GiCrossedSwords,
  cog: FaCog,
  gears: GiGears,
  book: FaBook,
  cross: FaCross,
  vaccine: GiSyringe,
  scale: FaBalanceScale,
  ship: GiSailboat,
  telescope: IoTelescopeSharp,
  cloud: FaCloud,
  wheat: LuWheat,
  quill: GiQuillInk,
};

export default function SwimlaneLines({
  data,
  config,
  chartWidth,
  laneThickness,
  lanePadding,
  showTimelineChart,
}) {
  const iconRadius = config.point.iconRadius;

  return (
    <>
      {data.map((lane, laneIndex) => {
        const y =
          laneIndex * (laneThickness + lanePadding) + config.layout.svgPad;
        const IconComponent = iconMap[lane.icon] || FaCog; // Fallback to cog if icon not found

        const iconOffs = window.screen.width + 200;

        return (
          <g key={`lane-${laneIndex}`} transform={`translate(0, ${y})`}>
            {/* Lane background */}
            <rect
              x="0"
              y={String(-laneThickness / 2)}
              width={chartWidth}
              height={laneThickness}
              className="swimlane-lane"
            />

            {/* Lane Icon Container */}
            {showTimelineChart && (
              <foreignObject
                x={90}
                y={-iconRadius}
                width={iconRadius * 2}
                height={iconRadius * 2}
                style={{ overflow: "visible" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                  title={lane.lane}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "200px",
                      left: "50%",
                      bottom: "100%",
                      transform: "translateX(-50%)",
                      marginBottom: "5px",
                      fontSize: "14px",
                      color: "#374151",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontWeight: "500",
                    }}
                  >
                    {lane.lane}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "50%",
                      border: "2px solid rgba(55, 65, 81, 0.8)",
                    }}
                  >
                    <IconComponent
                      style={{
                        width: "65%",
                        height: "65%",
                        color: "rgba(55, 65, 81, 0.8)",
                      }}
                    />
                  </div>
                </div>
              </foreignObject>
            )}
            {showTimelineChart &&
              Array.from(
                { length: Math.floor(chartWidth / iconOffs) },
                (_, i) => (
                  <foreignObject
                    key={`icon-${laneIndex}-${i}`}
                    x={iconOffs * (i + 1) + 250}
                    y={-iconRadius}
                    width={iconRadius * 2}
                    height={iconRadius * 2}
                    style={{ overflow: "visible" }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                      title={lane.lane}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "50%",
                          border: "2px solid rgba(55, 65, 81, 0.8)",
                        }}
                      >
                        <IconComponent
                          style={{
                            width: "65%",
                            height: "65%",
                            color: "rgba(55, 65, 81, 0.8)",
                          }}
                        />
                      </div>
                    </div>
                  </foreignObject>
                )
              )}
          </g>
        );
      })}
    </>
  );
}
