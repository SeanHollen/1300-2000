function smoothData(data, windowSize = 3) {
  const smoothed = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    // subtract an extra 1 so like if you're getting 1855 it is 1850-1859
    for (let j = i - halfWindow - 1; j <= i + halfWindow; j++) {
      if (j >= 0 && j < data.length) {
        sum += data[j].value;
        count++;
      }
    }

    smoothed.push({
      year: data[i].year,
      value: sum / count,
    });
  }

  return smoothed;
}
smoothData([{year: 2000, value: 100}, {year: 2001, value: 150}, {year: 2002, value: 200}, {year: 2003, value: 250}, {year: 2004, value: 300}]);