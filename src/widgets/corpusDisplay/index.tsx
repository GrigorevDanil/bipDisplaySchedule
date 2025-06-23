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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { mdiPlusThick, mdiTrashCan } from "@mdi/js";

import { Corpus } from "@/shared/api/group/model";
import { Icon } from "@/pages/home/ui/icon";


interface CorpusDisplayProps {
  selectedCorpusId: number | null;
  corpuses: Corpus[];
  setSelectedCorpusId: Dispatch<SetStateAction<number | null>>;
  setCorpuses: Dispatch<SetStateAction<Corpus[]>>;
}

export const CorpusDisplay = ({
  selectedCorpusId,
  corpuses,
  setSelectedCorpusId,
  setCorpuses,
}: CorpusDisplayProps) => {
  const [editingCorpus, setEditingCorpus] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const nameConflict = useMemo(
    () =>
      corpuses.some(
        (corpus) => corpus.title !== editingCorpus && corpus.title === newTitle
      ),
    [newTitle]
  );

  const handleDoubleClick = (corpus: Corpus) => {
    setEditingCorpus(corpus.title);
    setNewTitle(corpus.title);
    setSelectedCorpusId(null);
  };

  const handleEditComplete = (originalTitle: string) => {
    if (newTitle.trim() && !nameConflict) {
      const updatedCorpuses = corpuses.map((cor) =>
        cor.title === originalTitle ? { ...cor, title: newTitle.trim() } : cor
      );

      cancelEdit();
      setCorpuses((lastCorpuses) =>
        lastCorpuses.map((cor) =>
          cor.title === originalTitle ? { ...cor, title: newTitle.trim() } : cor
        )
      );
    }
  };

  const cancelEdit = () => {
    setEditingCorpus(null);
    setNewTitle("");
  };

  const addCorpus = () => {
    let counter = 1;
    let title = "Корпус";

    while (
      corpuses.some(
        (cor) => cor.title === `${title} ${counter}` || cor.id == counter
      )
    )
      counter++;

    title = `${title} ${counter}`;

    setCorpuses((lastCorpuses) => [
      ...lastCorpuses,
      { id: counter, title, collections: [] },
    ]);
  };

  const deleteCorpus = () => {
    if (!selectedCorpusId) return;

    setSelectedCorpusId(null);
    setCorpuses((lastCorpuses) =>
      lastCorpuses.filter((c) => c.id !== selectedCorpusId)
    );
  };

  return (
    <div
      className={`flex flex-col gap-0 w-full rounded-xl overflow-clip bg-gray-200/50 ${selectedCorpusId ? "mr-4" : ""}`}
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
                  Вы точно хотите удалить корпус &quot;
                  {corpuses.find((c) => c.id === selectedCorpusId)?.title}
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
                    deleteCorpus();
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

      <p className="text-lg text-center pt-2">Корпуса</p>

      <div
        className="relative flex flex-col gap-0 overflow-y-auto h-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
        }}
      >
        <div className="flex flex-col gap-2 p-4 pb-16">
          {corpuses.map((item) => (
            <div key={item.id}>
              {editingCorpus === item.title ? (
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
                    placeholder="Введите название корпуса"
                    type="text"
                    value={newTitle}
                    onBlur={cancelEdit}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditComplete(item.title);
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
                    color={selectedCorpusId === item.id ? "primary" : "default"}
                    size="md"
                    onDoubleClick={() => handleDoubleClick(item)}
                    onPress={() =>
                      setSelectedCorpusId(
                        selectedCorpusId === item.id ? null : item.id
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
        <Tooltip closeDelay={0} color="success" content="Добавить корпус">
          <Button
            className="opacity-50 hover:opacity-100 m-0 p-0"
            color="success"
            isIconOnly={true}
            size="lg"
            startContent={<Icon data={mdiPlusThick} />}
            onPress={addCorpus}
          />
        </Tooltip>

        <Tooltip closeDelay={0} color="danger" content="Удалить корпус">
          <Button
            className={
              "hover:opacity-100 " +
              (!selectedCorpusId ? "invisible" : "opacity-50")
            }
            color={selectedCorpusId ? "danger" : "default"}
            isDisabled={!selectedCorpusId}
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
