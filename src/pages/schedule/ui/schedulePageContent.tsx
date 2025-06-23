"use client";

import { Spinner } from "@heroui/spinner";
import { mdiAlert } from "@mdi/js";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";

import { authModel } from "@/entities/authorization";
import { settingsModel } from "@/entities/settings";
import { weekScheduleModel } from "@/entities/weekSchedule";
import { WeekScheduleItem } from "@/entities/weekSchedule/ui";
import { Icon } from "@/pages/home/ui/icon";
import { Corpus } from "@/shared/api/group/model";
import { userLogin, userPassword } from "@/shared/api/httpClient";
import { getItem } from "@/shared/lib/storage";
import { ScheduleLayout } from "@/shared/ui/scheduleLayout";
import { HeaderSchedule } from "@/widgets/headerSchedule/index";

export const SchedulePageContent = observer(
  ({ scheduleId }: { scheduleId: string }) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [noData, setNoData] = useState<boolean>(false);

    const {
      store: { getAuth },
    } = authModel;

    const {
      store: { getSettings },
    } = settingsModel;

    const {
      store: { isLoading, weekScheduleList, getWeekSchedulesByGroups },
    } = weekScheduleModel;

    const isError = useMemo(
      () =>
        noData ||
        !authModel.store.auth?.login ||
        !authModel.store.auth.password ||
        authModel.store.auth.login != userLogin ||
        authModel.store.auth.password != userPassword,
      [authModel.store.auth, weekScheduleList, noData]
    );

    const fetchScheduleData = async () => {
      const json = getItem("corpuses");
      const json2 = getItem("selectedCorpusId");

      if (json && json2) {
        const corpuses: Corpus[] = JSON.parse(json);
        const selectedCorpusId: number = +json2;

        const groups = corpuses
          .find((c) => c.id == selectedCorpusId)!
          .collections.find(
            (item) => item.id.toString() === scheduleId
          )!.groups;

        await getWeekSchedulesByGroups(
          groups,
          settingsModel.store.settings.serverAddress
        );

        if (weekScheduleModel.store.weekScheduleListError) setNoData(true);
      } else setNoData(true);
    };

    useEffect(() => {
      getSettings();
      getAuth();

      (async () => {
        await fetchScheduleData();

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        const refreshIntervalMs =
          settingsModel.store.settings.refreshDelay * 60 * 1000;

        intervalRef.current = setInterval(() => {
          fetchScheduleData();
        }, refreshIntervalMs);
      })();

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [settingsModel.store.settings.refreshDelay]);

    return (
      <ScheduleLayout>
        <HeaderSchedule />
        {isLoading || authModel.store.auth === null ? (
          <Spinner className="m-auto" color="default" size="lg" />
        ) : isError ? (
          <div className="flex w-full h-full text-yellow-400 justify-center place-items-center">
            <Icon data={mdiAlert} size={100} />
          </div>
        ) : (
          weekScheduleList.map((item, index) => {
            return <WeekScheduleItem key={index} weekSchedule={item} />;
          })
        )}
      </ScheduleLayout>
    );
  }
);
