export const mockData = [
  {
    lane: "Lane 1",
    items: [
      { type: "segment", start: 1400, end: 1450, label: "Segment 1", },
      ...Array.from({ length: 30 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; // Random offset in years
        const baseYear = 1400 + (i * 20); // Base spacing of 20 years
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Lane 2",
    items: [
      { type: "segment", start: 1500, end: 1600, label: "Segment 2", },
      ...Array.from({ length: 30 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; // Random offset in years
        const baseYear = 1400 + (i * 20); // Base spacing of 20 years
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Lane 3",
    items: [
      { type: "segment", start: 1650, end: 1750, label: "Segment 3", },
      ...Array.from({ length: 30 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; // Random offset in years
        const baseYear = 1400 + (i * 20); // Base spacing of 20 years
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Lane 4",
    items: [
      { type: "segment", start: 1800, end: 1900, label: "Segment 4", },
      ...Array.from({ length: 30 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; // Random offset in years
        const baseYear = 1400 + (i * 20); // Base spacing of 20 years
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Lane 5",
    items: [
      { type: "segment", start: 1920, end: 2000, label: "Segment 5", },
      ...Array.from({ length: 30 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; // Random offset in years
        const baseYear = 1400 + (i * 20); // Base spacing of 20 years
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
]; 