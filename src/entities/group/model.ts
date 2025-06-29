import { makeAutoObservable, runInAction } from "mobx";

import { Collection, collectionModel } from "../collection";
import { CollectionStore } from "../collection/model";
import { CorpusStore } from "../corpus/model";
import { corpusModel } from "../corpus";

import { Group } from "@/shared/api/group/type";
import { getGroups } from "@/shared/api/group";

export class GroupStore {
  groupList: Group[] = [];
  group?: Group;
  isLoading = false;
  groupListError = "";
  isError: boolean = false;

  get collection(): Collection | undefined {
    return this.collectionStore.collection;
  }

  get saveToLocalStorage(): () => void {
    return this.corpusStore.saveToLocalStorage;
  }

  get availableGroups(): Group[] {
    if (!this.collection) {
      return this.groupList;
    }

    const currentGroupTitles = new Set(
      this.collection.groups.map((g) => g.title)
    );

    return this.groupList.filter(
      (group) => !currentGroupTitles.has(group.title)
    );
  }

  constructor(
    private corpusStore: CorpusStore,
    private collectionStore: CollectionStore
  ) {
    makeAutoObservable(this);
  }

  resetError = () => {
    this.isError = false;
    this.groupListError = "";
  };

  isMoveGroupUp = (title: string): boolean => {
    if (!this.collection) return false;

    const index = this.collection.groups.findIndex((x) => x.title === title);

    return index > 0;
  };

  isMoveGroupDown = (title: string): boolean => {
    if (!this.collection) return false;

    const index = this.collection.groups.findIndex((x) => x.title === title);

    return index >= 0 && index < this.collection.groups.length - 1;
  };

  isMoveSelectedGroupUp = () => this.isMoveGroupUp(this.group?.title!);

  isMoveSelectedGroupDown = () => this.isMoveGroupDown(this.group?.title!);

  getGroupList = async (serverAddress: string) => {
    try {
      this.isLoading = true;

      const data = await getGroups(serverAddress);

      runInAction(() => {
        this.isLoading = false;
        this.groupList = data;
      });
    } catch (error) {
      if (error instanceof Error) {
        runInAction(() => {
          this.isLoading = false;
          this.isError = true;
          this.groupListError = error.message;
        });
      }
    }
  };

  getGroup = (title: string) => {
    this.group = this.groupList.find((x) => x.title === title);
  };

  addGroup = (group: Group) => {
    if (!this.collection) return;

    this.collection.groups.push(group);

    this.saveToLocalStorage();
  };

  deleteGroup = (title: string) => {
    if (!this.collection) return;

    this.collection.groups = this.collection.groups.filter(
      (colleciton) => colleciton.title !== title
    );
    this.saveToLocalStorage();
  };

  deleteSelectedGroup = () => {
    if (this.group) {
      this.deleteGroup(this.group.title);
      this.group = undefined;
    }
  };

  moveGroupUp = (title: string) => {
    if (!this.collection || !this.isMoveGroupUp(title)) return;

    const groups = [...this.collection.groups];
    const index = groups.findIndex((x) => x.title === title);

    [groups[index - 1], groups[index]] = [groups[index], groups[index - 1]];

    this.collection.groups = groups;
    this.saveToLocalStorage();
  };

  moveSelectedGroupUp = () => {
    if (this.group) {
      this.moveGroupUp(this.group.title);
    }
  };

  moveGroupDown = (title: string) => {
    if (!this.collection || !this.isMoveGroupDown(title)) return;

    const groups = [...this.collection.groups];
    const index = groups.findIndex((x) => x.title === title);

    [groups[index], groups[index + 1]] = [groups[index + 1], groups[index]];

    this.collection.groups = groups;
    this.saveToLocalStorage();
  };

  moveSelectedGroupDown = () => {
    if (this.group) {
      this.moveGroupDown(this.group.title);
    }
  };
}

export const store = new GroupStore(corpusModel.store, collectionModel.store);
