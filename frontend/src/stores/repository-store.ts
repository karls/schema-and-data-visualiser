import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { QueryRecord, RepositoryId } from "../types";
import RootStore from "./root-store";
import { getQueryHistory } from "../api/queries";

type RepositoryStoreState = {
  currentRepository: RepositoryId | null;
  queryHistory: QueryRecord[];
};

class RepositoryStore {
  rootStore: RootStore;
  state: RepositoryStoreState = {
    currentRepository: null,
    queryHistory: [],
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

  setState(state: RepositoryStoreState) {
    this.state = state;
  }

  getCurrentRepository() {
    return this.state.currentRepository;
  }

  getQueryHistory() {
    return this.state.queryHistory;
  }

  setCurrentRepository(id: RepositoryId) {
    this.setState({ ...this.state, currentRepository: id });
    this.updateQueryHistory();
  }

  updateQueryHistory() {
    if (this.state.currentRepository) {
      getQueryHistory(this.state.currentRepository).then((queries: QueryRecord[]) => {
        this.setState({ ...this.state, queryHistory: queries });
      });
    }
  }
}

export default RepositoryStore;
