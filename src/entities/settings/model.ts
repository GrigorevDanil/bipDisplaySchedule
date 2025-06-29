import { makeAutoObservable, runInAction } from "mobx";

import { defaultSettings } from "./defaultSettings";
import { Setting } from "./type";

import {
  SETTINGS_KEY,
  getItemFromLocalStorage,
  setItemInLocalStorage,
} from "@/shared/lib/storage";

class SettingsStore {
  settings: Setting = defaultSettings;

  constructor() {
    makeAutoObservable(this);
  }

  getSettings = () => {
    const settingsData = getItemFromLocalStorage(SETTINGS_KEY);

    if (settingsData !== null) {
      this.settings = JSON.parse(settingsData);
    }
  };

  saveSettings = (newSettings: Partial<Setting>) => {
    const updatedSettings = { ...this.settings, ...newSettings };

    setItemInLocalStorage(SETTINGS_KEY, JSON.stringify(updatedSettings));

    runInAction(() => {
      this.settings = updatedSettings;
    });
  };

  resetSettings = () => {
    setItemInLocalStorage(SETTINGS_KEY, JSON.stringify(defaultSettings));

    runInAction(() => {
      this.settings = defaultSettings;
    });
  };
}

export const store = new SettingsStore();
