import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { QueryRecord } from "../types";
import RootStore from "./root-store";
import { clearQueryHistory, getQueryHistory } from "../api/queries";

type RepositoryStoreState = {
  currentRepository: string | null;
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

  setCurrentRepository(repositoryId: string) {
    this.state.currentRepository= repositoryId;
    this.updateQueryHistory();
  }

  updateQueryHistory() {
    if (this.state.currentRepository) {
      const username = this.rootStore.authStore.username!;
      getQueryHistory(this.state.currentRepository, username).then((queries: QueryRecord[]) => {
        console.log(queries);
        this.state.queryHistory = queries;
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
