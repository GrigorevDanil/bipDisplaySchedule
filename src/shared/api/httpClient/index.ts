import axios from "axios";

const url = "http://85.172.38.9:5580/Colledge/ws/Shedule";
const username = "Student3";
const password = "Student3";

export const httpClient = axios.create({
  baseURL: url,
  method: "POST",
  headers: {
    "Content-Type": "application/xml",
  },
  auth: {
    username: username,
    password: password,
  },
});
