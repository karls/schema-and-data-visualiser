import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import RootStore from "./root-store";

type SettingsState = {
  darkMode: boolean;
  sidebarWidth: number;
  fullScreen: boolean;
  sidebarCollapsed: boolean;
};

class SettingsStore {
  rootStore: RootStore;
  state: SettingsState = {
    darkMode: false,
    sidebarWidth: 200,
    fullScreen: false,
    sidebarCollapsed: false,
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

  setState(state: SettingsState) {
    this.state = state;
  }

  get darkMode(): boolean {
    return this.state.darkMode;
  }

  get sidebarWidth(): number {
    return this.state.sidebarWidth;
  }

  get fullScreen(): boolean {
    return this.state.fullScreen;
  }

  get sidebarCollapsed(): boolean {
    return this.state.sidebarCollapsed;
  }

  setDarkMode(value: boolean) {
    this.setState({ ...this.state, darkMode: value });
  }

  setFullScreen(value: boolean) {
    this.state.fullScreen = value;
  }

  setSidebarCollapsed(value: boolean) {
    this.state.sidebarCollapsed = value;
  }
}

export default SettingsStore;
