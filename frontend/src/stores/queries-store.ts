import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import RootStore from "./root-store";
import { QueryId, QueryInfo } from "../types";

type QueriesState = {
  totalQueries: number;
  openQueries: { [key: string]: QueryInfo };
  currentQueryId: string;
};

class QueriesStore {
  rootStore: RootStore;
  state: QueriesState = {
    totalQueries: 1,
    openQueries: {
      "1": {
        name: "Query 1",
        sparql: "",
      },
    },
    currentQueryId: "1",
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    makePersistable(this, {
      name: "Queries",
      properties: [
        {
          key: "state",
          serialize: (value) => JSON.stringify(value),
          deserialize: (value) => JSON.parse(value),
        },
      ],
      storage: window.localStorage,
    });
  }

  setState(state: QueriesState) {
    this.state = state;
  }

  get openQueries() {
    return this.state.openQueries;
  }

  get currentQueryId(): string {
    return this.state.currentQueryId;
  }

  get currentQuery(): QueryInfo {
    return this.openQueries[this.currentQueryId];
  }

  setCurrentQueryId(key: string): void {
    this.state.currentQueryId = key;
  }

  setQueryText(id: string, sparql: string) {
    this.state.openQueries[id]!.sparql = sparql;
  }

  getCurrentQuery(id: string) {
    if (!Object.keys(this.state.openQueries).includes(id)) {
      return "";
    }
    return this.state.openQueries[this.currentQueryId]!;
  }

  setCurrentQuery(sparql: string) {
    this.state.openQueries[this.currentQueryId]!.sparql = sparql;
  }

  getQueryName(id: string) {
    if (!Object.keys(this.state.openQueries).includes(id)) {
      return "";
    }
    return this.state.openQueries[id]!.name;
  }

  setQueryTitle(id: string, title: string) {
    this.state.openQueries[id]!.name = title;
  }

  addQuery(sparql: string = "", name: string = ""): QueryId {
    const qid = `${++this.state.totalQueries}`;
    this.state.openQueries[qid] = {
      name: name || `Query ${qid}`,
      sparql,
    };
    return qid;
  }

  removeQuery(qid: string) {
    delete this.state.openQueries[qid];
  }
}

export default QueriesStore;
