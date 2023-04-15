import { makeAutoObservable } from "mobx";
import { QueryRecord } from "../types";
import { makePersistable } from "mobx-persist-store";
import RootStore from "./root-store";

type QueriesState = {
  queryHistory: QueryRecord[];
  openQueries: string[];
};

class QueriesStore {
  rootStore: RootStore;
  state: QueriesState = {
    queryHistory: [],
    openQueries: [],
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    makePersistable(this, {
      name: "Settings",
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
}

export default QueriesStore;
