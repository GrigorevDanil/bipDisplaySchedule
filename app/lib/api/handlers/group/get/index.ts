import { parseXml } from "../../../parserXml";
import { Group } from "../../../../../../src/shared/api/group/type";
import { httpClient } from "../../../httpClient";

export const handleGetGroups = async (
  serverAddress: string,
  username: string,
  password: string
): Promise<Group[]> => {
  const xmls = `<?xml version="1.0" encoding="utf-8"?>
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://lockalhost/Shedule">
      <soapenv:Header/>
      <soapenv:Body>
          <tns:GetGroup/>
      </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const response = await httpClient({
      data: xmls,
      auth: {
        username: username,
        password: password,
      },
      baseURL: `http://${serverAddress}/Colledge/ws/Shedule`,
    });

    const groups = await new Promise<Group[]>((resolve, reject) => {
      parseXml(response.data, { explicitArray: false }, (err, result) => {
        if (err) {
          return reject(err);
        }

        const rowsOfGroup =
          result?.["soap:Envelope"]?.["soap:Body"]?.["m:GetGroupResponse"]?.[
            "m:return"
          ]?.["m:RowsOfGroup"];

        const groups = Array.from(
          new Set(rowsOfGroup.map((row: any) => row["m:Group"]?.trim()))
        ).map((title) => ({ title }));

        resolve(groups as Group[]);
      });
    });

    return groups;
  } catch (error) {
    throw error;
  }
};
