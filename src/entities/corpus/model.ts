import { v4 as randomUUID } from "uuid";
import { makeAutoObservable } from "mobx";

import { Corpus } from "./type";

import {
  CORPUSES_KEY,
  getItemFromLocalStorage,
  setItemInLocalStorage,
} from "@/shared/lib/storage";

export class CorpusStore {
  corpusList: Corpus[] = [];
  corpus: Corpus | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  isCorpusNameExist = (title: string): boolean =>
    this.corpusList.some((x) => x.title === title);

  getCorpusList = () => {
    const corpusesJson = getItemFromLocalStorage(CORPUSES_KEY);

    this.corpusList = corpusesJson ? JSON.parse(corpusesJson) : [];
  };

  getCorpus = (idCorpus: string) => {
    this.corpus = this.corpusList.find((x) => x.id === idCorpus);
  };

  addCorpus = () => {
    const title = `Корпус ${this.corpusList.length + 1}`;

    const corpus: Corpus = {
      id: randomUUID(),
      title: title,
      collections: [],
    };

    this.corpusList = [...this.corpusList, corpus];

    this.saveToLocalStorage();
  };

  updateCorpus = (idCorpus: string, newTitle: string) => {
    if (this.isCorpusNameExist(newTitle)) return;

    this.corpusList = this.corpusList.map((corpus) =>
      corpus.id === idCorpus ? { ...corpus, title: newTitle } : corpus
    );

    this.saveToLocalStorage();
  };

  updateSelectedCorpus = (newTitle: string) => {
    if (this.corpus) {
      this.updateCorpus(this.corpus.id, newTitle);
    }
  };

  deleteCorpus = (idCorpus: string) => {
    this.corpusList = this.corpusList.filter(
      (corpus) => corpus.id !== idCorpus
    );

    this.saveToLocalStorage();
  };

  deleteSelectedCorpus = () => {
    if (this.corpus) {
      this.deleteCorpus(this.corpus.id);
      this.corpus = undefined;
    }
  };

  saveToLocalStorage = () => {
    setItemInLocalStorage(CORPUSES_KEY, JSON.stringify(this.corpusList));
  };
}

export const store = new CorpusStore();
