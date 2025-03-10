import { Divider } from "@heroui/divider";
import { DAYS_OF_WEEK } from "@/shared/lib/constants";
import { Schedule } from "@/shared/api/schedule/model";
import { ScheduleItem } from "@/entities/schedule/ui";

type Props = {
  group: string;
};

export const WeekSchedule = ({ group }: Props) => {
  const schedule: Schedule = {
    discipline: "Математика",
    groups: ["ИП-4"],
    hall: "301",
    numLesson: "1",
    teacherLong: "Иванов Иван Иванович",
    teacherShort: "Иванов И.И",
    territory: "кор 1",
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg py-6 px-2 w-fit text-sm h-full">
      {/* Top Section */}
      <div className="flex flex-col gap-2 items-center h-full">
        {/* Group Section */}
        <div className="text-center flex justify-center">
          <p className="flex flex-col items-center leading-tight transform">
            {group}
          </p>
        </div>
        <Divider orientation="horizontal" />
        {/* Days of the Week */}
        <div className="flex-1 flex flex-col items-center justify-between w-full ">
          {DAYS_OF_WEEK.map((item, index) => (
            <>
              <div key={index} className="flex-1 flex-col  ">
                <ScheduleItem schedule={schedule} start="9:00" end="10:00" />
                <ScheduleItem schedule={schedule} start="9:00" end="10:00" />
                <ScheduleItem schedule={schedule} start="9:00" end="10:00" />
                <ScheduleItem schedule={schedule} start="9:00" end="10:00" />
              </div>
              {index !== DAYS_OF_WEEK.length - 1 && (
                <Divider
                  className="bg-blue-500 p-px rounded-lg"
                  orientation="horizontal"
                />
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
