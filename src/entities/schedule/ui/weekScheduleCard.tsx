import { Divider } from "@heroui/divider";

import { ScheduleCard } from "./scheduleCard";

import { ScheduleByGroup } from "@/shared/api/schedule/type";

type Props = {
  scheduleByGroup: ScheduleByGroup;
};

export const WeekScheduleCard = ({ scheduleByGroup }: Props) => {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg py-6 px-2 text-sm h-full w-[230px]">
      <div className="flex flex-col gap-2 items-center h-full">
        <div className="text-center flex justify-center">
          <p className="flex flex-col items-center leading-tight transform">
            {scheduleByGroup.group}
          </p>
        </div>
        <Divider orientation="horizontal" />
        <div className="flex-1 flex flex-col items-center justify-between w-full divide-y-3 gap-1 divide-blue-500">
          {scheduleByGroup.items.map((schedule, index) => (
            <div key={index} className="flex-1 flex flex-col w-full gap-1">
              {schedule.items.map((item, indx) => (
                <ScheduleCard key={`${index} ${indx}`} schedule={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
