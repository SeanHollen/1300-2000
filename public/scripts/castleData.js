function readCastleData(castleData) {
  let firstYear = null;
  const years = [];
  castleData.forEach((castle) => {
    const year = Number(castle.yearBuilt);
    firstYear = firstYear || year;
    years[year] = (years[year] || 0) + 1;
  });
  const res = [];
  for (let i = firstYear; i < years.length; i++) {
    res.push({
      year: i,
      value: years[i] || 0,
    });
  }
  return res;
}
// let res = 
readCastleData([]);
