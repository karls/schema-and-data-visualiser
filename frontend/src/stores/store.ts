import { createContext, useContext } from "react";
import RootStore from "./root-store";

const rootStore: RootStore = new RootStore();
export const StoreContext = createContext(rootStore);

export function useStore() {
  return useContext<RootStore>(StoreContext);
}

export default rootStore;
