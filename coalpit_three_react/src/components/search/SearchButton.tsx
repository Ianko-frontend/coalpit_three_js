import {useCallback, useEffect, useMemo} from "react";
import {inject, observer} from "mobx-react";

const SearchButton = inject("searchStore", "dataStore")(observer(({searchStore, dataStore}) => {
    let handleClick = useCallback(() => {
        searchStore.setSearchEnabled(true)
    }, [])
    let name: string = useMemo(() => {
        if (searchStore.isSearchEnabled) {
            return 'Search is in progress';
        }
        return "Start searching";
    }, [searchStore.isSearchEnabled]);

    let escFunction = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            searchStore.setSearchEnabled(false);
            searchStore.setStartPoint(null);
            searchStore.setEndPoint(null);
            dataStore.clearPaths();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        }
    }, [escFunction]);
    
    return (
        <button type={"button"} onClick={handleClick}>{name}</button>
    )
})
)

export default SearchButton;