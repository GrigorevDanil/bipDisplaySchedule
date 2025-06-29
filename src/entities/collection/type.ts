import { Group } from "@/shared/api/group/type";

export type Collection = {
  id: string;
  title: string;
  groups: Group[];
};
