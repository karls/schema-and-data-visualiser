import { makeAutoObservable } from 'mobx';

class Settings {
    constructor() {
        makeAutoObservable(this);
    }
}

export default Settings;