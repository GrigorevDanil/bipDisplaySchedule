import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

type Props = {
  title: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  actionDelete: () => void;
};

export const DialogDelete = ({
  title,
  isOpen,
  onOpenChange,
  actionDelete,
}: Props) => {
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
              Подтверждение
            </ModalHeader>
            <ModalBody>
              <p>{title}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Отмена
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  actionDelete();
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
  );
};
