import { createContext, useContext } from "react";
import Settings from "./settings";

interface Store {
    settings: Settings;
}

const store: Store = {
    settings: new Settings(),
}

export const StoreContext  = createContext(store);


export function useStore() {
    return useContext<Store>(StoreContext)
}

export default store;
