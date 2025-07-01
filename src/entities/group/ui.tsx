import { Checkbox, cn } from "@heroui/react";

import { Group } from "@/shared/api/group/type";

type Props = {
  group: Group;
  action: (title: string) => void;
};

export const GroupCard = ({ group, action }: Props) => {
  return (
    <Checkbox
      classNames={{
        base: cn(
          "inline-flex w-full max-w-md border-default border-4 rounded-lg gap-2 p-4",
          "hover:border-primary items-center justify-start",
          "data-[selected=true]:border-success"
        ),
        label: "w-full",
      }}
      color="success"
      isSelected={group.isSelected}
      onChange={() => action(group.title)}
    >
      <p className="w-full  text-center">{group.title}</p>
    </Checkbox>
  );
};
