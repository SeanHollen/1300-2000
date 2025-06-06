function parseData(data) {
  let res = data.split("\n").slice(1).map((row, i) => {
    let year = 1710 + i;
    let value = Number(row.split("\t")[1]);
    return { year: year, value: value }
  })
  return res;
}
JSON.stringify(parseData([]));