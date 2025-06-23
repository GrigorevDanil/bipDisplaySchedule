"use client";

import {
  mdiArrowDownBold,
  mdiArrowUpBold,
  mdiCloseBox,
  mdiCog,
  mdiLibraryShelves,
  mdiRefreshAuto,
} from "@mdi/js";
import { Button } from "@heroui/button";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { Tooltip } from "@heroui/react";

import { Icon } from "./icon";

import { BaseLayout } from "@/shared/ui/baseLayout";
import { GroupDisplay } from "@/widgets/groupDisplay";
import { CollectionDisplay } from "@/widgets/collectionDisplay";
import { Group, Corpus } from "@/shared/api/group/model";
import { groupModel } from "@/entities/group";
import { removeItem, setItem } from "@/shared/lib/storage";
import { SettingsDisplay } from "@/widgets/settingsDisplay";
import { CorpusDisplay } from "@/widgets/corpusDisplay";
import { Authorization } from "@/shared/api/authorization/model";
import { authModel } from "@/entities/authorization";
import { userLogin, userPassword } from "@/shared/api/httpClient";
import { AuthDisplay } from "@/widgets/authDisplay";
import { settingsModel } from "@/entities/settings";
import { Settings } from "@/shared/api/settings/model";

export const HomePage = observer(() => {
  const {
    store: { defaultSettings, getSettings },
  } = settingsModel;

  const {
    store: { getGroupList, getCorpusList, getSelectedCorpusId },
  } = groupModel;

  const {
    store: { getAuth },
  } = authModel;

  const [groups, setGroups] = useState<Group[]>([]);
  const [corpuses, setCorpuses] = useState<Corpus[]>([]);
  const [auth, setAuth] = useState<Authorization | null | undefined>(null);
  const [settings, setSettings] = useState<Settings>(
    settingsModel.store.defaultSettings
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);
  const [selectedCorpusId, setSelectedCorpusId] = useState<number | null>(null);
  const [isOpenedSettings, changeSettingsDisplay] = useState<boolean>(false);
  const [isOpenedAuth, changeAuthDisplay] = useState<boolean>(true);

  const handleOpenScheduleOnDisplays = async () => {
    let screens: Array<{
      left: number;
      top: number;
      width: number;
      height: number;
      isPrimary: boolean;
    }> = [];

    if ("getScreenDetails" in window) {
      try {
        const screenDetails = await (
          window.getScreenDetails as () => Promise<any>
        )();

        screens = screenDetails.screens.filter(
          (screen: any) => !screen.isPrimary
        );
        console.log("Вторичные экраны:", screens);

        if (screens.length === 0) {
          alert("Вторичные экраны не найдены.");

          return;
        }
      } catch (error) {
        console.error("Ошибка Window Management API:", error);
        alert("Не удалось найти вторичные экраны.");

        return;
      }
    } else {
      alert("Требуется поддержка Window Management API (Chrome/Edge).");

      return;
    }

    selectedCorpus!.collections.forEach((collection, index) => {
      const screenIndex = index % screens.length;
      const screen = screens[screenIndex];

      const url = `http://localhost:3000/schedule/${collection.id}`;
      const windowFeatures = `
        left=${screen.left},
        top=${screen.top},
        width=${screen.width},
        height=${screen.height},
        menubar=no,
        toolbar=no,
        location=no,
        status=no
      `;

      window.open(url, `_blank_${collection.id}`, windowFeatures);
    });

    setTimeout(async () => {
      try {
        const response = await fetch("/api/run-ahk", { method: "POST" });
        const result = await response.json();

        if (response.ok) {
          console.log("AHK успешно запущен:", result.message);
        } else {
          console.error("Ошибка API:", result.error);
          alert("Не удалось запустить полноэкранный режим.");
        }
      } catch (error) {
        console.error("Ошибка вызова API:", error);
        alert("Ошибка связи с сервером для запуска полноэкранного режима.");
      }
    }, 1000);
  };

  const handleCloseScheduleOnDisplays = () => {
    if (!selectedCorpus || selectedCorpus.collections.length === 0) return;

    selectedCorpus.collections.forEach((collection) => {
      const windowName = `_blank_${collection.id}`;
      const scheduleWindow = window.open("", windowName);

      if (scheduleWindow) {
        scheduleWindow.close();
      }
    });

    console.log("Все окна расписания закрыты");
  };

  useEffect(() => {
    getSettings();
    setSettings(settingsModel.store.settings);
  }, [getSettings]);

  useEffect(() => setItem("settings", JSON.stringify(settings)), [settings]);

  //#region Groups
  useEffect(() => {
    getGroupList(settings.serverAddress).then(() =>
      setGroups(
        groupModel.store.groupListError ? [] : groupModel.store.groupList
      )
    );
  }, [getGroupList, settings]);
  //#endregion

  //#region Corpuses
  const selectedCorpus = useMemo(
    () => corpuses.find((c) => c.id == selectedCorpusId) ?? null,
    [selectedCorpusId, corpuses]
  );

  useEffect(() => {
    if (selectedCorpusId)
      setItem("selectedCorpusId", selectedCorpusId.toString());
    else removeItem("selectedCorpusId");
  }, [selectedCorpusId]);

  useEffect(() => {
    getCorpusList();
    if (corpuses.length === 0 && groupModel.store.corpusList.length > 0)
      setCorpuses(groupModel.store.corpusList);
  }, [getCorpusList]);

  useEffect(() => {
    getSelectedCorpusId();
    setSelectedCorpusId(groupModel.store.selectedCorpusId);
  }, [getSelectedCorpusId]);

  useEffect(() => setItem("corpuses", JSON.stringify(corpuses)), [corpuses]);
  //#endregion

  //#region Collections
  const selectedCollection = useMemo(
    () =>
      selectedCorpusId && selectedCollectionId
        ? corpuses
            .find((c) => c.id == selectedCorpusId)!
            .collections.find((c) => c.id === selectedCollectionId)!
        : null,
    [selectedCorpusId, selectedCollectionId]
  );

  const moveCollectionUp = () => {
    if (
      !selectedCollectionId ||
      !selectedCorpus ||
      selectedCorpus.collections.length === 0
    )
      return;
    const index = selectedCorpus.collections.findIndex(
      (c) => c.id === selectedCollectionId
    );

    if (index > 0) {
      const newCollections = [...selectedCorpus.collections];

      [newCollections[index - 1], newCollections[index]] = [
        newCollections[index],
        newCollections[index - 1],
      ];
      setCorpuses((lastCorpuses) =>
        lastCorpuses.map((c) =>
          c.id == selectedCorpusId
            ? { id: c.id, title: c.title, collections: newCollections }
            : c
        )
      );
    }
  };

  const moveCollectionDown = () => {
    if (
      !selectedCollectionId ||
      !selectedCorpus ||
      selectedCorpus.collections.length === 0
    )
      return;
    const index = selectedCorpus.collections.findIndex(
      (c) => c.id === selectedCollectionId
    );

    if (index < selectedCorpus.collections.length - 1) {
      const newCollections = [...selectedCorpus.collections];

      [newCollections[index], newCollections[index + 1]] = [
        newCollections[index + 1],
        newCollections[index],
      ];
      setCorpuses((lastCorpuses) =>
        lastCorpuses.map((c) =>
          c.id == selectedCorpusId
            ? { id: c.id, title: c.title, collections: newCollections }
            : c
        )
      );
    }
  };
  //#endregion

  //#region Auth
  useEffect(() => {
    getAuth();
    setAuth(authModel.store.auth);

    if (
      authModel.store.auth &&
      authModel.store.auth.login == userLogin &&
      authModel.store.auth.password == userPassword
    )
      changeAuthDisplay(false);
  }, [getAuth]);

  useEffect(() => setItem("auth", JSON.stringify(auth)), [auth]);
  //#endregion

  const upCheck = useMemo(
    () =>
      !selectedCorpus
        ? false
        : selectedCorpus.collections.findIndex(
            (c) => c.id === selectedCollectionId
          ) <= 0,
    [selectedCollectionId, selectedCorpusId, selectedCorpus?.collections]
  );

  const downCheck = useMemo(
    () =>
      !selectedCorpus
        ? false
        : selectedCorpus.collections.findIndex(
            (c) => c.id === selectedCollectionId
          ) >=
          selectedCorpus.collections.length - 1,
    [selectedCollectionId, selectedCorpusId, selectedCorpus?.collections]
  );

  return (
    <BaseLayout className="items-center justify-center">
      <div className="flex flex-col bg-gray-50 rounded-xl p-8 gap-8">
        <AuthDisplay
          auth={auth}
          changeAuthDisplay={changeAuthDisplay}
          isOpenedAuth={isOpenedAuth}
          setAuth={setAuth}
        />

        {!isOpenedAuth ? (
          <>
            <SettingsDisplay
              changeSettingsDisplay={changeSettingsDisplay}
              defaultSettings={defaultSettings}
              isOpenedSettings={isOpenedSettings}
              setSettings={setSettings}
              settings={settings}
            />

            <div className="flex justify-between place-items-center">
              <p className="text-3xl font-bold">Расписание БиП</p>
              <div className="flex gap-2">
                <Tooltip
                  closeDelay={0}
                  color="primary"
                  content="Переместить коллекцию вверх"
                >
                  <Button
                    color={selectedCollectionId ? "primary" : "default"}
                    isDisabled={!selectedCollectionId || upCheck}
                    isIconOnly={true}
                    size="lg"
                    startContent={<Icon data={mdiArrowUpBold} />}
                    onPress={moveCollectionUp}
                  />
                </Tooltip>
                <Tooltip
                  closeDelay={0}
                  color="primary"
                  content="Переместить коллекцию вниз"
                >
                  <Button
                    color={selectedCollectionId ? "primary" : "default"}
                    isDisabled={!selectedCollectionId || downCheck}
                    isIconOnly={true}
                    size="lg"
                    startContent={<Icon data={mdiArrowDownBold} />}
                    onPress={moveCollectionDown}
                  />
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-row h-[400px]">
              <CorpusDisplay
                corpuses={corpuses}
                selectedCorpusId={selectedCorpusId}
                setCorpuses={setCorpuses}
                setSelectedCorpusId={setSelectedCorpusId}
              />
              <CollectionDisplay
                selectedCollectionId={selectedCollectionId}
                selectedCorpus={selectedCorpus}
                setCorpuses={setCorpuses}
                setSelectedCollectionId={setSelectedCollectionId}
              />
              <GroupDisplay
                groups={groups}
                selectedCollection={selectedCollection}
                selectedCollectionId={selectedCollectionId}
                selectedCorpus={selectedCorpus}
                selectedCorpusId={selectedCorpusId}
                setCorpuses={setCorpuses}
              />
            </div>

            <div className="flex gap-2">
              <Tooltip
                showArrow
                closeDelay={0}
                color="danger"
                content="Выберите корпус, содержащий коллекции групп"
                isDisabled={
                  selectedCorpus != null &&
                  selectedCorpus.collections?.length > 0
                }
              >
                <span>
                  <Button
                    color="primary"
                    isDisabled={
                      !selectedCorpus || selectedCorpus.collections?.length == 0
                    }
                    size="lg"
                    startContent={<Icon data={mdiLibraryShelves} />}
                    onPress={handleOpenScheduleOnDisplays}
                  >
                    Вывести расписание
                  </Button>
                </span>
              </Tooltip>
              <Button
                color="danger"
                size="lg"
                startContent={<Icon data={mdiCloseBox} />}
                onPress={handleCloseScheduleOnDisplays}
              >
                Закрыть расписание
              </Button>
              <Button
                color="success"
                size="lg"
                startContent={<Icon data={mdiRefreshAuto} />}
              >
                Автозапуск
              </Button>
              <Button
                size="lg"
                startContent={<Icon data={mdiCog} />}
                onPress={() => changeSettingsDisplay(true)}
              >
                Настройки
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </BaseLayout>
  );
});
