function groupIntoCenturies(timelineData) {
    const centuries = {}
    timelineData[5].points.forEach(item => {
        centuries[Math.floor(item.year / 100)] = centuries[Math.floor(item.year / 100)] || []
        centuries[Math.floor(item.year / 100)].push(item.value)
    })
    const res = Object.values(centuries).map(x => x.reduce((acc, item) => acc + item) / x.length)
    return res;
}
groupIntoCenturies({});