import { parseXml } from "../parserXml";
import { format } from "date-fns";
import { TimeSchedule } from "./model";
import { httpClient } from "../httpClient";

export const postRequestTime = async (date: Date, serverAddress: string): Promise<TimeSchedule[]> => {
  const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://lockalhost/Shedule">
    <soapenv:Header/>
    <soapenv:Body>
        <tns:GetTime>
            <tns:DateShedule>${format(date, "yyyy-MM-dd")}</tns:DateShedule>
        </tns:GetTime>
    </soapenv:Body>
</soapenv:Envelope>`;

  try {
    const response = await httpClient({ data: xmls, baseURL: `http://${serverAddress}/Colledge/ws/Shedule` });

    return new Promise((resolve, reject) => {
      parseXml(response.data, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("Ошибка парсинга XML:", err);
          return reject(err);
        }

        const responseBody =
          result["soap:Envelope"]?.["soap:Body"]?.["m:GetTimeResponse"]?.[
          "m:return"
          ];

        if (Object.keys(responseBody).length === 1 && responseBody["$"]) {
          return resolve([]);
        }

        const rows = [responseBody["m:RowsOfTime"]].flat();

        const timeSchedule: TimeSchedule[] = rows.map((row: any) => {
          return {
            numLesson: row["m:NumberLesson"].trim(),
            start: row["m:Begin"].trim().slice(3),
            end: row["m:End"].trim().slice(3),
            date: date,
          };
        });

        resolve(timeSchedule);
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
