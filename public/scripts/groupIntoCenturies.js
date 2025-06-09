function groupIntoCenturies(timelineData) {
    const centuries = {}
    timelineData[5].points.forEach(item => {
        const year = Math.floor(item.year / 10) * 10;
        centuries[year] = centuries[year] || []
        centuries[year].push(item.value)
    })
    const res = Object.values(centuries).map(x => x.reduce((acc, item) => acc + item) / x.length)
    return res;
}
groupIntoCenturies({});

function groupIntoCenturies2(timelineData) {
    const groupedByCentury = Object.values(
        timelineData.reduce((acc, { year, value }) => {
        const century = Math.floor(year / 10) * 10;
        if (!acc[century]) acc[century] = { century, value: 0 };
        acc[century].value += value;
        return acc;
        }, {})
    );
    return groupedByCentury;
}
groupIntoCenturies2({})