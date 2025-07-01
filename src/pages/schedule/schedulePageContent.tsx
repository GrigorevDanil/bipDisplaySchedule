"use client";

import { Spinner } from "@heroui/spinner";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { settingsModel } from "@/entities/settings";
import { scheduleModel } from "@/entities/schedule";
import { HeaderSchedule } from "@/widgets/headerSchedule/index";
import { authModel } from "@/entities/auth";
import { corpusModel } from "@/entities/corpus";
import { collectionModel } from "@/entities/collection";
import { BaseLayout } from "@/shared/ui/baseLayout";
import { WeekScheduleCard } from "@/entities/schedule/ui";

type Props = {
  corpusId: string;
  collectionId: string;
};

export const SchedulePageContent = observer(
  ({ corpusId, collectionId }: Props) => {
    const router = useRouter();
    const {
      store: { isAuth },
    } = authModel;

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const {
      store: { getSettings, settings },
    } = settingsModel;

    const {
      store: { getCorpusList, getCorpus },
    } = corpusModel;

    const {
      store: { getCollection, collection },
    } = collectionModel;

    const {
      store: { isLoading, weekScheduleList, getWeekScheduleByGroups },
    } = scheduleModel;

    useEffect(() => {
      if (!isAuth) {
        router.push("/login");
      }
    }, [isAuth]);

    useEffect(() => {
      const init = async () => {
        getCorpusList();
        getCorpus(corpusId);
        getCollection(collectionId);
      };

      init();
    }, []);

    useEffect(() => {
      const loadSchedule = async () => {
        getSettings();
        if (collection) {
          try {
            await getWeekScheduleByGroups(
              collection.groups,
              settings.serverAddress
            );
          } finally {
            setIsInitialLoad(false);
          }

          const refreshIntervalMs = settings.refreshDelay * 60 * 1000;

          intervalRef.current = setInterval(async () => {
            await getWeekScheduleByGroups(
              collection.groups,
              settings.serverAddress
            );
          }, refreshIntervalMs);
        }
      };

      loadSchedule();

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [collection, settings.serverAddress, settings.refreshDelay]);

    const renderSchedules = () => {
      if (isInitialLoad && isLoading) {
        return <Spinner className="m-auto" color="default" size="lg" />;
      }

      return weekScheduleList.map((item, index) => (
        <WeekScheduleCard key={index} scheduleByGroup={item} />
      ));
    };

    return (
      <BaseLayout className="justify-start gap-2 m-5">
        <HeaderSchedule />
        {renderSchedules()}
      </BaseLayout>
    );
  }
);
