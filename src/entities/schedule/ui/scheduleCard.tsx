import { Divider } from "@heroui/divider";

import { ScheduleItem } from "@/shared/api/schedule/type";

type Props = {
  schedule: ScheduleItem;
};

export const ScheduleCard = ({ schedule }: Props) => {
  return (
    <div className="w-full h-8 rounded-lg flex border border-blue-500 text-xs p-0.5 gap-1">
      {/* Время */}
      <div className="w-7 flex-shrink-0 flex flex-col justify-center items-center text-[10px]">
        <p className="font-semibold">{schedule.start}</p>
        <Divider className="w-[50%]" />
        <p className="text-gray-700">{schedule.end}</p>
      </div>

      {/* Вертикальный разделитель */}
      <div
        aria-hidden
        className="w-1 bg-blue-500 h-full rounded-lg flex-shrink-0"
      />

      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Первая строка - дисциплина и номер пары */}
        <div className="flex-1 flex justify-between items-center min-h-0">
          <p className="font-semibold text-left leading-none whitespace-nowrap overflow-hidden">
            <span
              className={`inline-block ${schedule.discipline.length > 20 ? "animate-scroll" : ""}`}
            >
              {schedule.discipline}
            </span>
          </p>
          <p className="font-semibold text-right px-1 flex-shrink-0">
            {schedule.numLesson}
          </p>
        </div>

        {/* Вторая строка - кабинет и преподаватель */}
        <div className="flex-1 flex justify-between items-center text-[9px] min-h-0">
          <div className="flex items-center">
            <p className="font-semibold">кб. {schedule.hall}</p>
            <p className="font-semibold text-gray-400">
              ({schedule.territory})
            </p>
          </div>
          <p className="font-semibold">{schedule.teacherShort}</p>
        </div>
      </div>
    </div>
  );
};
