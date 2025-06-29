import axios from "axios";

export const httpClient = axios.create({
  method: "POST",
  headers: {
    "Content-Type": "application/xml",
  },
});
