"use client";

import { settingsModel } from "@/entities/settings";
import { Icon } from "@/pages/home/ui/icon";
import { Settings } from "@/shared/api/settings/model";
import { setItem } from "@/shared/lib/storage";
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
import { mdiCog, mdiMenuDown, mdiMenuUp, mdiMinusThick, mdiPlusThick } from "@mdi/js";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

interface SettingsDisplayProps {
  isOpenedSettings: boolean;
  changeSettingsDisplay: Dispatch<SetStateAction<boolean>>;
}

export const SettingsDisplay = ({
  isOpenedSettings,
  changeSettingsDisplay,
}: SettingsDisplayProps) => {
  const {
    store: { getSettings, defaultSettings },
  } = settingsModel;

  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [settingsData, setSettingsData] = useState<Settings>(settingsModel.store.settings);

  const selectedCorpusString = useMemo(
    () => settingsData.selectedCorpus == 1 ? "Первый корпус" : "Второй корпус",
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

  useEffect(() => {
    getSettings();
    setSettingsData(settingsModel.store.settings);
  }, [getSettings]);

  const saveSettings = () => {
    setItem("settings", JSON.stringify(settingsData));
    changeSettingsDisplay(false);
  };

  const resetSettings = () => {
    setSettingsData(defaultSettings);
    setItem("settings", JSON.stringify(defaultSettings));
  };

  return (
    <div className="flex flex-col gap-0 -mt-8 w-full rounded-xl overflow-clip bg-gray-200/50">
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpenedSettings}
        onOpenChange={(isOpen) => changeSettingsDisplay(isOpen)}
        backdrop="blur"
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
                    <Button color="primary" endContent={<Icon data={dropDownOpen ? mdiMenuUp : mdiMenuDown} />} className="w-full" variant="bordered">
                      {selectedCorpusString}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disabledKeys={[selectedCorpusString]}
                    disallowEmptySelection
                    aria-label="Single selection example"
                    selectedKeys={[selectedCorpusString]}
                    selectionMode="single"
                    variant="solid"
                    onSelectionChange={keys => setSettingsData(data => ({ ...data, selectedCorpus: keys.anchorKey == "Первый корпус" ? 1 : 2 }))}
                  >
                    <DropdownItem key={'Первый корпус'}>Первый корпус</DropdownItem>
                    <DropdownItem key={'Второй корпус'}>Второй корпус</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              <Input
                type="text"
                label="Адрес сервера"
                isRequired
                isInvalid={settingsData.serverAddress.length == 0}
                value={settingsData.serverAddress}
                onChange={(e) => setSettingsData(data => ({ ...data, serverAddress: e.target.value.trim() }))}
                placeholder="Введите адрес сервера.."
                autoFocus
              />

              <Input
                type="text"
                label="Путь к AutoHotkey"
                isRequired
                isInvalid={settingsData.autoHotkeyPath.length == 0}
                value={settingsData.autoHotkeyPath}
                onChange={(e) => setSettingsData(data => ({ ...data, autoHotkeyPath: e.target.value.trim() }))}
                placeholder="Введите путь к AutoHotkey.exe"
              />

              <p className="text-center">Интервал обновления данных</p>

              <div className="flex flex-row justify-between">
                <Tooltip
                  color="danger"
                  content="Уменьшить интервал"
                  closeDelay={0}
                >
                  <Button
                    size="lg"
                    color="danger"
                    isIconOnly={true}
                    isDisabled={decreaseDisabled}
                    onPress={() => setSettingsData(data => ({ ...data, refreshDelay: data.refreshDelay - 5 }))}
                    startContent={<Icon data={mdiMinusThick}></Icon>}
                  />
                </Tooltip>

                <Tooltip
                  color="foreground"
                  showArrow={true}
                  content="Интервал представлен в минутах"
                  closeDelay={0}
                >
                  <p className="text-3xl font-bold self-center">
                    {settingsData.refreshDelay}
                    <span className="text-xl font-light"> мин.</span>
                  </p>
                </Tooltip>

                <Tooltip
                  color="success"
                  content="Увеличить интервал"
                  closeDelay={0}
                >
                  <Button
                    size="lg"
                    color="success"
                    isIconOnly={true}
                    isDisabled={increaseDisabled}
                    onPress={() => setSettingsData(data => ({ ...data, refreshDelay: data.refreshDelay + 5 }))}
                    startContent={<Icon data={mdiPlusThick}></Icon>}
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
    </div >
  );
};
