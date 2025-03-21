import { makeAutoObservable, runInAction } from "mobx";
import { ScheduleStore } from "@/entities/schedule/model";
import { scheduleModel } from "@/entities/schedule";
import { WeekSchedule } from "./model";
import { Group } from "@/shared/api/group/model";

class WeekScheduleStore {
  scheduleStore: ScheduleStore;
  weekScheduleList: WeekSchedule[] = [];
  isLoading = false;
  weekScheduleListError = "";

  constructor(store: ScheduleStore) {
    this.scheduleStore = store;
    makeAutoObservable(this);
  }

  // New method to get week schedules for multiple groups
  getWeekSchedulesByGroups = async (groups: Group[], serverAddress: string) => {
    try {
      this.isLoading = true;

      const promises = groups.map(group => new Promise<WeekSchedule>(async (res, rej) => {
        await this.scheduleStore.getCurrentWeekSchedule(group.title, serverAddress);

        if (this.scheduleStore.scheduleListError)
          rej(this.scheduleStore.scheduleListError);

        // Transform the scheduleList into WeekSchedule format
        const groupWeekSchedule: WeekSchedule = {
          group: group.title,
          schedules: [...this.scheduleStore.scheduleList],
          // Add any additional WeekSchedule properties you need
        };

        res(groupWeekSchedule);
      }));

      const weekSchedules = await Promise.allSettled(promises);

      if (weekSchedules.some(i => i.status == 'rejected'))
        throw new Error("No data");

      const weekSchedulesList = weekSchedules.filter(i => i.status == 'fulfilled').map(i => i.value);

      runInAction(() => {
        this.isLoading = false;
        this.weekScheduleList = weekSchedulesList;
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

export const store = new WeekScheduleStore(scheduleModel.store);
