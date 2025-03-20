"use client";

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, Tooltip } from "@heroui/react";
import { Corpus } from "@/shared/api/group/model";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Icon } from "@/pages/home/ui/icon";
import { mdiPlusThick, mdiTrashCan } from "@mdi/js";

interface CorpusDisplayProps {
  selectedCorpusId: number | null;
  corpuses: Corpus[];
  setSelectedCorpusId: Dispatch<SetStateAction<number | null>>;
  setCorpuses: Dispatch<SetStateAction<Corpus[]>>;
}

export const CorpusDisplay = ({ selectedCorpusId, corpuses, setSelectedCorpusId, setCorpuses }: CorpusDisplayProps) => {
  const [editingCorpus, setEditingCorpus] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const nameConflict = useMemo(
    () => corpuses.some(corpus => corpus.title !== editingCorpus && corpus.title === newTitle),
    [newTitle]
  );

  const handleDoubleClick = (corpus: Corpus) => {
    setEditingCorpus(corpus.title);
    setNewTitle(corpus.title);
    setSelectedCorpusId(null);
  };

  const handleEditComplete = (originalTitle: string) => {
    if (newTitle.trim() && !nameConflict) {
      const updatedCorpuses = corpuses.map(cor =>
        cor.title === originalTitle ? { ...cor, title: newTitle.trim() } : cor
      );

      cancelEdit();
      setCorpuses(lastCorpuses => lastCorpuses.map(cor =>
        cor.title === originalTitle ? { ...cor, title: newTitle.trim() } : cor
      ));
    }
  };

  const cancelEdit = () => {
    setEditingCorpus(null);
    setNewTitle('');
  };

  const addCorpus = () => {
    let counter = 1;
    let title = "Корпус";

    while (corpuses.some(cor => cor.title === `${title} ${counter}` || cor.id == counter))
      counter++;

    title = `${title} ${counter}`;

    setCorpuses(lastCorpuses => [...lastCorpuses, { id: counter, title, collections: [] }]);
  };

  const deleteCorpus = () => {
    if (!selectedCorpusId) return;

    setSelectedCorpusId(null);
    setCorpuses(lastCorpuses => lastCorpuses.filter(c => c.id !== selectedCorpusId));
  };

  return (
    <div className={`flex flex-col gap-0 w-full rounded-xl overflow-clip bg-gray-200/50 ${selectedCorpusId ? "mr-4" : ""}`}>
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
              <ModalHeader className="flex flex-col gap-1">Подтверждение</ModalHeader>
              <ModalBody>
                <p>
                  Вы точно хотите удалить корпус "{corpuses.find(c => c.id === selectedCorpusId)?.title}"?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="danger" onPress={() => { deleteCorpus(); onClose(); }}>
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
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
        }}
      >
        <div className="flex flex-col gap-2 p-4 pb-16">
          {corpuses.map(item =>
            <div key={item.id}>
              {editingCorpus === item.title ? (
                <Tooltip content="Enter для сохранения" closeDelay={0} placement="bottom" isOpen={true}>
                  <Input
                    type="text"
                    value={newTitle}
                    isRequired
                    placeholder="Введите название корпуса"
                    isInvalid={nameConflict}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={cancelEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditComplete(item.title);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="w-full"
                    classNames={{
                      input: 'text-center',
                      inputWrapper: 'ring-2 ring-focus ring-offset-2 ring-offset-background'
                    }}
                    autoFocus
                  />
                </Tooltip>
              ) : (
                <Tooltip content="Двойной клик для редактирования названия" closeDelay={0} placement="top" offset={-2}>
                  <Button
                    className="w-full"
                    size="md"
                    color={selectedCorpusId === item.id ? "primary" : "default"}
                    onPress={() =>
                      setSelectedCorpusId(selectedCorpusId === item.id ? null : item.id)
                    }
                    onDoubleClick={() => handleDoubleClick(item)}
                  >
                    {item.title}
                  </Button>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex -mt-14 mb-2 mx-2 justify-between">
        <Tooltip color='success' content="Добавить корпус" closeDelay={0}>
          <Button
            size="lg"
            color="success"
            className="opacity-50 hover:opacity-100 m-0 p-0"
            isIconOnly={true}
            onPress={addCorpus}
            startContent={<Icon data={mdiPlusThick}></Icon>}
          />
        </Tooltip>

        <Tooltip color='danger' content="Удалить корпус" closeDelay={0}>
          <Button
            size="lg"
            color={selectedCorpusId ? 'danger' : 'default'}
            className={"hover:opacity-100 " + (!selectedCorpusId ? 'invisible' : 'opacity-50')}
            isIconOnly={true}
            isDisabled={!selectedCorpusId}
            onPress={onOpen}
            startContent={<Icon data={mdiTrashCan}></Icon>}
          />
        </Tooltip>
      </div>
    </div>
  );
};