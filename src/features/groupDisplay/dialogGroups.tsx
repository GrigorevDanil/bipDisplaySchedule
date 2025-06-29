"use client";

import { Button } from "@heroui/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useState } from "react";

import { Group } from "@/shared/api/group/type";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  availableGroups: Group[];
  group?: Group;
  getGroup: (title: string) => void;
  actionAdd: (group: Group) => void;
  isLoading: boolean;
};

export const DialogGroups = ({
  isOpen,
  onOpenChange,
  availableGroups,
  group,
  getGroup,
  actionAdd,
  isLoading,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredGroups = availableGroups.filter((group) => {
    const groupTitle = group.title.toLowerCase();
    const searchChars = searchQuery.toLowerCase().split("");

    return searchChars.every((char) => groupTitle.includes(char));
  });

  const renderGroups = () => {
    if (isLoading)
      return <Spinner className="m-auto" color="default" size="lg" />;
    else if (filteredGroups.length === 0)
      return <p className="text-center text-gray-500">Группы не найдены</p>;
    else
      return filteredGroups.map((filterGroup) => (
        <div key={filterGroup.title}>
          <Button
            className="w-full"
            color={group?.title === filterGroup.title ? "primary" : "default"}
            size="md"
            onPress={() => getGroup(filterGroup.title)}
          >
            {filterGroup.title}
          </Button>
        </div>
      ));
  };

  return (
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
              Выбор группы
            </ModalHeader>
            <ModalBody className="max-h-80 overflow-y-auto">
              <Input
                className="mb-4"
                placeholder="Поиск групп..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div
                className="relative flex flex-col gap-0 overflow-y-auto"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
                }}
              >
                <div className="flex flex-col gap-2 p-4">{renderGroups()}</div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onPress={() => {
                  setSearchQuery("");
                  onClose();
                }}
              >
                Отмена
              </Button>
              <Button
                color="success"
                isDisabled={!group}
                onPress={() => {
                  group && actionAdd(group);
                  setSearchQuery("");
                  onClose();
                }}
              >
                Добавить
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
