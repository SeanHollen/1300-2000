function findNumPointsInSegments(timelineData) {
  const res = {
    sums: {
        in: 0,
        out: 0
    }
  }
  Object.keys(timelineData).forEach(category => {
    const name = timelineData[category].lane;
    const val = timelineData[category]
    const segments = val.items
        .filter(item => item.type === "segment")
        .sort((a, b) => a.start - b.start)
    let segmentIdx = 0;
    let ins = 0;
    let outs = 0;
    val.items
        .filter(item => item.type === "point")
        .sort((a, b) => a.at - b.at)
        .forEach(point => {
            if (!segments[segmentIdx]) {
                outs++;
            } else if (point.at < segments[segmentIdx].start) {
                outs++;
            } else if (point.at < segments[segmentIdx].end) {
                ins++;
            } else {
                segmentIdx++;
            }
        })
    res[name] = {
        in: ins,
        out: outs,
        pctIn: ins / (ins + outs)
    }
    res.sums.in += ins;
    res.sums.out += outs;
  })
  res.sums.pctIn = res.sums.in / (res.sums.in + res.sums.out);
}
findNumPointsInSegments({});