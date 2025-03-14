"use client";

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from "@heroui/react";
import { Collection } from "@/shared/api/group/model";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icon } from "@/pages/home/ui/icon";
import { mdiPlusThick, mdiTrashCan } from "@mdi/js";

interface CollectionDisplayProps {
  selectedCollectionId: number | null;
  collections: Collection[];
  setSelectedCollectionId: Dispatch<SetStateAction<number | null>>;
  setCollections: Dispatch<SetStateAction<Collection[]>>;
}

export const CollectionDisplay = ({ selectedCollectionId, collections, setSelectedCollectionId, setCollections }: CollectionDisplayProps) => {
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [nameConflict, setNameConflict] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setNameConflict(collections.some(collection => collection.title !== editingCollection && collection.title === newTitle));
  }, [newTitle]);

  const handleDoubleClick = (collection: Collection) => {
    setEditingCollection(collection.title);
    setNewTitle(collection.title);
    setSelectedCollectionId(null);
  };

  const handleEditComplete = (originalTitle: string) => {
    if (newTitle.trim() && !nameConflict) {
      const updatedCollections = collections.map((col) =>
        col.title === originalTitle ? { ...col, title: newTitle.trim() } : col
      );

      setCollections(updatedCollections);
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingCollection(null);
    setNewTitle('');
  };

  const addCollection = () => {
    const id = collections.length + 1;
    let title = "Коллекция";
    let counter = id;

    while (collections.some(col => col.title === `${title} ${counter}`)) {
      counter++;
    }

    title = `${title} ${counter}`;

    setCollections((lastCollection) => [...lastCollection, { id, title, groups: [] }]);
  };

  const deleteCollection = () => {
    if (!selectedCollectionId) return;

    setCollections((lastCollection) => lastCollection.filter(c => c.id !== selectedCollectionId));
    setSelectedCollectionId(null);
  };

  return (
    <div className="flex flex-col gap-0 w-full rounded-xl overflow-clip bg-gray-200/50">
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
                  Вы точно хотите удалить коллекцию "{collections.find(c => c.id === selectedCollectionId)?.title}"?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="danger" onPress={() => { deleteCollection(); onClose(); }}>
                  Удалить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <p className="text-lg text-center pt-2">Коллекции групп</p>

      <div
        className="relative flex flex-col gap-0 overflow-y-auto h-80"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
        }}
      >
        <div className="flex flex-col gap-2 p-4 pb-16">
          {collections.map((item) =>
            <div key={item.id}>
              {editingCollection === item.title ? (
                <Input
                  type="text"
                  value={newTitle}
                  isRequired
                  placeholder="Введите название коллекции"
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
              ) : (
                <Button
                  className="w-full"
                  size="md"
                  color={selectedCollectionId === item.id ? "primary" : "default"}
                  onPress={() =>
                    selectedCollectionId === item.id ? setSelectedCollectionId(null) : setSelectedCollectionId(item.id)
                  }
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  {item.title}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex -mt-14 mb-2 mx-2 justify-between">
        <Button
          size="lg"
          color="success"
          className="opacity-50 hover:opacity-100"
          isIconOnly={true}
          onPress={addCollection}
          startContent={<Icon data={mdiPlusThick}></Icon>}
        />

        <Button
          size="lg"
          color={selectedCollectionId ? 'danger' : 'default'}
          className={"hover:opacity-100 " + (!selectedCollectionId ? 'invisible' : 'opacity-50')}
          isIconOnly={true}
          isDisabled={!selectedCollectionId}
          onPress={onOpen}
          startContent={<Icon data={mdiTrashCan}></Icon>}
        />
      </div>
    </div>
  );
};