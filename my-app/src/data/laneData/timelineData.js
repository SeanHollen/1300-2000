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
        type: "point",
        at: 1870,
        start: 1870,
        end: 1871,
        label: "Franco-Prussian War",
        url: "https://en.wikipedia.org/wiki/Franco-Prussian_War",
        category: "bad"
      },
      {
        type: "point",
        at: 1815,
        label: `Congress of Vienna Signed`,
        url: "https://en.wikipedia.org/wiki/Congress_of_Vienna",
        category: "good"
      },
      {
        type: "point",
        at: 1648,
        label: `Peace of Westphilia Signed`,
        url: "https://en.wikipedia.org/wiki/Peace_of_Westphalia",
        category: "good"
      },
      {
        type: "point",
        at: 1917,
        label: `Russian Revolution`,
        url: "https://en.wikipedia.org/wiki/Russian_Revolution",
        category: "neutral"
      },
      {
        type: "point",
        at: 1776,
        label: `US Declaration of Independence`,
        url: "https://en.wikipedia.org/wiki/United_States_Declaration_of_Independence",
        category: "neutral"
      },
      {
        type: "point",
        at: 1789,
        start: 1789,
        end: 1799,
        label: `French Revolution`,
        url: "https://en.wikipedia.org/wiki/French_Revolution",
        category: "neutral"
      },
      {
        type: "point",
        at: 1688,
        start: 1688,
        end: 1689,
        label: `Glorious Revolution`,
        url: "https://en.wikipedia.org/wiki/Glorious_Revolution",
        category: "neutral"
      },
      {
        type: "point",
        at: 1848,
        label: `Springtime of Nations`,
        url: "https://en.wikipedia.org/wiki/Revolutions_of_1848",
        category: "neutral"
      },
      {
        type: "point",
        at: 1989,
        label: `End of Cold War`,
        url: "https://en.wikipedia.org/wiki/End_of_the_Cold_War",
        category: "good"
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
    ],
  },
  {
    lane: "Religion and Culture",
    icon: "book",
    items: [
      { 
        type: "segment",
        start: 1378,
        end: 1417,
        label: "Western Schism",
        url: "https://en.wikipedia.org/wiki/Western_Schism"
      },
      { 
        type: "segment",
        start: 1517,
        end: 1648,
        label: "Protestant Reformation",
        url: "https://en.wikipedia.org/wiki/Protestant_Reformation"
      },
      { 
        type: "point",
        at: 1626,
        start: 1580,
        end: 1650,
        label: "European Witch Trials",
        url: "https://en.wikipedia.org/wiki/Witch_trials_in_the_early_modern_period",
        category: "bad"
      },
      { 
        type: "point",
        at: 1534,
        label: "Acts of Supremacy",
        url: "https://en.wikipedia.org/wiki/Acts_of_Supremacy",
        category: "neutral"
      },
      {
        type: "point",
        at: 1517,
        label: `Ninety-Five Theses`,
        url: "https://en.wikipedia.org/wiki/Ninety-Five_Theses",
        category: "neutral"
      },
      {
        type: "point",
        at: 1685,
        label: `Revocation of the Edict of Nantes`,
        url: "https://en.wikipedia.org/wiki/Edict_of_Fontainebleau",
        category: "neutral"
      },
      {
        type: "point",
        at: 1478,
        start: 1478,
        end: 1834,
        label: `Spanish Inquisition`,
        url: "https://en.wikipedia.org/wiki/Spanish_Inquisition",
        category: "neutral"
      },
      {
        type: "point",
        at: 1455,
        label: `Gutenberg Bible`,
        url: "https://en.wikipedia.org/wiki/Gutenberg_Bible",
        category: "good"
      },
      {
        type: "point",
        at: 1545,
        start: 1545,
        end: 1563,
        label: `Council of Trent`,
        url: "https://en.wikipedia.org/wiki/Council_of_Trent",
        category: "neutral"
      },
    ],
  },
  {
    lane: "Health and Disease",
    icon: "vaccine",
    items: [
      { 
        type: "segment",
        start: 1346,
        end: 1353,
        label: "Black Death",
        url: "https://en.wikipedia.org/wiki/Black_Death"
      },
      { 
        type: "point",
        at: 1918,
        start: 1918,
        end: 1920,
        label: "Spanish Flu",
        url: "https://en.wikipedia.org/wiki/Spanish_flu",
        category: "bad"
      },
      { 
        type: "segment",
        start: 1492,
        end: 1600,
        label: "Colombian Exchange",
        url: "https://en.wikipedia.org/wiki/Columbian_exchange#Of_diseases",
        category: "bad"
      },
      { 
        type: "point",
        at: 1907,
        start: 1855,
        end: 1960,
        label: "Third Plague Pandemic",
        url: "https://en.wikipedia.org/wiki/Third_plague_pandemic",
        category: "bad"
      },
      { 
        type: "point",
        at: 1630,
        start: 1629,
        end: 1631,
        label: "Italy Plague",
        url: "https://en.wikipedia.org/wiki/1629%E2%80%931631_Italian_plague",
        category: "bad"
      },
      {
        type: "point",
        at: 1665,
        start: 1665,
        end: 1666,
        label: `Great Plague of London`,
        url: `https://en.wikipedia.org/wiki/Great_Plague_of_London`,
        category: "bad"
      },
      {
        type: "point",
        at: 1889,
        start: 1889,
        end: 1890,
        label: `Russian Flu`,
        url: `https://en.wikipedia.org/wiki/1889%E2%80%931890_pandemic`,
        category: "bad"
      },
      {
        type: "point",
        at: 1796,
        label: `Smallpox Vaccine`,
        url: `https://en.wikipedia.org/wiki/Smallpox_vaccine`,
        category: "good"
      },
      {
        type: "point",
        at: 1963,
        label: `Measles Vaccine`,
        url: `https://en.wikipedia.org/wiki/Measles_vaccine`,
        category: "good"
      },
      {
        type: "point",
        at: 1948,
        label: `DTP Vaccine`,
        url: `https://en.wikipedia.org/wiki/DPT_vaccine`,
        category: "good"
      },
      {
        type: "point",
        at: 1955,
        label: `Polio Vaccine`,
        url: `https://en.wikipedia.org/wiki/Polio_vaccine`,
        category: "good"
      },
      {
        type: "point",
        at: 1981,
        label: `Hepatitis B Vaccine`,
        url: `https://en.wikipedia.org/wiki/Hepatitis_B_vaccine`,
        category: "good"
      },
      {
        type: "point",
        at: 1861,
        label: `Germ Theory of Disease`,
        url: `https://en.wikipedia.org/wiki/Germ_theory_of_disease`,
        category: "good"
      },
      {
        type: "point",
        at: 1361,
        start: 1360,
        end: 1364,
        label: `Children's Plague`,
        url: "https://biographics.org/return-of-the-black-death-the-plague-of-children/",
        category: "bad"
      },
      {
        type: "point",
        at: 1942,
        start: 1928,
        end: 1943,
        label: `Penicillin`,
        url: "https://en.wikipedia.org/wiki/Penicillin#Development_and_medical_application",
        category: "good"
      },
      {
        type: "point",
        at: 1854,
        label: `John Snow's Research, Third Cholera Pandemic`,
        url: "https://en.wikipedia.org/wiki/1854_Broad_Street_cholera_outbreak",
        category: "neutral"
      },
      {
        type: "point",
        at: 1519,
        start: 1519,
        end: 1520,
        label: `Smallpox Introduced to Americas`,
        url: "https://en.wikipedia.org/wiki/History_of_smallpox#Epidemics_in_the_Americas",
        category: "bad"
      },
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
    ],
  },
  // {
  //   lane: "Climate",
  //   icon: "cloud",
  //   items: [
  //     {
  //       type: "point",
  //       at: 1300,
  //       label: "Start of Little Ice Age",
  //       url: "https://en.wikipedia.org/wiki/Little_Ice_Age",
  //       category: "bad"
  //     },
  //     {
  //       type: "point",
  //       at: 1815,
  //       label: "Mount Tambora Eruption",
  //       url: "https://en.wikipedia.org/wiki/1815_eruption_of_Mount_Tambora",
  //       category: "bad"
  //     },
  //     {
  //       type: "segment",
  //       start: 1920,
  //       end: 2000,
  //       label: "Modern Global Warming",
  //       ongoing: true,
  //       url: "https://en.wikipedia.org/wiki/Climate_change"
  //     },
  //     {
  //       type: "segment",
  //       start: 1660,
  //       end: 1715,
  //       label: "Maunder Minimum",
  //       url: "https://en.wikipedia.org/wiki/Maunder_Minimum"
  //     }
  //   ],
  // },
];
