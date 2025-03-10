import { DAYS_OF_WEEK } from "@/shared/lib/constants";
import { Divider } from "@heroui/divider";

export const HeaderSchedule = () => {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg py-6 px-2 w-fit text-sm h-full">
      {/* Top Section */}
      <div className="flex flex-col gap-2 items-center h-full">
        {/* Group Section */}
        <div className="text-center flex justify-center">
          <p className="flex flex-col items-center leading-tight transform">
            Группа
          </p>
        </div>
        <Divider orientation="horizontal" />
        {/* Days of the Week */}
        <div className="flex-1 flex flex-col items-center justify-between w-full ">
          {DAYS_OF_WEEK.map((item, index) => (
            <>
              <div
                key={index}
                className="flex-1 text-center w-full flex items-center justify-center "
              >
                <p className="flex flex-col items-center leading-none transform ">
                  {item.split("").map((char, idx) => (
                    <span key={idx}>{char}</span>
                  ))}
                </p>
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
