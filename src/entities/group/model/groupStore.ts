import { getGroups } from "@/shared/api/group";
import { Collection, Group } from "@/shared/api/group/model";
import { getItem } from "@/shared/lib/storage";
import { makeAutoObservable, runInAction } from "mobx";

class GroupStore {
  groupList: Group[] = [];
  collectionList: Collection[] = [];
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

  getCollectionList = () => {
    const collectionsData = getItem('collections');

    if (!collectionsData)
      return runInAction(() => {
        this.collectionList = [];
      });

    runInAction(() => {
      this.collectionList = JSON.parse(collectionsData);
    });
  }
}

export const store = new GroupStore();
