"use client";

import { Icon } from "@/pages/home/ui/icon";
import { Authorization } from "@/shared/api/authorization/model";
import { userLogin, userPassword } from "@/shared/api/httpClient";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "@heroui/react";
import { mdiCog, mdiKey } from "@mdi/js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface AuthDisplayProps {
  auth: Authorization | null;
  isOpenedAuth: boolean;
  isOpenedSettings: boolean;
  setAuth: Dispatch<SetStateAction<Authorization | null>>;
  changeAuthDisplay: Dispatch<SetStateAction<boolean>>;
  changeSettingsDisplay: Dispatch<SetStateAction<boolean>>;
}

export const AuthDisplay = ({ auth, isOpenedAuth, isOpenedSettings, setAuth, changeAuthDisplay, changeSettingsDisplay }: AuthDisplayProps) => {
  const [warningText, setWarningText] = useState<string>("");
  const [authTemp, setAuthTemp] = useState<Authorization | null>(auth);

  const signIn = () => {
    if (!authTemp?.login || !authTemp.password)
      return;

    if (authTemp.login != userLogin || authTemp.password != userPassword)
      return setWarningText("Неверный логин или пароль!");

    setAuth(authTemp);
    changeAuthDisplay(false);
  };

  useEffect(() => setWarningText(''), [authTemp?.login, authTemp?.password]);

  return (
    <div className="flex flex-col gap-0 -mt-8 w-full rounded-xl overflow-clip bg-gray-200/50">
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpenedAuth}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="gap-1 place-items-center">
            <Icon data={mdiKey} /> Вход
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                label="Логин"
                isRequired
                isInvalid={authTemp?.login?.length == 0 || warningText.length > 0}
                value={authTemp?.login}
                onChange={(e) => setAuthTemp(data => data ? ({ ...data, login: e.target.value.trim() }) : ({ login: e.target.value.trim(), password: "" }))}
                placeholder="Введите логин"
                autoFocus
              />

              <Input
                type="password"
                label="Пароль"
                isRequired
                isInvalid={authTemp?.password?.length == 0 || warningText.length > 0}
                value={authTemp?.password}
                onChange={(e) => setAuthTemp(data => data ? ({ ...data, password: e.target.value.trim() }) : ({ login: "", password: e.target.value.trim() }))}
                placeholder="Введите пароль"
              />

              <p className={`text-danger-500 ${warningText.length == 0 ? '-mt-4' : ''}`}>{warningText}</p>
            </div>
          </ModalBody>
          <ModalFooter className="flex flex-row justify-between">
            <Button
              isIconOnly={true}
              endContent={<Icon data={mdiCog} />}
              onPress={() => changeSettingsDisplay(true)}
            />
            <Button
              color="success"
              isDisabled={!authTemp?.login || !authTemp.password}
              onPress={signIn}
            >
              Войти
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div >
  );
};
