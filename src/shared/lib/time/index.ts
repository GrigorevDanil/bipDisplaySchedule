import { format } from "date-fns";
import moment from "moment-timezone";

export const getMoscowTime = () => {
  return moment().tz("Europe/Moscow");
};

export const getDateInFormatddMMyyyy = (date: Date) =>
  format(date, "dd.MM.yyyy");

export const getWorkDate = (): Date => {
  const today = new Date();

  if (today.getDay() === 0) {
    return new Date(today.setDate(today.getDate() + 1));
  }

  return today;
};
