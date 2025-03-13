import { getGroups } from "@/shared/api/group";
import { Group } from "@/shared/api/group/model";
import { makeAutoObservable, runInAction } from "mobx";

class GroupStore {
  groupList: Group[] = [];
  isLoading = false;
  groupListError = "";
  isUpdateLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  getGroupList = async () => {
    try {
      this.isLoading = true;

      const data = await getGroups();

      runInAction(() => {
        this.isLoading = false;
        this.groupList = data;
      });
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.isLoading = false;
          this.groupListError = error.message;
        });
      }
    }
  };
}

export const store = new GroupStore();
