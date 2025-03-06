"use client";

import { getGroupSchedules } from "@/shared/api/schedule";
import { Schedule } from "@/shared/api/schedule/model";
import { useEffect, useState } from "react";

export const HomePage = () => {
  const [groups, setGroups] = useState<Schedule[]>([]);

  useEffect(() => {
    const init = async () => {
      setGroups(await getGroupSchedules("ИП-4", new Date()));
    };

    init();
  }, []);

  console.log(groups);

  return <h1>Hello, Next.js!</h1>;
};
