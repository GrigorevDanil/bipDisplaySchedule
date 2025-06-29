export const setItemInLocalStorage = (
  key: string,
  value: string,
  ttl?: number
) => {
  try {
    const item: StorageItem = { value };

    if (ttl) {
      item.timestamp = Date.now() + ttl;
    }

    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Ошибка сохранения данных", error);
  }
};

export const getItemFromLocalStorage = (key: string) => {
  try {
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
  } catch (error) {
    console.error("Ошибка чтения данных", error);

    return null;
  }
};

export const removeItemInLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Ошибка удаление данных", error);
  }
};

export const clearLocalStorageStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Ошибка очистки хранилища", error);
  }
};

export const CORPUSES_KEY = "corpuses";

export const SETTINGS_KEY = "settings";
