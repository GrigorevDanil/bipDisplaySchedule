"use client";

import { BaseLayout } from "@/shared/ui/baseLayout";
import { GroupDisplay } from "@/widgets/groupDisplay";
import { CollectionDisplay } from "@/widgets/collectionDisplay";
import { mdiArrowDownBold, mdiArrowUpBold, mdiCog, mdiLibraryShelves, mdiRefreshAuto, mdiSelection } from '@mdi/js';
import { Button } from "@heroui/button";
import { Group, Collection } from "@/shared/api/group/model";
import { observer } from "mobx-react-lite";
import { Icon } from "./icon";
import { useEffect, useState } from "react";
import { groupModel } from "@/entities/group";
import { setItem } from "@/shared/lib/storage";
import { Tooltip } from "@heroui/react";
import { SettingsDisplay } from "@/widgets/settingsDisplay";

export const HomePage = observer(() => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [upCheck, setUpCheck] = useState<boolean>(false);
  const [downCheck, setDownCheck] = useState<boolean>(false);
  const [isOpenedSettings, changeSettingsDisplay] = useState<boolean>(false);

  const selectedCollection = collections.find(c => c.id === selectedCollectionId) || null;

  const {
    store: { getCollectionList, getGroupList },
  } = groupModel;

  const checkArrows = () => {
    setUpCheck(collections.findIndex(c => c.id === selectedCollection?.id) <= 0);
    setDownCheck(collections.findIndex(c => c.id === selectedCollection?.id) >= collections.length - 1);
  };

  useEffect(() => checkArrows(), [selectedCollection]);
  useEffect(() => checkArrows(), [collections]);

  useEffect(() => {
    getCollectionList();
    if (collections.length === 0 && groupModel.store.collectionList.length > 0)
      setCollections(groupModel.store.collectionList);
  }, [getCollectionList]);

  useEffect(() => {
    getGroupList().then(() => {
      if (groups.length === 0 && groupModel.store.groupList.length > 0)
        setGroups(groupModel.store.groupList);
    });
  }, [getGroupList]);

  useEffect(() => setItem('collections', JSON.stringify(collections)), [collections]);

  const moveCollectionUp = () => {
    if (!selectedCollection || collections.length === 0) return;
    const index = collections.findIndex(c => c.id === selectedCollection.id);
    if (index > 0) {
      const newCollections = [...collections];
      [newCollections[index - 1], newCollections[index]] = [newCollections[index], newCollections[index - 1]];
      setCollections(newCollections);
    }
  };

  const moveCollectionDown = () => {
    if (!selectedCollection || collections.length === 0) return;
    const index = collections.findIndex(c => c.id === selectedCollection.id);
    if (index < collections.length - 1) {
      const newCollections = [...collections];
      [newCollections[index], newCollections[index + 1]] = [newCollections[index + 1], newCollections[index]];
      setCollections(newCollections);
    }
  };

  const unselectCollection = () => {
    setSelectedCollectionId(null);
  };

  return (
    <BaseLayout className="items-center justify-center">
      <div className="flex flex-col bg-gray-50 rounded-xl p-8 gap-8">
        <SettingsDisplay isOpenedSettings={isOpenedSettings} changeSettingsDisplay={changeSettingsDisplay} />

        <div className="flex justify-between place-items-center">
          <p className="text-3xl font-bold">Расписание БиП</p>
          <div className="flex gap-2">
            <Tooltip color='primary' content="Переместить коллекцию вверх" closeDelay={0}>
              <Button
                size="lg"
                color={selectedCollection ? 'primary' : 'default'}
                isIconOnly={true}
                isDisabled={!selectedCollection || upCheck}
                onPress={moveCollectionUp}
                startContent={<Icon data={mdiArrowUpBold}></Icon>}
              />
            </Tooltip>
            <Tooltip color='primary' content="Переместить коллекцию вниз" closeDelay={0}>
              <Button
                size="lg"
                color={selectedCollection ? 'primary' : 'default'}
                isIconOnly={true}
                isDisabled={!selectedCollection || downCheck}
                onPress={moveCollectionDown}
                startContent={<Icon data={mdiArrowDownBold}></Icon>}
              />
            </Tooltip>
            <Tooltip color='warning' content="Снять выделение" closeDelay={0}>
              <Button
                size="lg"
                color={selectedCollection ? 'warning' : 'default'}
                variant="ghost"
                isIconOnly={true}
                isDisabled={!selectedCollection}
                onPress={unselectCollection}
                startContent={<Icon data={mdiSelection}></Icon>}
              />
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <CollectionDisplay
            selectedCollectionId={selectedCollectionId}
            collections={collections}
            setSelectedCollectionId={setSelectedCollectionId}
            setCollections={setCollections}
          />
          <GroupDisplay
            selectedCollection={selectedCollection}
            setCollections={setCollections}
            groups={groups}
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="lg"
            color="primary"
            startContent={<Icon data={mdiLibraryShelves}></Icon>}
          >
            Вывести расписание
          </Button>
          <Button
            size="lg"
            color="success"
            startContent={<Icon data={mdiRefreshAuto}></Icon>}
          >
            Автозапуск
          </Button>
          <Button
            size="lg"
            startContent={<Icon data={mdiCog}></Icon>}
            onPress={() => changeSettingsDisplay(true)}
          >
            Настройки
          </Button>
        </div>
      </div>
    </BaseLayout >
  );
});