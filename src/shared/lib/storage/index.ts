import { format } from "date-fns";

// Интерфейс для хранения данных с TTL
interface StorageItem {
  value: string;
  timestamp?: number; // Время истечения срока действия (если указан TTL)
}

// Сохранение данных с возможностью указания TTL
export const setItem = (key: string, value: string, ttl?: number) => {
  try {
    const item: StorageItem = { value };

    // Если указан TTL, добавляем время истечения срока действия
    if (ttl) {
      item.timestamp = Date.now() + ttl;
    }

    // Сохраняем данные в формате JSON
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error saving data", error);
  }
};

// Получение данных с проверкой TTL
export const getItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);

    if (item) {
      const parsedItem: StorageItem = JSON.parse(item);

      // Проверяем, истек ли срок действия (если timestamp указан)
      if (parsedItem.timestamp && Date.now() > parsedItem.timestamp) {
        // Если TTL истек, удаляем элемент и возвращаем null
        localStorage.removeItem(key);
        return null;
      }

      // Возвращаем значение
      return parsedItem.value;
    }

    return null;
  } catch (error) {
    console.error("Error reading data", error);
    return null;
  }
};

// Удаление данных
export const removeItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing data", error);
  }
};

// Очистка всего хранилища
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing storage", error);
  }
};

export const getTimeScheduleKey = (date: Date) =>
  "time_" + format(date, "yyyy-MM-dd");
