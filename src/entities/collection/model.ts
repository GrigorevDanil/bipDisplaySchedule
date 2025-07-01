import { makeAutoObservable } from "mobx";
import { v4 as randomUUID } from "uuid";

import { Corpus, corpusModel } from "../corpus";
import { CorpusStore } from "../corpus/model";

import { Collection } from "./type";

export class CollectionStore {
  collection: Collection | undefined = undefined;

  get corpus(): Corpus | undefined {
    return this.corpusStore.corpus;
  }

  get saveToLocalStorage(): () => void {
    return this.corpusStore.saveToLocalStorage;
  }

  constructor(private corpusStore: CorpusStore) {
    makeAutoObservable(this);
  }

  isMoveCollectionUp = (idCollection: string): boolean => {
    if (!this.corpus) return false;

    const index = this.corpus.collections.findIndex(
      (x) => x.id === idCollection
    );

    return index > 0;
  };

  isMoveCollectionDown = (idCollection: string): boolean => {
    if (!this.corpus) return false;

    const index = this.corpus.collections.findIndex(
      (x) => x.id === idCollection
    );

    return index >= 0 && index < this.corpus.collections.length - 1;
  };

  isMoveSelectedCollectionUp = () =>
    this.isMoveCollectionUp(this.collection?.id!);

  isMoveSelectedCollectionDown = () =>
    this.isMoveCollectionDown(this.collection?.id!);

  isCollectionNameExist = (title: string): boolean =>
    this.corpus?.collections.some((x) => x.title === title) ?? false;

  getCollection = (idCollection: string) => {
    this.collection = this.corpus?.collections.find(
      (x) => x.id === idCollection
    );
  };

  addCollection = () => {
    if (!this.corpus) return;

    const title = `Коллекция ${this.corpus.collections.length + 1}`;

    const collection: Collection = {
      id: randomUUID(),
      title,
      groups: [],
    };

    this.corpus.collections = [...this.corpus.collections, collection];

    this.corpusStore.corpusList = this.corpusStore.corpusList.map((c) =>
      c.id === this.corpus?.id
        ? { ...c, collections: this.corpus.collections }
        : c
    );

    this.saveToLocalStorage();
  };

  updateCollection = (idCollection: string, newTitle: string) => {
    if (!this.corpus || this.isCollectionNameExist(newTitle)) return;

    this.corpus.collections = this.corpus.collections.map((collection) =>
      collection.id === idCollection
        ? { ...collection, title: newTitle }
        : collection
    );

    this.saveToLocalStorage();
  };

  updateSelectedCollection = (newTitle: string) => {
    if (this.collection) {
      this.updateCollection(this.collection.id, newTitle);
    }
  };

  deleteCollection = (idCollection: string) => {
    if (!this.corpus) return;

    this.corpus.collections = this.corpus.collections.filter(
      (colleciton) => colleciton.id !== idCollection
    );
    this.saveToLocalStorage();
  };

  deleteSelectedCollection = () => {
    if (this.collection) {
      this.deleteCollection(this.collection.id);
      this.collection = undefined;
    }
    this.saveToLocalStorage();
  };

  moveCollectionUp = (idCollection: string) => {
    if (!this.corpus || !this.isMoveCollectionUp(idCollection)) return;

    const collections = [...this.corpus.collections];
    const index = collections.findIndex((x) => x.id === idCollection);

    [collections[index - 1], collections[index]] = [
      collections[index],
      collections[index - 1],
    ];

    this.corpus.collections = collections;

    this.corpusStore.corpusList = this.corpusStore.corpusList.map((c) =>
      c.id === this.corpus?.id
        ? { ...c, collections: this.corpus.collections }
        : c
    );

    this.saveToLocalStorage();
  };

  moveSelectedCollectionUp = () => {
    if (this.collection) {
      this.moveCollectionUp(this.collection.id);
    }
  };

  moveCollectionDown = (idCollection: string) => {
    if (!this.corpus || !this.isMoveCollectionDown(idCollection)) return;

    const collections = [...this.corpus.collections];
    const index = collections.findIndex((x) => x.id === idCollection);

    [collections[index], collections[index + 1]] = [
      collections[index + 1],
      collections[index],
    ];

    this.corpus.collections = collections;

    this.corpusStore.corpusList = this.corpusStore.corpusList.map((c) =>
      c.id === this.corpus?.id
        ? { ...c, collections: this.corpus.collections }
        : c
    );

    this.saveToLocalStorage();
  };

  moveSelectedCollectionDown = () => {
    if (this.collection) {
      this.moveCollectionDown(this.collection.id);
    }
  };
}

export const store = new CollectionStore(corpusModel.store);
