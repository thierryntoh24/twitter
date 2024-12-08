export const defaultUrl = "http://localhost:3000";

export function formatTweetCount(count: number) {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"; // e.g., 1.5M
  } else if (count >= 10_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "k"; // e.g., 15k
  }
  return count.toLocaleString(); // Below 10,000, add commas (e.g., "9,870")
}
