function readCsvString(csvString) {
  const delimiter = "\n";
  const headerRows = 1;
  const yearIndex = 2;

  let res = csvString.split(delimiter).slice(headerRows).map(row => {
    let spl = row.split(",")

    const value = Number(spl[3]);

    return {
        year: Number(spl[yearIndex]),
        value: Number(value),
    }
  })
  res = res.sort((a, b) => a.year - b.year)
  JSON.stringify(res)
  return res;  
}
let res = readCsvString("");
JSON.stringify(res);