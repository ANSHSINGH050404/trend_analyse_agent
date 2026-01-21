export function calculateLikesPerHour(
  oldLikes: number,
  newLikes: number,
  hours: number
) {
  return (newLikes - oldLikes) / hours;
}
