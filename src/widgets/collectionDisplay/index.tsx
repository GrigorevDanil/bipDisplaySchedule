"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { mdiPlusThick, mdiTrashCan } from "@mdi/js";

import { Collection, Corpus } from "@/shared/api/group/model";
import { Icon } from "@/pages/home/ui/icon";


interface CollectionDisplayProps {
  selectedCollectionId: number | null;
  selectedCorpus: Corpus | null;
  setSelectedCollectionId: Dispatch<SetStateAction<number | null>>;
  setCorpuses: Dispatch<SetStateAction<Corpus[]>>;
}

export const CollectionDisplay = ({
  selectedCollectionId,
  selectedCorpus,
  setSelectedCollectionId,
  setCorpuses,
}: CollectionDisplayProps) => {
  const [editingCollection, setEditingCollection] = useState<string | null>(
    null
  );
  const [newTitle, setNewTitle] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const nameConflict = useMemo(
    () =>
      !selectedCorpus
        ? false
        : selectedCorpus.collections.some(
            (collection) =>
              collection.title !== editingCollection &&
              collection.title === newTitle
          ),
    [newTitle]
  );

  useEffect(() => setSelectedCollectionId(null), [selectedCorpus?.id]);

  const handleDoubleClick = (collection: Collection) => {
    setEditingCollection(collection.title);
    setNewTitle(collection.title);
    setSelectedCollectionId(null);
  };

  const handleEditComplete = () => {
    if (newTitle.trim() && !nameConflict) {
      setCorpuses((lastCorpuses) =>
        lastCorpuses.map((c) =>
          c.id == selectedCorpus!.id
            ? {
                id: c.id,
                title: c.title,
                collections: c.collections.map((col) =>
                  col.title === editingCollection
                    ? { ...col, title: newTitle.trim() }
                    : col
                ),
              }
            : c
        )
      );
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingCollection(null);
    setNewTitle("");
  };

  const addCollection = () => {
    let counter = 1;
    let title = "Коллекция";

    while (
      selectedCorpus!.collections.some(
        (col) => col.title === `${title} ${counter}` || col.id == counter
      )
    )
      counter++;

    title = `${title} ${counter}`;

    setCorpuses((lastCorpuses) =>
      lastCorpuses.map((c) =>
        c.id == selectedCorpus!.id
          ? {
              id: c.id,
              title: c.title,
              collections: [
                ...c.collections,
                { id: counter, title, groups: [] },
              ],
            }
          : c
      )
    );
  };

  const deleteCollection = () => {
    if (!selectedCorpus) return;

    setCorpuses((lastCorpuses) =>
      lastCorpuses.map((c) =>
        c.id == selectedCorpus.id
          ? {
              id: c.id,
              title: c.title,
              collections: c.collections.filter(
                (c) => c.id !== selectedCollectionId
              ),
            }
          : c
      )
    );
    setSelectedCollectionId(null);
  };

  return (
    <div
      className={`flex flex-col transition-all gap-0 rounded-xl overflow-clip bg-gray-200/50 ${selectedCorpus ? "w-full" : "w-0"} ${selectedCollectionId ? "mr-4" : ""}`}
    >
      <Modal
        backdrop="blur"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Подтверждение
              </ModalHeader>
              <ModalBody>
                <p>
                  Вы точно хотите удалить коллекцию &quot;
                  {
                    selectedCorpus!.collections.find(
                      (c) => c.id === selectedCollectionId
                    )?.title
                  }
                  &quot;?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    deleteCollection();
                    onClose();
                  }}
                >
                  Удалить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <p className="text-lg text-center pt-2">Коллекции групп</p>

      <div
        className="relative flex flex-col gap-0 overflow-y-auto h-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
        }}
      >
        <div className="flex flex-col gap-2 p-4 pb-16">
          {!selectedCorpus
            ? null
            : selectedCorpus.collections.map((item) => (
                <div key={item.id}>
                  {editingCollection === item.title ? (
                    <Tooltip
                      closeDelay={0}
                      content="Enter для сохранения"
                      isOpen={true}
                      placement="bottom"
                    >
                      <Input
                        isRequired
                        className="w-full"
                        classNames={{
                          input: "text-center",
                          inputWrapper:
                            "ring-2 ring-focus ring-offset-2 ring-offset-background",
                        }}
                        isInvalid={nameConflict}
                        placeholder="Введите название коллекции"
                        type="text"
                        value={newTitle}
                        onBlur={cancelEdit}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditComplete();
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      closeDelay={0}
                      content="Двойной клик для редактирования названия"
                      offset={-2}
                      placement="top"
                    >
                      <Button
                        className="w-full"
                        color={
                          selectedCollectionId === item.id
                            ? "primary"
                            : "default"
                        }
                        size="md"
                        onDoubleClick={() => handleDoubleClick(item)}
                        onPress={() =>
                          setSelectedCollectionId(
                            selectedCollectionId === item.id ? null : item.id
                          )
                        }
                      >
                        {item.title}
                      </Button>
                    </Tooltip>
                  )}
                </div>
              ))}
        </div>
      </div>

      <div className="flex -mt-14 mb-2 mx-2 justify-between">
        <Tooltip closeDelay={0} color="success" content="Добавить коллекцию">
          <Button
            className="opacity-50 hover:opacity-100"
            color="success"
            isIconOnly={true}
            size="lg"
            startContent={<Icon data={mdiPlusThick} />}
            onPress={addCollection}
          />
        </Tooltip>

        <Tooltip closeDelay={0} color="danger" content="Удалить коллекцию">
          <Button
            className={
              "hover:opacity-100 " +
              (!selectedCorpus || !selectedCollectionId
                ? "invisible"
                : "opacity-50")
            }
            color="danger"
            isDisabled={!selectedCorpus || !selectedCollectionId}
            isIconOnly={true}
            size="lg"
            startContent={<Icon data={mdiTrashCan} />}
            onPress={onOpen}
          />
        </Tooltip>
      </div>
    </div>
  );
};
