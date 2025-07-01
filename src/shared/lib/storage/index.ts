import { StorageItem } from "./type";

export const setItemInLocalStorage = (
  key: string,
  value: string,
  ttl?: number
) => {
  const item: StorageItem = { value };

  if (ttl) {
    item.timestamp = Date.now() + ttl;
  }

  localStorage.setItem(key, JSON.stringify(item));
};

export const getItemFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);

  if (item) {
    const parsedItem: StorageItem = JSON.parse(item);

    if (parsedItem.timestamp && Date.now() > parsedItem.timestamp) {
      localStorage.removeItem(key);

      return null;
    }

    return parsedItem.value;
  }

  return null;
};

export const removeItemInLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const clearLocalStorageStorage = () => {
  localStorage.clear();
};

export const CORPUSES_KEY = "corpuses";

export const SETTINGS_KEY = "settings";
