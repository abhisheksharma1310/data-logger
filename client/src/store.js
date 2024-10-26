import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
// navDetail reducer
import navDetailReducer from "./features/navDetail/navDetailSlice";
// serial data reducer and api query service
import serialReducer from "./features/serialData/serialSlice";

// Combine your reducers
const rootReducer = combineReducers({
  navDetail: navDetailReducer,
  serial: serialReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["navDetail", "serial"], // Add the slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);
