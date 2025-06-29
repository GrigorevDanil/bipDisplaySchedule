import { Divider } from "@heroui/divider";

import { DAYS_OF_WEEK } from "@/shared/lib/constants";

export const HeaderSchedule = () => {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg py-6 px-2 w-fit text-sm h-full">
      <div className="flex flex-col gap-2 items-center h-full">
        <div className="text-center flex justify-center">
          <p className="flex flex-col items-center leading-tight transform">
            Группа
          </p>
        </div>
        <Divider orientation="horizontal" />
        <div className="flex-1 flex flex-col items-center justify-between w-full divide-y-3 gap-1 divide-blue-500">
          {DAYS_OF_WEEK.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex-col h-8 text-center w-full flex items-center justify-center "
            >
              <p className="flex flex-col items-center leading-none transform text-xs">
                {item.split("").map((char, idx) => (
                  <span key={`${index} ${idx}`}>{char}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
