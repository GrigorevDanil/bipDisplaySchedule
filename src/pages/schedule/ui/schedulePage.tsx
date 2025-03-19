"use client";

import { settingsModel } from "@/entities/settings";
import { weekScheduleModel } from "@/entities/weekSchedule";
import { WeekScheduleItem } from "@/entities/weekSchedule/ui";
import { Collection } from "@/shared/api/group/model";
import { getItem } from "@/shared/lib/storage";
import { ScheduleLayout } from "@/shared/ui/scheduleLayout";

import { HeaderSchedule } from "@/widgets/headerSchedule/index";
import { Spinner } from "@heroui/spinner";

import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

export const SchedulePage = observer(
  ({ params }: { params: Record<string, string> }) => {
    const { id } = params;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const {
      store: { getSettings, settings },
    } = settingsModel;

    const {
      store: { weekScheduleList, isLoading, getWeekSchedulesByGroups },
    } = weekScheduleModel;

    // Функция для получения данных расписания
    const fetchScheduleData = async () => {
      const json = getItem("collections");
      if (json) {
        const collections: Collection[] = JSON.parse(json);
        const groups = collections.find(
          (item) => item.id.toString() === id
        )?.groups;
        getWeekSchedulesByGroups(groups!);
      }
    };

    useEffect(() => {
      const setup = async () => {
        getSettings();

        // Первоначальная загрузка данных
        await fetchScheduleData();

        // Очистка предыдущего интервала при изменении настроек
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        // Установка нового интервала обновления (переводим минуты в миллисекунды)
        const refreshIntervalMs = settings?.refreshDelay * 60 * 1000;
        intervalRef.current = setInterval(() => {
          fetchScheduleData();
        }, refreshIntervalMs);
      };

      setup();

      // Очистка интервала при размонтировании компонента
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [settings?.refreshDelay]);

    return (
      <ScheduleLayout>
        <HeaderSchedule />
        {isLoading ? (
          <Spinner className="m-auto" color="default" size="lg" />
        ) : (
          weekScheduleList.map((item, index) => {
            return <WeekScheduleItem key={index} weekSchedule={item} />;
          })
        )}
      </ScheduleLayout>
    );
  }
);
