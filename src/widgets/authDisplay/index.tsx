"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import { mdiKey } from "@mdi/js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { userLogin, userPassword } from "@/shared/api/httpClient";
import { Authorization } from "@/shared/api/authorization/model";
import { Icon } from "@/pages/home/ui/icon";

interface AuthDisplayProps {
  auth: Authorization | null | undefined;
  isOpenedAuth: boolean;
  setAuth: Dispatch<SetStateAction<Authorization | null | undefined>>;
  changeAuthDisplay: Dispatch<SetStateAction<boolean>>;
}

export const AuthDisplay = ({
  auth,
  isOpenedAuth,
  setAuth,
  changeAuthDisplay,
}: AuthDisplayProps) => {
  const [warningText, setWarningText] = useState<string>("");
  const [authTemp, setAuthTemp] = useState<Authorization | null | undefined>(
    auth
  );

  const signIn = () => {
    if (!authTemp?.login || !authTemp.password) return;

    if (authTemp.login != userLogin || authTemp.password != userPassword)
      return setWarningText("Неверный логин или пароль!");

    setAuth(authTemp);
    changeAuthDisplay(false);
  };

  useEffect(() => setWarningText(""), [authTemp?.login, authTemp?.password]);

  return (
    <div className="flex flex-col gap-0 -mt-8 w-full rounded-xl overflow-clip bg-gray-200/50">
      <Modal
        backdrop="blur"
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpenedAuth}
      >
        <ModalContent>
          <ModalHeader className="gap-1 place-items-center">
            <Icon data={mdiKey} /> Вход
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                isRequired
                isInvalid={
                  authTemp?.login?.length == 0 || warningText.length > 0
                }
                label="Логин"
                placeholder="Введите логин"
                type="text"
                value={authTemp?.login}
                onChange={(e) =>
                  setAuthTemp((data) =>
                    data
                      ? { ...data, login: e.target.value.trim() }
                      : { login: e.target.value.trim(), password: "" }
                  )
                }
              />

              <Input
                isRequired
                isInvalid={
                  authTemp?.password?.length == 0 || warningText.length > 0
                }
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                value={authTemp?.password}
                onChange={(e) =>
                  setAuthTemp((data) =>
                    data
                      ? { ...data, password: e.target.value.trim() }
                      : { login: "", password: e.target.value.trim() }
                  )
                }
              />

              <p
                className={`text-danger-500 ${warningText.length == 0 ? "-mt-4" : ""}`}
              >
                {warningText}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
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
    </div>
  );
};
