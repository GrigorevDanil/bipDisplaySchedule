import axios from "axios";

const username = "WebService";
const password = "30pisoM";

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

export { httpClient, userLogin, userPassword, username, password };
