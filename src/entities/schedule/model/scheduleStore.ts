import { makeAutoObservable, runInAction } from "mobx";
import moment from "moment"; // Install with: npm install moment
import { Schedule } from "@/shared/api/schedule/model";
import { getGroupSchedules } from "@/shared/api/schedule";

export class ScheduleStore {
  scheduleList: Schedule[] = [];
  isLoading = false;
  scheduleListError = "";

  constructor() {
    makeAutoObservable(this);
  }

  // Existing method to fetch schedule for a single day
  getSheduleList = async (titleGroup: string, date: Date) => {
    try {
      this.isLoading = true;

      const data = await getGroupSchedules(titleGroup, date);

      runInAction(() => {
        this.isLoading = false;
        this.scheduleList = data;
      });
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.isLoading = false;
          this.scheduleListError = error.message;
          console.log(error);
        });
      }
    }
  };

  // New method to fetch schedule for the entire week
  getCurrentWeekSchedule = async (titleGroup: string) => {
    try {
      this.isLoading = true;
      const weeklySchedule: Schedule[] = [];

      // Get the current date and the start of the week (Monday)
      const startOfWeek = moment().startOf("week").add(1, "day"); // Start from Monday
      const weekDates = Array.from({ length: 7 }).map((_, index) =>
        startOfWeek.clone().add(index, "days").toDate()
      );

      // Fetch schedule for all days of the week in parallel
      const schedulesPromises = weekDates.map((date) =>
        getGroupSchedules(titleGroup, date)
      );
      const results = await Promise.allSettled(schedulesPromises);

      // Process results and combine successful schedules
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          weeklySchedule.push(...result.value);
        } else {
          console.log(
            `Error fetching schedule for ${weekDates[index].toISOString()}: ${result.reason}`
          );
        }
      });

      // Update state with the weekly schedule
      runInAction(() => {
        this.isLoading = false;
        this.scheduleList = weeklySchedule;
      });
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.isLoading = false;
          this.scheduleListError = error.message;
          console.log(error);
        });
      }
    }
  };
}

export const store = new ScheduleStore();
