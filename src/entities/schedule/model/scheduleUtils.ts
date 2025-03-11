import moment from "moment-timezone";

export const getMoscowTime = () => {
  return moment().tz("Europe/Moscow");
};
