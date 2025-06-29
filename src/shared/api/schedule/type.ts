export type ScheduleByGroup = {
  group: string;
  items: Schedule[];
};

export type Schedule = {
  date: Date;
  items: ScheduleItem[];
};

export type ScheduleItem = {
  discipline: string;
  teacherLong: string;
  teacherShort: string;
  numLesson: string;
  territory: string;
  hall: string;
  group: string;
  date: Date;
  start: string;
  end: string;
};

export type TimeSchedule = {
  numLesson: string;
  start: string;
  end: string;
  date: Date;
};
