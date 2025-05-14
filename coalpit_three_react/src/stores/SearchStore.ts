import {action, makeObservable, observable } from "mobx";
import {Point} from "../types/types";

class SearchStore {
    isSearchEnabled: boolean = false;
    startPoint: Point | null  = null;
    endPoint: Point | null = null;

    constructor() {
        makeObservable(this, {
            isSearchEnabled: observable,
            startPoint: observable,
            endPoint: observable,
            setSearchEnabled: action,
            setStartPoint: action,
            setEndPoint: action,
        })
    }

    setSearchEnabled(isSearchEnabled: boolean) {
        this.isSearchEnabled = isSearchEnabled;
    }

    setStartPoint(point: Point | null) {
        this.startPoint = point;
    }

    setEndPoint(point: Point | null) {
        this.endPoint = point;
    }
}

export const searchStore = new SearchStore();

