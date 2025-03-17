"use client";

import { settingsModel } from "@/entities/settings";
import { Icon } from "@/pages/home/ui/icon";
import { Settings } from "@/shared/api/settings/model";
import { setItem } from "@/shared/lib/storage";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Tooltip } from "@heroui/react";
import { mdiCog, mdiMinusThick, mdiPlusThick } from "@mdi/js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface SettingsDisplayProps {
    isOpenedSettings: boolean;
    changeSettingsDisplay: Dispatch<SetStateAction<boolean>>;
}

export const SettingsDisplay = ({ isOpenedSettings, changeSettingsDisplay }: SettingsDisplayProps) => {
    const {
        store: { getSettings, defaultSettings },
    } = settingsModel;

    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [increaseDisabled, setIncreaseDisabled] = useState<boolean>(false);
    const [decreaseDisabled, setDecreaseDisabled] = useState<boolean>(true);

    useEffect(() => {
        getSettings();
        setSettings(settingsModel.store.settings);
    }, [getSettings]);

    useEffect(() => checkValidation(), [settings]);

    const changeServerAddress = (newAdress: string) => {
        setSettings({ serverAddress: newAdress.trim(), refreshDelay: settings.refreshDelay });
    };

    const checkValidation = () => {
        setIncreaseDisabled(settings.refreshDelay == 60);
        setDecreaseDisabled(settings.refreshDelay == 5);
    };

    const increaseRefreshDelay = () => {
        setSettings({ serverAddress: settings.serverAddress, refreshDelay: settings.refreshDelay + 5 });
    };

    const decreaseRefreshDelay = () => {
        setSettings({ serverAddress: settings.serverAddress, refreshDelay: settings.refreshDelay - 5 });
    };

    const saveSettings = () => {
        changeSettingsDisplay(false);
        setItem('settings', JSON.stringify(settings));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        setItem('settings', JSON.stringify(settings));
    };

    return (
        <div className="flex flex-col gap-0 w-full rounded-xl overflow-clip bg-gray-200/50">
            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                isOpen={isOpenedSettings}
                onOpenChange={isOpen => changeSettingsDisplay(isOpen)}
                backdrop='blur'
            >
                <ModalContent>
                    <ModalHeader className="gap-1 place-items-center">
                        <Icon data={mdiCog} /> Окно настроек
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4 w-full h-full">
                            <Input
                                type="text"
                                label="Адрес сервера"
                                isRequired
                                isInvalid={settings.serverAddress.trim().length == 0}
                                value={settings.serverAddress.trim()}
                                onChange={(e) => changeServerAddress(e.target.value)}
                                placeholder="Введите адрес сервера.."
                                className="mb-4"
                                autoFocus
                            />

                            <p className="text-center">Интервал обновления данных</p>

                            <div className="flex flex-row justify-between">
                                <Tooltip color='danger' content="Уменьшить интервал" closeDelay={0}>
                                    <Button
                                        size="lg"
                                        color='danger'
                                        isIconOnly={true}
                                        isDisabled={decreaseDisabled}
                                        onPress={decreaseRefreshDelay}
                                        startContent={<Icon data={mdiMinusThick}></Icon>}
                                    />
                                </Tooltip>

                                <Tooltip color='foreground' showArrow={true} content="Интервал представлен в минутах" closeDelay={0}>
                                    <p className="text-3xl font-bold self-center">{settings.refreshDelay} <span className="text-xl font-light">мин.</span></p>
                                </Tooltip>

                                <Tooltip color='success' content="Увеличить интервал" closeDelay={0}>
                                    <Button
                                        size="lg"
                                        color='success'
                                        isIconOnly={true}
                                        isDisabled={increaseDisabled}
                                        onPress={increaseRefreshDelay}
                                        startContent={<Icon data={mdiPlusThick}></Icon>}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={() => changeSettingsDisplay(false)}>
                            Отмена
                        </Button>
                        <Button color="primary" isDisabled={settings.serverAddress.trim() == defaultSettings.serverAddress.trim() && settings.refreshDelay == defaultSettings.refreshDelay} onPress={resetSettings}>
                            Сброс
                        </Button>
                        <Button color="success" isDisabled={settings.serverAddress.trim().length == 0} onPress={saveSettings}>
                            Сохранить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};