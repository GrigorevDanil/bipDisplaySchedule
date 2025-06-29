"use client";

import { Button } from "@heroui/button";
import { Input, useDisclosure, Tooltip } from "@heroui/react";
import { useState } from "react";
import {
  mdiArrowDownBold,
  mdiArrowUpBold,
  mdiPlusThick,
  mdiTrashCan,
} from "@mdi/js";
import clsx from "clsx";

import { Corpus } from "@/entities/corpus";
import { DialogDelete } from "@/features/dialogDelete";
import { Icon } from "@/shared/ui/icon";
import { Collection, collectionModel } from "@/entities/collection";
import { observer } from "mobx-react-lite";

type Props = {
  corpus: Corpus | undefined;
  collection: Collection | undefined;
};

export const CollectionDisplay = observer(({ corpus, collection }: Props) => {
  const {
    store: {
      getCollection,
      addCollection,
      deleteSelectedCollection,
      isCollectionNameExist,
      isMoveSelectedCollectionDown,
      isMoveSelectedCollectionUp,
      moveSelectedCollectionDown,
      moveSelectedCollectionUp,
      updateSelectedCollection,
    },
  } = collectionModel;

  const [isEdit, setEdit] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleEditComplete = () => {
    if (editingTitle.trim() && !isCollectionNameExist(editingTitle)) {
      updateSelectedCollection(editingTitle.trim());
    }
    setEditingTitle("");
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-0 w-full rounded-xl overflow-clip bg-gray-200/50",
        corpus && "mr-4"
      )}
    >
      <DialogDelete
        actionDelete={deleteSelectedCollection}
        isOpen={isOpen}
        title={`Вы точно хотите удалить коллекцию "${collection?.title}"?`}
        onOpenChange={onOpenChange}
      />

      <div className="flex-1 flex items-center px-2 pt-2 relative">
        <div className="absolute left-0 right-0 flex justify-center">
          <p className="text-lg pt-2">Коллекции</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <Tooltip
            closeDelay={0}
            color="primary"
            content="Переместить коллекцию вверх"
          >
            <Button
              color={collection ? "primary" : "default"}
              isDisabled={!isMoveSelectedCollectionUp()}
              isIconOnly={true}
              size="lg"
              startContent={<Icon as={mdiArrowUpBold} />}
              onPress={moveSelectedCollectionUp}
            />
          </Tooltip>
          <Tooltip
            closeDelay={0}
            color="primary"
            content="Переместить коллекцию вниз"
          >
            <Button
              color={collection ? "primary" : "default"}
              isDisabled={!isMoveSelectedCollectionDown()}
              isIconOnly={true}
              size="lg"
              startContent={<Icon as={mdiArrowDownBold} />}
              onPress={moveSelectedCollectionDown}
            />
          </Tooltip>
        </div>
      </div>
      <div
        className="relative flex flex-col gap-0 overflow-y-auto h-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
        }}
      >
        <div className="flex flex-col gap-2 p-4 pb-16">
          {corpus?.collections.map((item) => (
            <div key={item.id}>
              {collection?.id === item.id && isEdit ? (
                <Tooltip
                  closeDelay={0}
                  content="Enter для сохранения"
                  isOpen={true}
                  placement="bottom"
                >
                  <Input
                    autoFocus
                    isRequired
                    className="w-full"
                    classNames={{
                      input: "text-center",
                      inputWrapper:
                        "ring-2 ring-focus ring-offset-2 ring-offset-background",
                    }}
                    isInvalid={isCollectionNameExist(editingTitle)}
                    placeholder="Введите название коллекции"
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        handleEditComplete();
                        setEdit(false);
                      }
                      if (e.key === "Escape") setEdit(false);
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
                    color={collection?.id === item.id ? "primary" : "default"}
                    size="md"
                    onDoubleClick={() => {
                      setEditingTitle("");
                      setEdit(true);
                    }}
                    onPress={() => getCollection(item.id)}
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
            className="opacity-50 hover:opacity-100 m-0 p-0"
            color={corpus ? "success" : "default"}
            isDisabled={!corpus}
            isIconOnly={true}
            size="lg"
            startContent={<Icon as={mdiPlusThick} />}
            onPress={addCollection}
          />
        </Tooltip>

        <Tooltip closeDelay={0} color="danger" content="Удалить коллекцию">
          <Button
            className="opacity-50 hover:opacity-100"
            color={collection ? "danger" : "default"}
            isDisabled={!collection}
            isIconOnly={true}
            size="lg"
            startContent={<Icon as={mdiTrashCan} />}
            onPress={onOpen}
          />
        </Tooltip>
      </div>
    </div>
  );
});
