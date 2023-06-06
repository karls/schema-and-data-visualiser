import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { QueryRecord, RepositoryInfo } from "../types";
import RootStore from "./root-store";
import { clearQueryHistory, getQueryHistory } from "../api/queries";
import { allRepositories, deleteRepository } from "../api/sparql";

type RepositoryStoreState = {
  currentRepository: string | null;
  queryHistory: QueryRecord[];
  repositories: RepositoryInfo[];
};

class RepositoryStore {
  rootStore: RootStore;
  state: RepositoryStoreState = {
    currentRepository: null,
    queryHistory: [],
    repositories: [],
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

  get repositories() {
    return this.state.repositories;
  }

  getCurrentRepository() {
    return this.state.currentRepository;
  }

  getQueryHistory() {
    return this.state.queryHistory;
  }

  setCurrentRepository(repositoryId: string) {
    this.state.currentRepository = repositoryId;
    this.updateQueryHistory();
  }

  updateQueryHistory() {
    if (this.state.currentRepository) {
      const username = this.rootStore.authStore.username!;
      getQueryHistory(this.state.currentRepository, username).then(
        (queries: QueryRecord[]) => {
          console.log(queries);
          this.state.queryHistory = queries;
        }
      );
    }
  }

  clearQueryHistory() {
    if (this.state.currentRepository) {
      const username = this.rootStore.authStore.username!;
      clearQueryHistory(this.state.currentRepository, username).then(() => {
        this.updateQueryHistory();
      });
    }
  }

  updateRepositories() {
    const username = this.rootStore.authStore.username;
    if (username) {
      allRepositories(username!).then((repositories: RepositoryInfo[]) => {
        this.state.repositories = repositories;
      });
    }
  }

  deleteRepository(repository: string) {
    const username = this.rootStore.authStore.username;
    if (username) {
      deleteRepository(repository, username!).then(() => {
        this.updateRepositories();
      });
    }
  }
}

export default RepositoryStore;
