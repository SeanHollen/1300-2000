function smoothData(data, windowSize = 3) {
  const smoothed = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = i - halfWindow; j <= i + halfWindow; j++) {
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
smoothData([1, 2, 3]);