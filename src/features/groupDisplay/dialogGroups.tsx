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
import { observer } from "mobx-react-lite";

import { GroupCard } from "@/entities/group/ui";
import { groupModel } from "@/entities/group";

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
};

export const DialogGroups = observer(
  ({ isOpen, onOpenChange, onClose }: Props) => {
    const {
      store: {
        selectGroup,
        addGroups,
        resetGroupSelection,
        availableGroups,
        isLoading,
      },
    } = groupModel;

    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredGroups = availableGroups.filter((group) => {
      const groupTitle = group.title.toLowerCase();
      const searchChars = searchQuery.toLowerCase().split("");

      return searchChars.every((char) => groupTitle.includes(char));
    });

    const selectedCount = availableGroups.filter((x) => x.isSelected).length;

    const renderGroups = () => {
      if (isLoading)
        return <Spinner className="m-auto" color="default" size="lg" />;
      else if (filteredGroups.length === 0)
        return <p className="text-center text-gray-500">Группы не найдены</p>;
      else
        return filteredGroups.map((filterGroup) => (
          <GroupCard
            key={filterGroup.title}
            action={selectGroup}
            group={filterGroup}
          />
        ));
    };

    const handleClose = () => {
      resetGroupSelection();
      setSearchQuery("");
      onClose();
    };

    const handleComplete = () => {
      addGroups();
      resetGroupSelection();
      setSearchQuery("");
      onClose();
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
          <ModalHeader className="flex flex-col gap-1">
            Выбор группы
          </ModalHeader>
          <ModalBody className="max-h-[700px] overflow-y-auto">
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
              <div className="flex flex-col gap-5 p-4">{renderGroups()}</div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={handleClose}>
              Отмена
            </Button>
            <Button
              color="success"
              isDisabled={selectedCount === 0}
              onPress={handleComplete}
            >
              Добавить ({selectedCount})
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);
