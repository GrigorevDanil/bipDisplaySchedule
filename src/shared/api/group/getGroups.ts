import axios from "axios";

export const getGroups = async (serverAddress: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group`,
      {
        serverAddress,
      },
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
