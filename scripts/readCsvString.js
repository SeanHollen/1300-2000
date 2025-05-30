function readCsvString(csvString) {
  const delimiter = "\n";
  const headerRows = 1;
  const yearIndex = 2;
  const valueIndex = 3;

  let res = csvString.split(delimiter).slice(headerRows).map(row => {
    let spl = row.split(",")
    return {
        year: Number(spl[yearIndex]),
        value: Number(spl[valueIndex]),
    }
  })
  res = res.sort((a, b) => a.year - b.year)
  JSON.stringify(res)
  return res;  
}
readCsvString("");