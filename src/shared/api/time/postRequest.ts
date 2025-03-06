import axios from "axios";
import { password, url, username } from "../settingServer";
import { parseXml } from "../parserXml";
import { format } from "date-fns";
import { TimeShedule } from "./model";

export const postRequestTime = async (date: Date): Promise<TimeShedule[]> => {
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
          result["soap:Envelope"]?.["soap:Body"]?.["m:GetTimeResponse"]?.[
            "m:return"
          ];

        if (Object.keys(responseBody).length === 1 && responseBody["$"]) {
          return resolve([]);
        }

        const rows = [responseBody["m:RowsOfTime"]].flat();

        const timeSchedule: TimeShedule[] = rows.map((row: any) => {
          return {
            numLesson: row["m:NumberLesson"].trim(),
            start: row["m:Begin"].trim().slice(3),
            end: row["m:End"].trim().slice(3),
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
