import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import RootStore from "./root-store";

type SettingsState = {
  darkMode: boolean;
  sidebarWidth: number;
};

class SettingsStore {
  rootStore: RootStore;
  state: SettingsState = {
    darkMode: false,
    sidebarWidth: 200,
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

  setDarkMode(value: boolean) {
    this.setState({ ...this.state, darkMode: value });
  }
}

export default SettingsStore;
