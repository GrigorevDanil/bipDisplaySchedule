import { Settings } from "@/shared/api/settings/model";
import { getItem } from "@/shared/lib/storage";
import { makeAutoObservable, runInAction } from "mobx";

class SettingsStore {
  defaultSettings: Settings = {
    serverAddress: '85.172.38.9:5580',
    refreshDelay: 5
  };
  settings!: Settings;

  constructor() {
    makeAutoObservable(this);
  }

  getSettings = () => {
    const settingsData = getItem('settings');

    if (!settingsData)
      return runInAction(() => {
        this.settings = this.defaultSettings;
      });

    runInAction(() => {
      this.settings = JSON.parse(settingsData);
    });
  }
}

export const store = new SettingsStore();