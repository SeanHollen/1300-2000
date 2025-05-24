export const historicalData = [
  {
    lane: "Wars and Revolutions",
    icon: "sword",
    items: [
      { 
        type: "segment",
        start: 1337,
        end: 1453,
        label: "Hundred Years' War",
        url: "https://en.wikipedia.org/wiki/Hundred_Years%27_War"
      },
      { 
        type: "segment",
        start: 1618,
        end: 1648,
        label: "Thirty Years' War",
        url: "https://en.wikipedia.org/wiki/Thirty_Years%27_War"
      },
      { 
        type: "segment",
        start: 1700,
        end: 1721,
        label: "Great Northern War",
        url: "https://en.wikipedia.org/wiki/Great_Northern_War"
      },
      { 
        type: "segment",
        start: 1803,
        end: 1815,
        label: "Napoleonic Wars",
        url: "https://en.wikipedia.org/wiki/Napoleonic_Wars"
      },
      { 
        type: "segment",
        start: 1850,
        end: 1864,
        label: "Taiping Rebellion",
        url: "https://en.wikipedia.org/wiki/Taiping_Rebellion"
      },
      { 
        type: "segment",
        start: 1914,
        end: 1918,
        label: "World War I",
        url: "https://en.wikipedia.org/wiki/World_War_I"
      },
      { 
        type: "segment",
        start: 1939,
        end: 1945,
        label: "World War II",
        url: "https://en.wikipedia.org/wiki/World_War_II"
      },
      { 
        type: "segment",
        start: 1870,
        end: 1871,
        label: "Franco-Prussian War",
        url: "https://en.wikipedia.org/wiki/Franco-Prussian_War"
      },
      {
        type: "point",
        at: 1815,
        label: `Congress of Vienna Signed`,
        url: "https://en.wikipedia.org/wiki/Congress_of_Vienna"
      },
      {
        type: "point",
        at: 1648,
        label: `Peace of Westphilia Signed`,
        url: "https://en.wikipedia.org/wiki/Peace_of_Westphalia"
      },
      {
        type: "point",
        at: 1917,
        label: `Russian Revolution`,
        url: "https://en.wikipedia.org/wiki/Russian_Revolution"
      },
      {
        type: "point",
        at: 1776,
        label: `US Declaration of Independence`,
        url: "https://en.wikipedia.org/wiki/United_States_Declaration_of_Independence"
      },
      {
        type: "point",
        at: 1789,
        label: `French Revolution Start`,
        url: "https://en.wikipedia.org/wiki/French_Revolution"
      },
      {
        type: "point",
        at: 1688,
        label: `Glorious Revolution Start`,
        url: "https://en.wikipedia.org/wiki/Glorious_Revolution"
      },
      {
        type: "point",
        at: 1848,
        label: `Springtime of Nations`,
        url: "https://en.wikipedia.org/wiki/Revolutions_of_1848"
      },
      {
        type: "point",
        at: 1989,
        label: `End of Cold War`,
        url: "https://en.wikipedia.org/wiki/End_of_the_Cold_War"
      },
    ],
  },
  {
    lane: "Technology and Industry",
    icon: "cog",
    items: [
      { 
        type: "segment",
        start: 1760,
        end: 1840,
        label: "Industrial Revolution",
        url: "https://en.wikipedia.org/wiki/Industrial_Revolution"
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
          url: `https://en.wikipedia.org/wiki/Timeline_of_the_${baseYear + randomOffset}s`
        };
      }),
    ],
  },
  {
    lane: "Religion and Culture",
    icon: "book",
    items: [
      { 
        type: "segment",
        start: 1517,
        end: 1648,
        label: "Protestant Reformation",
        url: "https://en.wikipedia.org/wiki/Protestant_Reformation"
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
          url: `https://en.wikipedia.org/wiki/Timeline_of_the_${baseYear + randomOffset}s`
        };
      }),
    ],
  },
  {
    lane: "Health and Disease",
    icon: "vaccine",
    items: [
      { 
        type: "segment",
        start: 1347,
        end: 1351,
        label: "Black Death",
        url: "https://en.wikipedia.org/wiki/Black_Death"
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
          url: `https://en.wikipedia.org/wiki/Timeline_of_the_${baseYear + randomOffset}s`
        };
      }),
    ],
  },
  {
    lane: "Politics, Philosophy, and Law",
    icon: "scale",
    items: [
      { 
        type: "segment",
        start: 1715,
        end: 1789,
        label: "Enlightenment",
        url: "https://en.wikipedia.org/wiki/Age_of_Enlightenment"
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
          url: `https://en.wikipedia.org/wiki/Timeline_of_the_${baseYear + randomOffset}s`
        };
      }),
    ],
  },
  {
    lane: "Exploration and Trade",
    icon: "ship",
    items: [
      { 
        type: "segment",
        start: 1400,
        end: 1600,
        label: "Age of Exploration",
        url: "https://en.wikipedia.org/wiki/Age_of_Discovery"
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
          url: `https://en.wikipedia.org/wiki/Timeline_of_the_${baseYear + randomOffset}s`
        };
      }),
    ],
  },
  {
    lane: "Science",
    icon: "telescope",
    items: [
      { 
        type: "segment",
        start: 1543,
        end: 1687,
        label: "Scientific Revolution",
        url: "https://en.wikipedia.org/wiki/Scientific_Revolution"
      },
      ...Array.from({ length: 3 }, (_, i) => {
        const randomOffset = Math.floor(Math.random() * 20) * 12; 
        const baseYear = 1400 + (i * 20);
        return {
          type: "point",
          at: baseYear + randomOffset,
          label: `Historical event in year ${baseYear + randomOffset}`,
          url: `https://en.wikipedia.org/wiki/Timeline_of_the_${baseYear + randomOffset}s`
        };
      }),
    ],
  },
];
