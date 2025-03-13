import axios from "axios";
import { TimeSchedule } from "./model";
import { getItem, getTimeScheduleKey, setItem } from "@/shared/lib/cache";

export const getTimes = async (date: Date): Promise<TimeSchedule[]> => {
  const cacheKey = getTimeScheduleKey(date);

  const cachedData = getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/time",
      { date: date.toISOString() },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data as TimeSchedule[];
    setItem(cacheKey, JSON.stringify(data), 1000 * 60 * 15); // Кэш на 15 минут
    return data;
  } catch (error) {
    console.error("Ошибка в getTimes:", error);
    throw error;
  }
};
