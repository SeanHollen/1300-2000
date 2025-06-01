function readCsvString(csvString) {
  const delimiter = "\n";
  const headerRows = 1;

  let res = csvString.split(delimiter).slice(headerRows).map(row => {
    let spl = row.split(",")

    const year = spl[0]
    const value = spl[1];

    return {
        year: Number(year),
        value: Number(value),
    }
  })
  return res.sort((a, b) => a.year - b.year)
}
let res = readCsvString("");
JSON.stringify(res);