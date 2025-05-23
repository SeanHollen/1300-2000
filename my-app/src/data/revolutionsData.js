export const historicalData = [
  {
    lane: "Wars and Revolutions",
    items: [
      { 
        type: "segment",
        start: 1337,
        end: 1453,
        label: "Hundred Years' War",
      },
      { 
        type: "segment",
        start: 1618,
        end: 1648,
        label: "Thirty Years' War",
      },
      { 
        type: "segment",
        start: 1700,
        end: 1721,
        label: "Great Northern War",
      },
      { 
        type: "segment",
        start: 1803,
        end: 1815,
        label: "Napoleonic Wars",
      },
      { 
        type: "segment",
        start: 1850,
        end: 1864,
        label: "Taiping Rebellion",
      },
      { 
        type: "segment",
        start: 1914,
        end: 1918,
        label: "World War I",
      },
      { 
        type: "segment",
        start: 1939,
        end: 1945,
        label: "World War II",
      },
      { 
        type: "segment",
        start: 1870,
        end: 1871,
        label: "Franco-Prussian War",
      },
      {
        type: "point",
        at: 1815,
        label: `Congress of Vienna Signed`,
      },
      {
        type: "point",
        at: 1648,
        label: `Peace of Westphilia Signed`,
      },
      {
        type: "point",
        at: 1917,
        label: `Russian Revolution`,
      },
      {
        type: "point",
        at: 1776,
        label: `US Declaration of Independence`,
      },
      {
        type: "point",
        at: 1789,
        label: `French Revolution Start`,
      },
      {
        type: "point",
        at: 1688,
        label: `Glorious Revolution Start`,
      },
      {
        type: "point",
        at: 1848,
        label: `Springtime of Nations`,
      },
      {
        type: "point",
        at: 1989,
        label: `End of Cold War`,
      },
    ],
  },
  {
    lane: "Technology and Industry",
    items: [
      { 
        type: "segment",
        start: 1760,
        end: 1840,
        label: "Industrial Revolution",
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Religion and Culture",
    items: [
      { 
        type: "segment",
        start: 1517,
        end: 1648,
        label: "Protestant Reformation",
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Health and Disease",
    items: [
      { 
        type: "segment",
        start: 1347,
        end: 1351,
        label: "Black Death",
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Politics, Philosophy, and Law",
    items: [
      { 
        type: "segment",
        start: 1715,
        end: 1789,
        label: "Enlightenment",
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Exploration and Trade",
    items: [
      { 
        type: "segment",
        start: 1400,
        end: 1600,
        label: "Age of Exploration",
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
  {
    lane: "Science",
    items: [
      { 
        type: "segment",
        start: 1543,
        end: 1687,
        label: "Scientific Revolution",
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
        };
      }),
    ],
  },
];
