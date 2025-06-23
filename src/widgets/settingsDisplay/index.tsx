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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  mdiCog,
  mdiMenuDown,
  mdiMenuUp,
  mdiMinusThick,
  mdiPlusThick,
} from "@mdi/js";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { Settings } from "@/shared/api/settings/model";
import { Icon } from "@/pages/home/ui/icon";

interface SettingsDisplayProps {
  isOpenedSettings: boolean;
  settings: Settings;
  defaultSettings: Settings;
  changeSettingsDisplay: Dispatch<SetStateAction<boolean>>;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

export const SettingsDisplay = ({
  isOpenedSettings,
  settings,
  defaultSettings,
  changeSettingsDisplay,
  setSettings,
}: SettingsDisplayProps) => {
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [settingsData, setSettingsData] = useState<Settings>(settings);

  const selectedCorpusString = useMemo(
    () =>
      settingsData.selectedCorpus == 1 ? "Первый корпус" : "Второй корпус",
    [settingsData.selectedCorpus]
  );

  const increaseDisabled = useMemo(
    () => settingsData.refreshDelay == 60,
    [settingsData.refreshDelay]
  );

  const decreaseDisabled = useMemo(
    () => settingsData.refreshDelay == 5,
    [settingsData.refreshDelay]
  );

  const saveSettings = () => {
    setSettings(settingsData);
    changeSettingsDisplay(false);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setSettingsData(defaultSettings);
  };

  return (
    <div className="flex flex-col gap-0 -mt-8 w-full rounded-xl overflow-clip bg-gray-200/50">
      <Modal
        backdrop="blur"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpenedSettings}
        onOpenChange={(isOpen) => changeSettingsDisplay(isOpen)}
      >
        <ModalContent>
          <ModalHeader className="gap-1 place-items-center">
            <Icon data={mdiCog} /> Окно настроек
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4 w-full h-full">
              <div className="flex place-items-center">
                <p className="w-full">Выбор групп корпуса</p>

                <Dropdown onOpenChange={setDropDownOpen}>
                  <DropdownTrigger>
                    <Button
                      className="w-full"
                      color="primary"
                      endContent={
                        <Icon data={dropDownOpen ? mdiMenuUp : mdiMenuDown} />
                      }
                      variant="bordered"
                    >
                      {selectedCorpusString}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Single selection example"
                    disabledKeys={[selectedCorpusString]}
                    selectedKeys={[selectedCorpusString]}
                    selectionMode="single"
                    variant="solid"
                    onSelectionChange={(keys) =>
                      setSettingsData((data) => ({
                        ...data,
                        selectedCorpus:
                          keys.anchorKey == "Первый корпус" ? 1 : 2,
                      }))
                    }
                  >
                    <DropdownItem key={"Первый корпус"}>
                      Первый корпус
                    </DropdownItem>
                    <DropdownItem key={"Второй корпус"}>
                      Второй корпус
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              <Input
                isRequired
                isInvalid={settingsData.serverAddress.length == 0}
                label="Адрес сервера"
                placeholder="Введите адрес сервера.."
                type="text"
                value={settingsData.serverAddress}
                onChange={(e) =>
                  setSettingsData((data) => ({
                    ...data,
                    serverAddress: e.target.value.trim(),
                  }))
                }
              />

              <Input
                isRequired
                isInvalid={settingsData.autoHotkeyPath.length == 0}
                label="Путь к AutoHotkey"
                placeholder="Введите путь к AutoHotkey.exe"
                type="text"
                value={settingsData.autoHotkeyPath}
                onChange={(e) =>
                  setSettingsData((data) => ({
                    ...data,
                    autoHotkeyPath: e.target.value.trim(),
                  }))
                }
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
                    isDisabled={decreaseDisabled}
                    isIconOnly={true}
                    size="lg"
                    startContent={<Icon data={mdiMinusThick} />}
                    onPress={() =>
                      setSettingsData((data) => ({
                        ...data,
                        refreshDelay: data.refreshDelay - 5,
                      }))
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
                    {settingsData.refreshDelay}
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
                    isDisabled={increaseDisabled}
                    isIconOnly={true}
                    size="lg"
                    startContent={<Icon data={mdiPlusThick} />}
                    onPress={() =>
                      setSettingsData((data) => ({
                        ...data,
                        refreshDelay: data.refreshDelay + 5,
                      }))
                    }
                  />
                </Tooltip>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="light"
              onPress={() => changeSettingsDisplay(false)}
            >
              Отмена
            </Button>
            <Button
              color="primary"
              isDisabled={
                settingsData.serverAddress == defaultSettings.serverAddress &&
                settingsData.refreshDelay == defaultSettings.refreshDelay &&
                settingsData.autoHotkeyPath == defaultSettings.autoHotkeyPath &&
                settingsData.selectedCorpus == defaultSettings.selectedCorpus
              }
              onPress={resetSettings}
            >
              Сброс
            </Button>
            <Button
              color="success"
              isDisabled={
                settingsData.serverAddress.length == 0 ||
                settingsData.autoHotkeyPath.length == 0
              }
              onPress={saveSettings}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
