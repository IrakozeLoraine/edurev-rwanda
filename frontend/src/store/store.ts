import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import logger from "redux-logger";
import { rootReducer } from "./reducers";


const LOCAL_STORAGE_KEY = "redux-app-state";

function loadStateFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!serializedState) {
            return undefined; // Let reducers use their initial state
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error("Failed to load state from localStorage:", error);
        return undefined;
    }
}

function saveStateToLocalStorage(state: unknown) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
    } catch (error) {
        // Might fail if storage is full or user has disabled it
        console.error("Failed to save state to localStorage:", error);
    }
}

const persistedState = loadStateFromLocalStorage();

export const store = createStore(rootReducer, persistedState, applyMiddleware(thunk, logger));

// Subscribe to store changes and persist state
store.subscribe(() => {
    const state = store.getState();
    saveStateToLocalStorage(state);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;