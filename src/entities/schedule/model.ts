import { makeAutoObservable, runInAction } from "mobx";

import { Group } from "@/shared/api/group/type";
import { getWeekScheduleByGroups } from "@/shared/api/schedule";
import { ScheduleByGroup } from "@/shared/api/schedule/type";

class WeekScheduleStore {
  weekScheduleList: ScheduleByGroup[] = [];
  isLoading = false;
  weekScheduleListError = "";

  constructor() {
    makeAutoObservable(this);
  }

  getWeekScheduleByGroups = async (groups: Group[], serverAddress: string) => {
    try {
      this.isLoading = true;

      const weekScheduleList = await getWeekScheduleByGroups(
        groups,
        serverAddress
      );

      runInAction(() => {
        this.isLoading = false;
        this.weekScheduleList = weekScheduleList;
        this.weekScheduleListError = "";
      });
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.isLoading = false;
          this.weekScheduleListError = error.message;
        });
      }
    }
  };
}

export const store = new WeekScheduleStore();
