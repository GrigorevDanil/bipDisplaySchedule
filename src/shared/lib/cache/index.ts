import { format } from "date-fns";

interface StorageItem {
  value: string;
  timestamp?: number;
}

const cache: Record<string, StorageItem> = {};

// Сохранение данных с TTL
export const setItem = (key: string, value: string, ttl?: number) => {
  const item: StorageItem = { value };
  if (ttl) {
    item.timestamp = Date.now() + ttl;
  }
  cache[key] = item;
};

// Получение данных с проверкой TTL
export const getItem = (key: string): string | null => {
  const item = cache[key];
  if (!item) return null;

  if (item.timestamp && Date.now() > item.timestamp) {
    delete cache[key];
    return null;
  }
  return item.value;
};

export const getTimeScheduleKey = (date: Date) =>
  "time_" + format(date, "yyyy-MM-dd");
