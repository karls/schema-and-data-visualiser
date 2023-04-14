export type RepositoryId = string;

export interface RepositoryInfo {
  uri: String;
  id: RepositoryId;
  title: String;
  readable: boolean;
  writeable: boolean;
}

export type Row = string[];

export type QueryResults = {
  header: string[];
  data: Row[];
};


export type QueryRecord = {
  id: number;
  sparql: string;
  repositoryId: string;
  date: string;
}