import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import RootStore from "./root-store";

type QueriesState = {
  totalQueries: number;
  openQueries: { [key: string]: { label: string; text: string } };
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

  getOpenQueries() {
    return this.state.openQueries;
  }

  setQueryText(id: string, text: string) {
    this.state.openQueries[id].text = text;
  }

  addQuery(qid: string) {
    this.state.totalQueries++;
    this.state.openQueries[qid] = {
      label: `Query ${qid}`,
      text: "",
    };
  }

  getTotalQueries(): number {
    return this.state.totalQueries;
  }
}

export default QueriesStore;
