export type RepositoryId = string;

export interface RepositoryInfo {
  uri: String;
  id: RepositoryId;
  title: String;
  readable: boolean;
  writeable: boolean;
}

export type Triplet = [string, string, string];

export type Row = string[];

export type QueryResults = {
  header: string[];
  data: Row[];
};

export type QueryRecord = {
  id: number;
  title: string;
  sparql: string;
  repositoryId: string;
  date: string;
};

export type QueryId = string;
export type QueryInfo = { title: string; sparql: string };
