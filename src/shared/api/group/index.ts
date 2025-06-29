import { httpClientApp } from "../httpClient";

import { Group } from "./type";

export const getGroups = async (serverAddress: string): Promise<Group[]> => {
  try {
    const response = await httpClientApp.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group`,
      {
        serverAddress,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
