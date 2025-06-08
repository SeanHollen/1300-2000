import { Config } from "../components/types/config";
import { Lane } from "../components/types/timelineData";

interface CreateConfigParams {
  axisHeight: number;
  filteredTimeline: Lane[];
}

export const createConfig = ({ axisHeight, filteredTimeline }: CreateConfigParams): Config => {
  const config: Config = {
    layout: {
      svgPad: 140,
      axisHeight: axisHeight,
      windowHeight:
        typeof window !== "undefined" ? window.innerHeight - 20 : 800,
      bottomPadding: 20,
    },
    lane: {
      percentages: {
        lane: 0.1,
        segment: 0.5,
      },
      getLaneDetails: () => {
        const laneUnit =
          (config.layout.windowHeight - 50) / (filteredTimeline.length + 0.5);
        const laneThickness = laneUnit * config.lane.percentages.lane;
        const lanePadding = laneUnit * (1 - config.lane.percentages.lane);
        const segmentThickness = laneUnit * config.lane.percentages.segment;
        return { laneUnit, laneThickness, lanePadding, segmentThickness };
      },
      getLaneYPos: (laneIndex: number) => {
        const laneDetails = config.lane.getLaneDetails();
        return (
          laneIndex * (laneDetails.laneThickness + laneDetails.lanePadding) +
          config.layout.svgPad
        );
      },
    },
    point: {
      radius: 12,
      iconRadius: 20,
    },
    timeline: {
      startYear: 1300,
      endYear: 2000,
      getYearRange: () => config.timeline.endYear - config.timeline.startYear,
    },
    tooltip: {
      defaultWidth: 120,
      defaultX: -60,
      padding: 10,
      yearLabelWidth: 40,
      yearLabelHeight: 20,
      yearLabelOffset: {
        x: -20,
        y: 12,
      },
      segment: {
        x: -60,
        y: -20,
        width: 120,
        height: 24,
        textY: -8,
      },
      imagePreview: {
        size: 240,
      },
    },
  };

  return config;
};
