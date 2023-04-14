export type RepositoryId = string;

export interface RepositoryInfo {
  uri: String;
  id: RepositoryId;
  title: String;
  readable: boolean;
  writeable: boolean;
}

export type Triplet = [string, string, string];

export type QueryResults = {
  header: string[];
  data: Triplet[];
};


export type QueryRecord = {
  id: number;
  sparql: string;
  repositoryId: string;
  date: string;
}