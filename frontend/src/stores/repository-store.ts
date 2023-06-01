import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { QueryRecord, RepositoryId } from "../types";
import RootStore from "./root-store";
import { clearQueryHistory, getQueryHistory } from "../api/queries";

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
      name: "Repository",
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

  get currentRepository() {
    return this.state.currentRepository;
  }

  get queryHistory() {
    return this.state.queryHistory;
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

  clearQueryHistory() {
    if (this.state.currentRepository) {
      clearQueryHistory(this.state.currentRepository).then(() => {
        this.updateQueryHistory();
      });
    }
  }
}

export default RepositoryStore;
