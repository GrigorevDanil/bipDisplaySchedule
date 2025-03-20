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
  getWeekSchedulesByGroups = async (groups: Group[]) => {
    try {
      this.isLoading = true;

      const weekSchedules: WeekSchedule[] = [];

      // Iterate through each group
      for (const group of groups) {
        // Use the existing ScheduleStore to get the weekly schedule
        await this.scheduleStore.getCurrentWeekSchedule(group.title);

        // Transform the scheduleList into WeekSchedule format
        const groupWeekSchedule: WeekSchedule = {
          group: group.title,
          schedules: [...this.scheduleStore.scheduleList],
          // Add any additional WeekSchedule properties you need
        };

        weekSchedules.push(groupWeekSchedule);
      }

      runInAction(() => {
        this.isLoading = false;
        this.weekScheduleList = weekSchedules;
      });
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.isLoading = false;
          this.weekScheduleListError = error.message;
          console.log(error);
        });
      }
    }
  };
}

export const store = new WeekScheduleStore(scheduleModel.store);
