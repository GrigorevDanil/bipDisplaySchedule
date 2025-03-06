import axios from "axios";
import { password, url, username } from "../settingServer";
import { parseXml } from "../parserXml";
import { Teacher } from "./model";

export const postRequestTeacher = async (): Promise<Teacher[]> => {
  const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://lockalhost/Shedule">
      <soapenv:Header/>
      <soapenv:Body>
          <tns:GetTeacher/>
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

    // Парсинг XML-ответа
    return new Promise((resolve, reject) => {
      parseXml(response.data, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("Ошибка парсинга XML:", err);
          return reject(err);
        }

        const rows =
          result["soap:Envelope"]["soap:Body"]["m:GetTeacherResponse"][
            "m:return"
          ]["m:RowsOfTeacher"];

        const teachers: Teacher[] = rows.map((row: any) => {
          const fullTeacherName = row["m:TeacherName"].trim();
          const teacherParts = fullTeacherName.split(" ");

          const teacherLong = fullTeacherName;
          const teacherShort = `${teacherParts[0]} ${teacherParts[1][0]}.${teacherParts[2][0]}.`;

          return {
            fullName: teacherLong,
            shortName: teacherShort,
          };
        });

        const uniqueTeachers = Array.from(
          new Set(teachers.map((teacher) => JSON.stringify(teacher)))
        ).map((str) => JSON.parse(str));

        resolve(uniqueTeachers);
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
