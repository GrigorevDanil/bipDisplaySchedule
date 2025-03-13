"use client";

import { groupModel } from "@/entities/group";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Spinner } from "@heroui/spinner";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export const GroupDisplay = observer(() => {
  const {
    store: { groupList, isLoading, getGroupList },
  } = groupModel;

  useEffect(() => {
    getGroupList();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {isLoading ? (
        <Spinner className="m-auto" color="default" size="lg" />
      ) : (
        <div>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
            {groupList.map((item) => {
              return (
                <div key={item.title}>
                  <Button className="w-full" size="sm">
                    {item.title}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
