import axios from "axios";

export const getTeachers = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/teacher",
      null,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
