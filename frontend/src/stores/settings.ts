import { makeAutoObservable } from 'mobx';
import { getQueryHistory } from '../api/queries';
import { QueryHistory, RepositoryId } from '../types';

class Settings {
    currentRepository: RepositoryId | null = null;
    queryHistory: QueryHistory = [];

    constructor() {
        makeAutoObservable(this);
    }

    setCurrentRepository(id: RepositoryId) {
        this.currentRepository = id;
    }

    updateQueryHistory() {
        getQueryHistory().then((queries) => {
            this.queryHistory = queries;
            console.log(queries);
        })
    }
}

export default Settings;