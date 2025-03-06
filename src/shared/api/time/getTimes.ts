import axios from "axios";

export const getTimes = async (date: Date) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/time",
      { date: date.toISOString() },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка в getTimes:", error);
    throw error;
  }
};
