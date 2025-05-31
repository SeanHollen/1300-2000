export const findXValueForYear = (points, year) => {
  if (!year) return null;
  let closestPoint = points[0];
  let minDistance = Math.abs(points[0].year - year);
  
  for (let i = 1; i < points.length; i++) {
    const distance = Math.abs(points[i].year - year);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = points[i];
    }
  }

  return closestPoint.value;
};