import axios from "axios";

export const httpClientApp = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
