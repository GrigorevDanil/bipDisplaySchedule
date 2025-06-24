import axios from "axios";

export const getGroupSchedules = async (
  group: string,
  date: Date,
  serverAddress: string
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/schedule/group`,
      { group, date: date.toISOString(), serverAddress },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка в getGroupSchedules:", error);
    throw error;
  }
};
