"use client";

import { BaseLayout } from "@/shared/ui/baseLayout";
import { GroupDisplay } from "@/widgets/groupDisplay";
import { Button } from "@heroui/button";

import { observer } from "mobx-react-lite";

export const HomePage = observer(() => {
  return (
    <BaseLayout className="items-center justify-center">
      <div className="flex flex-col p-2 bg-gray-50 rounded-lg shadow-md ">
        <p className="text-2xl text-center mb-10">Расписание Бизнес и право</p>
        <div className="flex justify-between items-center gap-10">
          <div className="flex flex-col gap-2">
            <Button size="lg">Вывести расписание</Button>
            <Button size="lg">Автозапуск</Button>
            <Button size="lg">Настройки</Button>
          </div>
          <GroupDisplay />
          <div className="flex flex-col gap-2">
            <Button size="lg">Вывести расписание</Button>
            <Button size="lg">Автозапуск</Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
});
