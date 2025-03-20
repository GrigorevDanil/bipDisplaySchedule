"use client";

import { Button } from "@heroui/button";
import { Collection, Corpus, Group } from "@/shared/api/group/model";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, Tooltip } from "@heroui/react";
import { Icon } from "@/pages/home/ui/icon";
import { mdiPlusThick, mdiTrashCan } from "@mdi/js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { settingsModel } from "@/entities/settings";

interface GroupDisplayProps {
  selectedCollection: Collection | null;
  selectedCollectionId: number | null;
  selectedCorpusId: number | null;
  groups: Group[];
  selectedCorpus: Corpus | null;
  setCorpuses: Dispatch<SetStateAction<Corpus[]>>;
}

export const GroupDisplay = ({ selectedCollection, selectedCollectionId, selectedCorpusId, groups, selectedCorpus, setCorpuses }: GroupDisplayProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedGroup, selectGroup] = useState<Group | null>(null);
  const [groupToAdd, setGroupToAdd] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    store: { getSettings },
  } = settingsModel;

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  useEffect(() => selectGroup(null), [selectedCollectionId, selectedCorpusId]);

  const addGroup = () => {
    if (!selectedCorpusId || !selectedCollection) return;

    setCorpuses(lastCorpuses => lastCorpuses.map(c =>
      c.id == selectedCorpusId ? {
        id: c.id,
        title: c.title,
        collections: c.collections.map(col => col.id == selectedCollection.id ? {
          id: col.id,
          title: col.title,
          groups: [...col.groups, groupToAdd!]
        } : col)
      } : c
    ));

    setGroupToAdd(null);
    setSearchQuery("");
  };

  const removeGroup = () => {
    if (!selectedCorpusId || !selectedCollection) return;

    setCorpuses(lastCorpuses => lastCorpuses.map(c =>
      c.id == selectedCorpusId ? {
        id: c.id,
        title: c.title,
        collections: c.collections.map(col => col.id == selectedCollection.id ? {
          id: col.id,
          title: col.title,
          groups: col.groups.filter(g => g.title != selectedGroup?.title)
        } : col)
      } : c
    ));

    selectGroup(null);
  };

  const filteredGroups = groups
    .filter(g => !selectedCollection || !selectedCollection.groups.some(gr => gr.title === g.title)) // исключение уже добавленных групп
    .filter(g => {
      if (searchQuery.trim().length === 0) return true;

      // удаление специальных символов (например, дефис) и преобразование к нижнему регистру
      const cleanGroupTitle = g.title.toLowerCase().replace(/[^a-zа-я0-9]/g, '');
      const cleanSearchQuery = searchQuery.toLowerCase().trim().replace(/[^a-zа-я0-9]/g, '');

      return cleanGroupTitle.includes(cleanSearchQuery);
    });

  return (
    <div className={`flex flex-col transition-all gap-0 rounded-xl overflow-clip bg-gray-200/50 ${selectedCollection && selectedCorpusId ? "w-full" : "w-0"}`}>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        backdrop='blur'
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Выбор группы</ModalHeader>
              <ModalBody className="max-h-80 overflow-y-auto">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск групп..."
                  className="mb-4"
                  autoFocus
                />
                <div
                  className="relative flex flex-col gap-0 overflow-y-auto"
                  style={{
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
                  }}
                >
                  <div className="flex flex-col gap-2 p-4">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map(group => (
                        <div key={group.title}>
                          <Button
                            className="w-full"
                            size="md"
                            color={groupToAdd?.title === group.title ? "primary" : "default"}
                            onPress={() => groupToAdd?.title === group.title ? setGroupToAdd(null) : setGroupToAdd(group)}
                          >
                            {group.title}
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">Группы не найдены</p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={onClose}
                >
                  Отмена
                </Button>
                <Button
                  color="success"
                  isDisabled={!groupToAdd}
                  onPress={() => { addGroup(); onClose(); }}
                >
                  Добавить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <p className="text-lg text-center pt-2">Группы</p>
      <div className="relative flex flex-col gap-0 overflow-y-auto h-full"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)"
        }}>
        <div
          className="flex flex-col gap-2 p-4 pb-16"
        >
          {
            selectedCorpus == null || selectedCollection == null ? null :
              selectedCorpus.collections.find(c => c.id == selectedCollectionId)!.groups.map(group =>
                <div key={group.title}>
                  <Button
                    className="w-full"
                    size="md"
                    color={selectedGroup?.title === group.title ? "primary" : "default"}
                    onPress={() => selectedGroup?.title === group.title ? selectGroup(null) : selectGroup(group)}
                  >
                    {group.title}
                  </Button>
                </div>
              )
          }
        </div>
      </div>

      <div className="flex -mt-14 mb-2 mx-2 justify-between">
        <Tooltip color='success' content="Добавить группу" closeDelay={0}>
          <Button
            size="lg"
            color="success"
            className="opacity-50 hover:opacity-100"
            isIconOnly={true}
            onPress={onOpen}
            startContent={<Icon data={mdiPlusThick}></Icon>}
          />
        </Tooltip>

        <Tooltip color='danger' content="Удалить группу" closeDelay={0}>
          <Button
            size="lg"
            color="danger"
            className={"hover:opacity-100 " + (!selectedCorpusId || !selectedGroup ? 'invisible' : 'opacity-50')}
            isIconOnly={true}
            isDisabled={!selectedCorpusId || !selectedGroup}
            onPress={removeGroup}
            startContent={<Icon data={mdiTrashCan}></Icon>}
          />
        </Tooltip>
      </div>
    </div>
  );
};