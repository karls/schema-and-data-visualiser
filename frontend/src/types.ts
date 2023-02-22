export type RepositoryId = string;

export interface RepositoryInfo {
  uri: String;
  id: RepositoryId;
  title: String;
  readable: boolean;
  writeable: boolean;
}

export type Triplet = [string, string, string];

export type QueryResult = {
  header: string[];
  data: Triplet[];
};
