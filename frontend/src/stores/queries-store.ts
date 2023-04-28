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
        label: "Query 1",
        text: "",
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

  setCurrentQueryId(key: string): void {
    this.state.currentQueryId = key;
  }

  setQueryText(id: string, text: string) {
    this.state.openQueries[id]!.text = text;
  }

  setQueryLabel(id: string, label: string) {
    this.state.openQueries[id]!.label = label;
  }

  addQuery(text: string = ''): QueryId {
    const qid = `${++this.state.totalQueries}`
    this.state.openQueries[qid] = {
      label: `Query ${qid}`,
      text,
    };
    return qid;
  }

  removeQuery(qid: string) {
    delete this.state.openQueries[qid];
  }

  getTotalQueries(): number {
    return this.state.totalQueries;
  }
}

export default QueriesStore;
