import { Divider } from "@heroui/divider";
import { DAYS_OF_WEEK } from "@/shared/lib/constants";
import { ScheduleItem } from "@/entities/schedule/ui";
import { WeekSchedule } from "../model/model";
import clsx from "clsx";

type Props = {
  weekSchedule: WeekSchedule;
};

export const WeekScheduleItem = ({ weekSchedule }: Props) => {
  // Функция для получения названия дня недели
  const getDayNameFromDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const dayIndex = dateObj.getDay(); // 0 - воскресенье, 1 - понедельник и т.д.
    // Сдвигаем, чтобы соответствовать DAYS_OF_WEEK (Понедельник = 0)
    return DAYS_OF_WEEK[dayIndex === 0 ? 6 : dayIndex - 1];
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg py-6 px-2 w-fit text-sm h-full">
      {/* Top Section */}
      <div className="flex flex-col gap-2 items-center h-full">
        {/* Group Section */}
        <div className="text-center flex justify-center">
          <p className="flex flex-col items-center leading-tight transform">
            {weekSchedule.group}
          </p>
        </div>
        <Divider orientation="horizontal" />
        {/* Days of the Week */}
        <div className="flex-1 flex flex-col items-center justify-between w-full divide-y-3 divide-blue-500">
          {DAYS_OF_WEEK.map((day, index) => {
            // Фильтруем занятия для текущего дня
            const daySchedules = weekSchedule.schedules.filter((schedule) => {
              const dayName = getDayNameFromDate(schedule.date);
              return dayName === day;
            });

            return (
              <div
                key={index}
                className="flex-1 flex flex-col w-full min-h-0" // flex-1 для равной высоты
              >
                {/* Отображаем занятия, если они есть */}
                {daySchedules.map((schedule, idx) => (
                  <ScheduleItem key={idx} schedule={schedule} />
                ))}
                {/* Убираем Divider из дочернего элемента, используем divide-y */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
