import { makeAutoObservable } from 'mobx';
import { RepositoryId } from '../types';

class Settings {
    currentRepository: RepositoryId | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setCurrentRepository(id: RepositoryId) {
        this.currentRepository = id;
    }
}

export default Settings;