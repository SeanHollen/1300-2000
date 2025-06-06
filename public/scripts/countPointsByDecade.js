let allItems = window.timelineState.reduce((arr, lane) => {return [...arr, ...lane.items]}, [])
let pointYears = allItems.map(item => item.at).filter(x => x).sort()
let grouped = {}
for (let i = 1300; i <= 2000; i+= 10) {
  grouped[i] = 0;
}
grouped = pointYears.reduce((acc, year) => {
  const decade = Math.floor(year / 10) * 10;
  return { ...acc, [decade]: acc[decade] + 1 };
}, grouped)