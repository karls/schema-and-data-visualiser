import { makeAutoObservable } from "mobx";
import { getQueryHistory } from "../api/queries";
import { QueryRecord, RepositoryId } from "../types";
import { makePersistable } from "mobx-persist-store";

type SettingsState = {
  currentRepository: RepositoryId | null;
  queryHistory: QueryRecord[];
  darkMode: boolean;
  sidebarWidth: number;
};

class Settings {
  state: SettingsState = {
    currentRepository: null,
    queryHistory: [],
    darkMode: false,
    sidebarWidth: 200,
  };

  constructor() {
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

  setState(state: SettingsState) {
    this.state = state;
  }

  getDarkMode(): boolean {
    return this.state.darkMode;
  }

  getCurrentRepository() {
    return this.state.currentRepository;
  }

  getQueryHistory() {
    return this.state.queryHistory;
  }

  getSidebarWidth(): number {
    return this.state.sidebarWidth;
  }

  setCurrentRepository(id: RepositoryId) {
    this.setState({ ...this.state, currentRepository: id });
    this.updateQueryHistory();
  }

  updateQueryHistory() {
    if (this.state.currentRepository) {
      getQueryHistory(this.state.currentRepository).then((queries) => {
        this.setState({ ...this.state, queryHistory: queries });
      });
    }
  }

  setDarkMode(value: boolean) {
    this.setState({ ...this.state, darkMode: value });
  }
}

export default Settings;
