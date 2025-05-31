// Helper function to generate random historical events
const generateRandomEvents = (count, startYear = 1400, endYear = 2000) => {
  const yearRange = endYear - startYear;
  const baseSpacing = yearRange / count;
  
  return Array.from({ length: count }, (_, i) => {
    // Use a smaller random offset (max 20 years instead of 240)
    const randomOffset = (Math.random() - 0.5) * 20; // Range: -10 to +10 years
    const baseYear = startYear + (i * baseSpacing);
    const eventYear = Math.max(startYear, Math.min(endYear, Math.round(baseYear + randomOffset)));
    
    return {
      type: "point",
      at: eventYear,
      label: `Historical event in year ${eventYear}`,
    };
  });
};

export const timelineData = [
  {
    lane: "Lane 1",
    items: [
      { type: "segment", start: 1400, end: 1450, label: "Segment 1" },
      ...generateRandomEvents(30, 1400, 2000),
    ],
  },
  {
    lane: "Lane 2", 
    items: [
      { type: "segment", start: 1500, end: 1600, label: "Segment 2" },
      ...generateRandomEvents(30, 1400, 2000),
    ],
  },
  {
    lane: "Lane 3",
    items: [
      { type: "segment", start: 1650, end: 1750, label: "Segment 3" },
      ...generateRandomEvents(30, 1400, 2000),
    ],
  },
  {
    lane: "Lane 4",
    items: [
      { type: "segment", start: 1800, end: 1900, label: "Segment 4" },
      ...generateRandomEvents(30, 1400, 2000),
    ],
  },
  {
    lane: "Lane 5",
    items: [
      { type: "segment", start: 1920, end: 2000, label: "Segment 5" },
      ...generateRandomEvents(30, 1400, 2000),
    ],
  },
];