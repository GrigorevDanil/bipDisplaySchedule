"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Tooltip,
} from "@heroui/react";
import { mdiCog, mdiMinusThick, mdiPlusThick } from "@mdi/js";
import { useEffect, useState } from "react";

import { Icon } from "@/shared/ui/icon";
import { settingsModel } from "@/entities/settings";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const DialogSettings = ({ isOpen, onOpen, onClose }: Props) => {
  const {
    store: { settings, getSettings, saveSettings, resetSettings },
  } = settingsModel;

  const [serverAddress, setServerAddress] = useState<string>(
    settings.serverAddress
  );

  const [refreshDelay, setRefreshDelay] = useState<number>(
    settings.refreshDelay
  );

  useEffect(() => {
    const init = async () => {
      await getSettings();
    };

    init();
  }, []);

  const isDisableSave = () =>
    serverAddress == settings.serverAddress &&
    refreshDelay == settings.refreshDelay;

  const handleEditComplete = () => {
    saveSettings({ serverAddress: serverAddress, refreshDelay: refreshDelay });
    onClose();
  };

  const handleResetSettings = () => {
    resetSettings();
    setServerAddress(settings.serverAddress);
    setRefreshDelay(settings.refreshDelay);
  };

  return (
    <div className="flex flex-col gap-0 -mt-8 w-full rounded-xl overflow-clip bg-gray-200/50">
      <Modal
        backdrop="blur"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpen}
      >
        <ModalContent>
          <ModalHeader className="gap-1 place-items-center">
            <Icon as={mdiCog} /> Окно настроек
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4 w-full h-full">
              <Input
                isRequired
                isInvalid={serverAddress.length == 0}
                label="Адрес сервера"
                placeholder="Введите адрес сервера.."
                type="text"
                value={serverAddress}
                onChange={(e) => setServerAddress(e.target.value)}
              />

              <p className="text-center">Интервал обновления данных</p>

              <div className="flex flex-row justify-between">
                <Tooltip
                  closeDelay={0}
                  color="danger"
                  content="Уменьшить интервал"
                >
                  <Button
                    color="danger"
                    isDisabled={refreshDelay === 5}
                    isIconOnly={true}
                    size="lg"
                    startContent={<Icon as={mdiMinusThick} />}
                    onPress={() =>
                      setRefreshDelay(
                        (lastRefreshDelay) => lastRefreshDelay - 5
                      )
                    }
                  />
                </Tooltip>

                <Tooltip
                  closeDelay={0}
                  color="foreground"
                  content="Интервал представлен в минутах"
                  showArrow={true}
                >
                  <p className="text-3xl font-bold self-center">
                    {refreshDelay}
                    <span className="text-xl font-light"> мин.</span>
                  </p>
                </Tooltip>

                <Tooltip
                  closeDelay={0}
                  color="success"
                  content="Увеличить интервал"
                >
                  <Button
                    color="success"
                    isDisabled={refreshDelay === 60}
                    isIconOnly={true}
                    size="lg"
                    startContent={<Icon as={mdiPlusThick} />}
                    onPress={() =>
                      setRefreshDelay(
                        (lastRefreshDelay) => lastRefreshDelay + 5
                      )
                    }
                  />
                </Tooltip>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={onClose}>
              Отмена
            </Button>
            <Button color="primary" onPress={handleResetSettings}>
              Сброс
            </Button>
            <Button
              color="success"
              isDisabled={isDisableSave()}
              onPress={handleEditComplete}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
