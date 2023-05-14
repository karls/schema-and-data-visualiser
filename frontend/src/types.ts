export type RepositoryId = string;

export type URI = string;

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

export type RDFGraph = {
  header: ['Subject', 'Predicate', 'Object'],
  data: Triplet[],
}

export type QueryRecord = {
  id: number;
  title: string;
  sparql: string;
  repositoryId: string;
  date: string;
};

export type QueryId = string;
export type QueryInfo = { title: string; sparql: string };

export type Metadata = {
  label: string;
  comment: string;
  domain: string;
  range: string;
}

export enum PropertyType {
  DatatypeProperty,
  ObjectProperty, 
  FunctionalProperty,
  TransitiveProperty,
  SymmetricProperty,
}