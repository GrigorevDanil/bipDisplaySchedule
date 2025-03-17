import { Schedule } from "@/shared/api/schedule/model";
import { Divider } from "@heroui/divider";

type Props = {
  schedule: Schedule;
};

export const ScheduleItem = ({ schedule }: Props) => {
  return (
    <div className="w-full h-fit rounded-lg flex shadow text-xs pl-1 pr-1 py-0.5">
      {/* Время (20%) */}
      <div className="w-9 flex flex-col justify-center items-center text-[10px]">
        <p className="font-semibold">{schedule.start}</p>
        <Divider className="w-[50%]" />
        <p className="color-gray-400">{schedule.end}</p>
      </div>

      {/* Вертикальный разделитель */}
      <div className="w-1 rounded-full bg-blue-500" />

      {/* Основная информация (78%) */}
      <div className="flex flex-col w-fit pl-1 gap-px ">
        {/* Дисциплина и номер пары */}
        <div className="flex justify-between items-center">
          {/* Дисциплина (слева) */}
          <p className="font-semibold text-left leading-none truncate w-44">
            {schedule.discipline}
          </p>

          {/* Номер пары (справа) */}
          <p className="font-semibold text-right text-[10px]">
            {schedule.numLesson}
          </p>
        </div>

        {/* Кабинет, корпус и учитель */}
        <div className="flex justify-between flex-nowrap whitespace-nowrap text-[10px] gap-0.5">
          {/* Кабинет и корпус (слева) */}
          <div className="flex items-center text-[9px]">
            <p className="font-semibold">кб. {schedule.hall}</p>
            <p className="font-semibold text-gray-400">
              ({schedule.territory})
            </p>
          </div>

          {/* Учитель (справа) */}
          <p className="font-semibold">{schedule.teacherShort}</p>
        </div>
      </div>
    </div>
  );
};
