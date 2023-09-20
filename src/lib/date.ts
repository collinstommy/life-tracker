import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const getCurrentDate = () => dayjs().format("YYYY-MM-DD");

export const getCurrentDateTime = () => dayjs().toISOString();

export function getPreviousDaysList(lookbackDays: number) {
  return Array.from({ length: lookbackDays }).map((_, index) => {
    const date = dayjs(getCurrentDate()).subtract(index, "day");
    return dayjs(date).format("YYYY-MM-DD");
  });
}

export function toDayOfWeek(dateString: string) {
  const date = dayjs(dateString);
  if (date.isToday()) {
    return `Today (${date.format("ddd")})`;
  }
  if (date.isYesterday()) {
    return `Yesterday (${date.format("ddd")})`;
  }
  return date.format("ddd");
}
