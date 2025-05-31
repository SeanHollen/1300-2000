export const interpolateYValueForYear = (points, year) => {
  if (!year) {
    return null;
  }
  for (let i = 0; i < points.length; i++) {
    if (points[i].year < year) {
      continue;
    } else if (points[i].year == year) {
      // year matches exact point
      return points[i].value
    } else if (points[i].year > year) {
      if (!points[i - 1]) {
        // year is before the first point
        // return null rather than (points[i].value) because 
        // we don't want to display anything in this case
        return null;
      } else {
        // year is between two points - interpolate between them
        const pointA = points[i - 1];
        const pointB = points[i];
        const t = (year - pointA.year) / (pointB.year - pointA.year);
        return pointA.value + t * (pointB.value - pointA.value);
      }
    }
  }
  // all points are before the year
  return points[points.length - 1].value
};
