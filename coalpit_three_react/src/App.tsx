import React, {useEffect} from 'react';
import Scene from "./components/scene/Scene";
import {Provider} from 'mobx-react'
import {dataStore} from "./stores/DataStore";
import {searchStore} from "./stores/SearchStore";
import SearchButton from "./components/search/SearchButton";
import "./styles.css";

function App() {
    useEffect(() => {
        dataStore.loadData()
    }, [])

    return (
        <Provider dataStore={dataStore} searchStore={searchStore}>
            <div className={"container"}>
                <SearchButton/>
                <div className={"container__scene"}>
                    <Scene/>
                </div>
            </div>
        </Provider>
    );
}

export default App;
