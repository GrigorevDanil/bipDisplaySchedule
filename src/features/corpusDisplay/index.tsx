"use client";

import { Button } from "@heroui/button";
import { Input, useDisclosure, Tooltip } from "@heroui/react";
import { useState } from "react";
import { mdiPlusThick, mdiTrashCan } from "@mdi/js";
import clsx from "clsx";

import { DialogDelete } from "@/features/dialogDelete";
import { Icon } from "@/shared/ui/icon";
import { Corpus, corpusModel } from "@/entities/corpus";
import { observer } from "mobx-react-lite";
import { collectionModel } from "@/entities/collection";

type Props = {
  corpus: Corpus | undefined;
  corpusList: Corpus[];
};

export const CorpusDisplay = observer(({ corpus, corpusList }: Props) => {
  const {
    store: {
      getCorpus,
      addCorpus,
      updateSelectedCorpus,
      deleteSelectedCorpus,
      isCorpusNameExist,
    },
  } = corpusModel;

  const {
    store: { getCollection },
  } = collectionModel;

  const [isEdit, setEdit] = useState<boolean>(false);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleEditComplete = () => {
    if (editingTitle.trim() && !isCorpusNameExist(editingTitle)) {
      updateSelectedCorpus(editingTitle.trim());
    }
    setEditingTitle("");
  };

  const handleSelect = (idCorpus: string) => {
    getCorpus(idCorpus);
    if (corpus && corpus?.collections.length > 0) {
      getCollection(corpus?.collections[0].id);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-0 w-full rounded-xl overflow-clip bg-gray-200/50",
        corpus && "mr-4"
      )}
    >
      <DialogDelete
        actionDelete={deleteSelectedCorpus}
        isOpen={isOpen}
        title={`Вы точно хотите удалить корпус "${corpus?.title}"?`}
        onOpenChange={onOpenChange}
      />

      <div className="flex items-center justify-center">
        <p className="text-lg text-center pt-2 ">Корпуса</p>
      </div>
      <div
        className="relative flex flex-col gap-0 overflow-y-auto h-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
        }}
      >
        <div className="flex flex-col gap-2 p-4 pb-16">
          {corpusList.map((item) => (
            <div key={item.id}>
              {corpus?.id === item.id && isEdit ? (
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
                    isInvalid={isCorpusNameExist(editingTitle)}
                    placeholder="Введите название корпуса"
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
                    color={corpus?.id === item.id ? "primary" : "default"}
                    size="md"
                    onDoubleClick={() => {
                      setEditingTitle("");
                      setEdit(true);
                    }}
                    onPress={() => handleSelect(item.id)}
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
        <Tooltip closeDelay={0} color="success" content="Добавить корпус">
          <Button
            className="opacity-50 hover:opacity-100 m-0 p-0"
            color="success"
            isIconOnly={true}
            size="lg"
            startContent={<Icon as={mdiPlusThick} />}
            onPress={addCorpus}
          />
        </Tooltip>

        <Tooltip closeDelay={0} color="danger" content="Удалить корпус">
          <Button
            className="opacity-50 hover:opacity-100"
            color={corpus ? "danger" : "default"}
            isDisabled={!corpus}
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
