"use client";

import { Button } from "@heroui/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { mdiKey } from "@mdi/js";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/shared/ui/icon";
import { BaseLayout } from "@/shared/ui/baseLayout";
import { authModel } from "@/entities/auth";

export const LoginPage = observer(() => {
  const router = useRouter();

  const {
    store: { login },
  } = authModel;

  const [username, setUsername] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  const signIn = async () => {
    await login(username, password);
    router.push("/");
  };

  return (
    <BaseLayout>
      <Modal
        backdrop="blur"
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={true}
      >
        <ModalContent>
          <ModalHeader className="gap-1 place-items-center">
            <Icon as={mdiKey} /> Вход
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                isRequired
                isInvalid={username?.length === 0}
                label="Логин"
                placeholder="Введите имя пользователя"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                isRequired
                isInvalid={password?.length === 0}
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              isDisabled={!username || !password}
              onPress={signIn}
            >
              Войти
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </BaseLayout>
  );
});
