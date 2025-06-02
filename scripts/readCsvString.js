function readCsvString(csvString) {
  const lineDelimiter = "\n";
  const valueDelimiter = ",";
  const headerRows = 1;

  let res = csvString.split(lineDelimiter).slice(headerRows).map(row => {
    let spl = row.split(valueDelimiter)

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