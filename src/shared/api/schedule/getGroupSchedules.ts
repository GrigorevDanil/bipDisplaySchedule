import axios from "axios";

export const getGroupSchedules = async (group: string, date: Date) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/schedule/group",
      { group, date: date.toISOString() },
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
