function sumByYear(data) {
  const map = new Map();
  for (const { year, value } of data) {
    map.set(year, (map.get(year) || 0) + value);
  }
  return Array.from(map.entries()).map(([year, value]) => ({ year, value }));
}

function countByYear(data) {
  const map = new Map();
  for (const { year } of data) {
    map.set(year, (map.get(year) || 0) + 1);
  }
  return Array.from(map.entries()).map(([year, value]) => ({ year, value }));
}

export { sumByYear, countByYear };