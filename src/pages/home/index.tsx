"use client";

import {
  mdiCloseBox,
  mdiCog,
  mdiLibraryShelves,
  mdiLogout,
  mdiRefresh,
} from "@mdi/js";
import { Button } from "@heroui/button";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Tooltip, addToast, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

import { BaseLayout } from "@/shared/ui/baseLayout";
import { CollectionDisplay } from "@/features/collectionDisplay";
import { CorpusDisplay } from "@/features/corpusDisplay";
import { GroupDisplay } from "@/features/groupDisplay";
import { Icon } from "@/shared/ui/icon";
import { corpusModel } from "@/entities/corpus";
import { DialogSettings } from "@/features/dialogSettings";
import { authModel } from "@/entities/auth";
import { collectionModel } from "@/entities/collection";
import { groupModel } from "@/entities/group";
import { settingsModel } from "@/entities/settings";

export const HomePage = observer(() => {
  const router = useRouter();

  const [isDisplaysOpen, setDisplaysOpen] = useState<boolean>(false);

  const {
    store: { isAuth, logout },
  } = authModel;

  const {
    store: { getSettings, settings },
  } = settingsModel;

  const {
    store: { getCorpusList, corpusList, corpus },
  } = corpusModel;

  const {
    store: { collection },
  } = collectionModel;

  const {
    store: {
      availableGroups,
      getGroupList,
      groupListError,
      isLoading,
      group,
      resetError,
      isError,
    },
  } = groupModel;

  useEffect(() => {
    const init = async () => {
      getSettings();
      getCorpusList();
      await getGroupList(settings.serverAddress);
    };

    init();
  }, []);

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth]);

  useEffect(() => {
    if (isError) {
      addToast({
        title: "Ошибка групп!",
        description: groupListError,
        color: "danger",
      });
      resetError();
    }
  }, [isError]);

  const {
    isOpen: isOpenSettings,
    onOpen: onOpenSettings,
    onClose: onCloseSettings,
  } = useDisclosure();

  const handleOpenScheduleOnDisplays = async () => {
    if (corpus) {
      const screenDetails =
        "getScreenDetails" in window
          ? await (window.getScreenDetails as () => Promise<any>)()
          : null;

      corpus.collections.forEach((collection, index) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/schedule/${corpus.id}/${collection.id}`;

        const windowFeatures = screenDetails?.screens?.[
          index % screenDetails.screens.length
        ]
          ? `left=${screenDetails.screens[index % screenDetails.screens.length].left},` +
            `top=${screenDetails.screens[index % screenDetails.screens.length].top},` +
            `width=${screenDetails.screens[index % screenDetails.screens.length].width},` +
            `height=${screenDetails.screens[index % screenDetails.screens.length].height}`
          : "";

        window.open(url, `_blank_${collection.id}`, windowFeatures);
      });

      setDisplaysOpen(true);
    }
  };

  const handleCloseScheduleOnDisplays = () => {
    if (corpus) {
      corpus.collections.forEach((collection) => {
        const windowName = `_blank_${collection.id}`;
        const scheduleWindow = window.open("", windowName);

        if (scheduleWindow) {
          scheduleWindow.close();
        }
      });

      setDisplaysOpen(false);
    }
  };

  const handleRefreshSchedules = () => {
    if (corpus) {
      corpus.collections.forEach((collection) => {
        const windowName = `_blank_${collection.id}`;

        const scheduleWindow = window.open("", windowName);

        if (scheduleWindow && !scheduleWindow.closed) {
          if (
            scheduleWindow.location.href.includes(`/schedule/${collection.id}`)
          ) {
            scheduleWindow.location.reload();
          } else {
            scheduleWindow.location.href = `${process.env.NEXT_PUBLIC_API_URL}/schedule/${collection.id}`;
          }
        }
      });
    }
  };

  return (
    <BaseLayout className="items-center justify-center">
      <div className="flex flex-col bg-gray-50 rounded-xl p-8 gap-8">
        <p className="text-3xl font-bold">Расписание БиП</p>

        <DialogSettings
          isOpen={isOpenSettings}
          onClose={onCloseSettings}
          onOpen={onOpenSettings}
        />

        <div className="flex flex-row gap-2 h-[400px]">
          <CorpusDisplay corpus={corpus} corpusList={corpusList} />
          <CollectionDisplay collection={collection} corpus={corpus} />
          <GroupDisplay
            availableGroups={availableGroups}
            collection={collection}
            group={group}
            isLoading={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <Tooltip
            showArrow
            closeDelay={0}
            color="danger"
            content="Выберите корпус, содержащий коллекции групп"
            isDisabled={!corpus}
          >
            <span>
              <Button
                color="primary"
                isDisabled={!corpus}
                size="lg"
                startContent={<Icon as={mdiLibraryShelves} />}
                onPress={handleOpenScheduleOnDisplays}
              >
                Вывести расписание
              </Button>
            </span>
          </Tooltip>
          <Button
            color="danger"
            isDisabled={!isDisplaysOpen}
            size="lg"
            startContent={<Icon as={mdiCloseBox} />}
            onPress={handleCloseScheduleOnDisplays}
          >
            Закрыть расписание
          </Button>
          <Button
            color="success"
            size="lg"
            startContent={<Icon as={mdiRefresh} />}
            onPress={handleRefreshSchedules}
          >
            Обновить расписание
          </Button>
          <Button
            size="lg"
            startContent={<Icon as={mdiCog} />}
            onPress={onOpenSettings}
          >
            Настройки
          </Button>
          <Button
            color="danger"
            size="lg"
            startContent={<Icon as={mdiLogout} />}
            onPress={logout}
          />
        </div>
      </div>
    </BaseLayout>
  );
});
