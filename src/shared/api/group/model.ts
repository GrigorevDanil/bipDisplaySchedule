export type Group = {
  title: string;
};

export type Collection = {
  id: number;
  title: string;
  groups: Group[]
};

export type Corpus = {
  id: number;
  title: string;
  collections: Collection[]
};