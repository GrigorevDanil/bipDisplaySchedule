import { getGroups } from "@/shared/api/group";
import { Corpus, Group } from "@/shared/api/group/model";
import { getItem } from "@/shared/lib/storage";
import { makeAutoObservable, runInAction } from "mobx";

class GroupStore {
  groupList: Group[] = [];
  corpusList: Corpus[] = [];
  selectedCorpusId: number | null = null;
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

  getCorpusList = () => {
    const corpusesData = getItem('corpuses');

    if (!corpusesData)
      return runInAction(() => {
        this.corpusList = [];
      });

    runInAction(() => {
      this.corpusList = JSON.parse(corpusesData);
    });
  }

  getSelectedCorpusId = () => {
    const selectedCorpusId = getItem('selectedCorpusId');

    if (!selectedCorpusId)
      return runInAction(() => {
        this.selectedCorpusId = null;
      });

    runInAction(() => {
      this.selectedCorpusId = JSON.parse(selectedCorpusId);
    });
  };
}

export const store = new GroupStore();
