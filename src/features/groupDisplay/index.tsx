"use client";

import { Button } from "@heroui/button";
import { useDisclosure, Tooltip } from "@heroui/react";
import {
  mdiArrowDownBold,
  mdiArrowUpBold,
  mdiPlusThick,
  mdiTrashCan,
} from "@mdi/js";
import { observer } from "mobx-react-lite";
import clsx from "clsx";

import { DialogDelete } from "../dialogDelete";

import { DialogGroups } from "./dialogGroups";

import { Icon } from "@/shared/ui/icon";
import { Group } from "@/shared/api/group/type";
import { Collection } from "@/entities/collection";
import { groupModel } from "@/entities/group";

type Props = {
  availableGroups: Group[];
  group: Group | undefined;
  collection: Collection | undefined;
  isLoading: boolean;
};

export const GroupDisplay = observer(
  ({ availableGroups, group, collection, isLoading }: Props) => {
    const {
      store: {
        addGroup,
        deleteSelectedGroup,
        getGroup,
        isMoveSelectedGroupDown,
        isMoveSelectedGroupUp,
        moveSelectedGroupDown,
        moveSelectedGroupUp,
      },
    } = groupModel;

    const {
      isOpen: isOpenGroups,
      onOpen: onOpenGroups,
      onOpenChange: onOpenChangeGroups,
    } = useDisclosure();

    const {
      isOpen: isOpenDelete,
      onOpen: onOpenDelete,
      onOpenChange: onOpenChangeDelete,
    } = useDisclosure();

    return (
      <div
        className={clsx(
          "flex flex-col gap-0 w-full rounded-xl overflow-clip bg-gray-200/50",
          collection && "mr-4"
        )}
      >
        <DialogDelete
          actionDelete={deleteSelectedGroup}
          isOpen={isOpenDelete}
          title={`Вы точно хотите удалить группу "${group?.title}"?`}
          onOpenChange={onOpenChangeDelete}
        />

        <DialogGroups
          actionAdd={addGroup}
          availableGroups={availableGroups}
          getGroup={getGroup}
          group={group}
          isLoading={isLoading}
          isOpen={isOpenGroups}
          onOpenChange={onOpenChangeGroups}
        />

        <div className="flex-1 flex items-center px-2 pt-2 relative">
          <div className="absolute left-0 right-0 flex justify-center">
            <p className="text-lg pt-2">Группы</p>
          </div>
          <div className="flex gap-2 ml-auto">
            <Tooltip
              closeDelay={0}
              color="primary"
              content="Переместить коллекцию вверх"
            >
              <Button
                color={collection ? "primary" : "default"}
                isDisabled={!isMoveSelectedGroupUp()}
                isIconOnly={true}
                size="lg"
                startContent={<Icon as={mdiArrowUpBold} />}
                onPress={moveSelectedGroupUp}
              />
            </Tooltip>
            <Tooltip
              closeDelay={0}
              color="primary"
              content="Переместить коллекцию вниз"
            >
              <Button
                color={collection ? "primary" : "default"}
                isDisabled={!isMoveSelectedGroupDown()}
                isIconOnly={true}
                size="lg"
                startContent={<Icon as={mdiArrowDownBold} />}
                onPress={moveSelectedGroupDown}
              />
            </Tooltip>
          </div>
        </div>
        <div
          className="relative flex flex-col gap-0 overflow-y-auto h-full"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 5%, black 100%)",
          }}
        >
          <div className="flex flex-col gap-2 p-4 pb-16">
            {collection?.groups.map((item, index) => (
              <div key={index}>
                <Button
                  className="w-full"
                  color={group?.title === item.title ? "primary" : "default"}
                  size="md"
                  onPress={() => getGroup(item.title)}
                >
                  {item.title}
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex -mt-14 mb-2 mx-2 justify-between">
          <Tooltip closeDelay={0} color="success" content="Добавить группу">
            <Button
              className="opacity-50 hover:opacity-100 m-0 p-0"
              color={collection ? "success" : "default"}
              isDisabled={!collection}
              isIconOnly={true}
              size="lg"
              startContent={<Icon as={mdiPlusThick} />}
              onPress={onOpenGroups}
            />
          </Tooltip>

          <Tooltip closeDelay={0} color="danger" content="Удалить группу">
            <Button
              className="opacity-50 hover:opacity-100"
              color={group ? "danger" : "default"}
              isDisabled={!group}
              isIconOnly={true}
              size="lg"
              startContent={<Icon as={mdiTrashCan} />}
              onPress={onOpenDelete}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
);
