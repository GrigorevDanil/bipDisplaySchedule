import { getDateInFormatddMMyyyy } from "@/shared/lib/time";

const cache: Record<string, StorageItem> = {};

export const setItemInCache = (key: string, value: string, ttl?: number) => {
  const item: StorageItem = { value };

  if (ttl) {
    item.timestamp = Date.now() + ttl;
  }
  cache[key] = item;
};

export const getItemFromCache = (key: string): string | null => {
  const item = cache[key];

  if (!item) return null;

  if (item.timestamp && Date.now() > item.timestamp) {
    delete cache[key];

    return null;
  }

  return item.value;
};

export const getTimeScheduleKey = (date: Date) =>
  "time_" + getDateInFormatddMMyyyy(date);
