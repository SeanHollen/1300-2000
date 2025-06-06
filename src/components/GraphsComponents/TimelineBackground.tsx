import { useMemo } from "react";
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
  GiQuillInk,
} from "react-icons/gi";
import { FaGears, FaBookBible } from "react-icons/fa6";
import { IoTelescopeSharp } from "react-icons/io5";
import { LuWheat } from "react-icons/lu";
import { Config } from "../types/config";
import { Lane } from "../types/timelineData";
import { isMobileDevice } from "../../utils/deviceUtils";

const iconMap: Record<string, any> = {
  sword: GiCrossedSwords,
  cog: FaCog,
  gears: GiGears,
  gears2: FaGears,
  book: FaBook,
  cross: FaCross,
  bible: FaBookBible,
  vaccine: GiSyringe,
  scale: FaBalanceScale,
  ship: GiSailboat,
  telescope: IoTelescopeSharp,
  cloud: FaCloud,
  wheat: LuWheat,
  quill: GiQuillInk,
};

type Props = {
  data: Lane[];
  config: Config;
  chartWidth: number;
  showTimelineChart?: boolean;
};

export default function TimelineBackground({
  data,
  config,
  chartWidth,
  showTimelineChart,
}: Props) {
  const iconRadius = config.point.iconRadius;
  const laneDetails = config.lane.getLaneDetails();
  const isMobile = useMemo(() => isMobileDevice(), []);

  return (
    <>
      {data
        .filter((lane) => lane.toShow)
        .map((lane, laneIndex) => {
          const y = config.lane.getLaneYPos(laneIndex);
          const IconComponent = iconMap[lane.icon] || FaCog;
          const iconOffs = window.screen.width + 200;

          // mobile doesn't recognize the translate(0, y) of the parent <g>
          const mobileYOffset = isMobile ? y : 0;

          return (
            <g key={`lane-${laneIndex}`} transform={`translate(0, ${y})`}>
              {/* Lane background */}
              <rect
                x="0"
                y={String(-laneDetails.laneThickness / 2)}
                width={chartWidth}
                height={laneDetails.laneThickness}
                className="swimlane-lane"
              />

              {/* Lane Icon Container */}
              {showTimelineChart && (
                <foreignObject
                  x={90}
                  y={-iconRadius + mobileYOffset}
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
                        width: "calc(100% - 4px)",
                        height: "calc(100% - 4px)",
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
                      y={-iconRadius + mobileYOffset}
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
                            width: "calc(100% - 4px)",
                            height: "calc(100% - 4px)",
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
