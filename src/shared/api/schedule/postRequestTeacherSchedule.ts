import axios from "axios";
import { password, url, username } from "../settingServer";
import { parseXml } from "../parserXml";
import { format } from "date-fns";
import { Schedule } from "./model";

export const postRequestTeacherShedule = async (
  teacherName: string,
  date: Date
): Promise<Schedule[]> => {
  const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://lockalhost/Shedule">
    <soapenv:Header/>
    <soapenv:Body>
        <tns:GetSheduleTeacher>
            <tns:Teacher>${teacherName}</tns:Teacher>
            <tns:DateShedule>${format(date, "yyyy-MM-dd")}</tns:DateShedule>
        </tns:GetSheduleTeacher>
    </soapenv:Body>
</soapenv:Envelope>`;

  try {
    const response = await axios.post(url, xmls, {
      headers: {
        "Content-Type": "application/xml",
      },
      auth: {
        username: username,
        password: password,
      },
    });

    return new Promise((resolve, reject) => {
      parseXml(response.data, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("Ошибка парсинга XML:", err);
          return reject(err);
        }

        const responseBody =
          result["soap:Envelope"]?.["soap:Body"]?.[
            "m:GetSheduleTeacherResponse"
          ]?.["m:return"];

        if (Object.keys(responseBody).length === 1 && responseBody["$"]) {
          return resolve([]);
        }

        const rows = responseBody["m:Rows"];
        const scheduleMap: { [key: string]: Schedule } = {};

        rows.forEach((row: any) => {
          const fullTeacherName = row["m:Teacher"]["m:Name"].trim();
          const teacherParts = fullTeacherName.split(" ");
          const teacherLong = fullTeacherName;
          const teacherShort = `${teacherParts[0]} ${teacherParts[1][0]}.${teacherParts[2][0]}.`;
          const numLesson = row["m:NumberLesson"].trim();

          const key = numLesson; // Используем номер урока как ключ

          if (!scheduleMap[key]) {
            scheduleMap[key] = {
              discipline: row["m:Discipline"]["m:Name"].trim(),
              teacherLong,
              teacherShort,
              numLesson,
              territory: row["m:Territory"]["m:Name"].trim(),
              hall: row["m:LectureHall"]["m:Name"].trim(),
              groups: [row["m:Group"].trim()],
              date: date,
            };
          } else {
            scheduleMap[key].groups.push(row["m:Group"].trim());
          }

          scheduleMap[key].groups.sort((a, b) => a.localeCompare(b));
        });

        const schedule: Schedule[] = Object.values(scheduleMap);
        resolve(schedule);
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
