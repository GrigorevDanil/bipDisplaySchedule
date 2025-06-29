import { format } from "date-fns";

import { httpClient } from "../../../httpClient";
import { parseXml } from "../../../parserXml";
import { handleGetTimeSchedule } from "../../time/get";

import { Schedule, ScheduleItem } from "@/shared/api/schedule/type";

const getTeacherShortName = (teacherLong: string): string => {
  const teacherParts = teacherLong.split(" ");

  return `${teacherParts[0]} ${teacherParts[1][0]}.${teacherParts[2][0]}.`;
};

export const handleGetSchedule = async (
  titleGroup: string,
  date: Date,
  serverAddress: string,
  username: string,
  password: string
): Promise<Schedule> => {
  const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://lockalhost/Shedule">
    <soapenv:Header/>
    <soapenv:Body>
        <tns:GetShedule>
            <tns:Group>${titleGroup}</tns:Group>
            <tns:DateShedule>${format(date, "yyyy-MM-dd")}</tns:DateShedule>
        </tns:GetShedule>
    </soapenv:Body>
</soapenv:Envelope>`;

  try {
    const timeSchedule = await handleGetTimeSchedule(
      date,
      serverAddress,
      username,
      password
    ).catch(() => null);

    const response = await httpClient({
      data: xmls,
      baseURL: `http://${serverAddress}/Colledge/ws/Shedule`,
      auth: {
        username,
        password,
      },
    }).catch(() => null);

    if (!response || !timeSchedule) {
      throw new Error("No data");
    }

    return new Promise((resolve, reject) => {
      parseXml(response.data, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("Ошибка парсинга XML:", err);

          return reject(err);
        }

        const responseBody =
          result["soap:Envelope"]?.["soap:Body"]?.["m:GetSheduleResponse"]?.[
            "m:return"
          ];

        const rows = responseBody["m:Rows"];
        let items: ScheduleItem[] = [];

        if (rows) {
          rows.forEach((row: any) => {
            const teacherLong = row["m:Teacher"]["m:Name"].trim();
            const teacherShort = getTeacherShortName(teacherLong);

            const timeSlot = timeSchedule.find(
              (time) => time.numLesson === row["m:NumberLesson"].trim()
            );

            const start = timeSlot?.start || "";
            const end = timeSlot?.end || "";

            items.push({
              discipline: row["m:Discipline"]["m:Name"].trim(),
              teacherLong,
              teacherShort,
              numLesson: row["m:NumberLesson"].trim(),
              territory: row["m:Territory"]["m:Name"].trim(),
              hall: row["m:LectureHall"]["m:Name"].trim(),
              group: row["m:Group"].trim(),
              start,
              end,
              date: date,
            });
          });
        }

        const schedule: Schedule = {
          date,
          items: items.sort((a, b) => a.start.localeCompare(b.start)),
        };

        resolve(schedule);
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
