import axios from "axios";

const username = "Student3";
const password = "Student3";

const userLogin = "adminStudent3";
const userPassword = "adminStudent3";

const httpClient = axios.create({
  method: "POST",
  headers: {
    "Content-Type": "application/xml",
  },
  auth: {
    username: username,
    password: password,
  },
});

export { httpClient, userLogin, userPassword };