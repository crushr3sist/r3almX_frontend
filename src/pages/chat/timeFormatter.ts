export default function formatDateTime(date: Date): string {
  // Helper function to pad single digit numbers with a leading zero
  const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  // Extract date components
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // Months are zero-indexed
  const day = padZero(date.getDate());

  // Extract time components and determine AM/PM
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12; // Convert to 12-hour format, handle midnight (0 to 12)
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const ampm = hours24 >= 12 ? "PM" : "AM";

  // Format and return the date and time string
  return `${year}-${month}-${day} ${padZero(
    hours12
  )}:${minutes}:${seconds} ${ampm}`;
}
