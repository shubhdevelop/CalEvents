export function formatDateAndTime(dateStr: Date) {
  const date = new Date(dateStr);
  // Adjust for timezone offset
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}
