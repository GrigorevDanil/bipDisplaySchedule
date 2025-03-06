import axios from "axios";

export const getTeacherSchedules = async (teacher: string, date: Date) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/schedule/teacher",
      { teacher, date: date.toISOString() },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка в getTeacherTimes:", error);
    throw error;
  }
};
