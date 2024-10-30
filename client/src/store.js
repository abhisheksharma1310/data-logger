import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
// navDetail reducer
import navDetailReducer from "./features/navDetail/navDetailSlice";
// serial config reducer
import serialConfigReducer from "./features/serialConfig/configSlice";
// base url reducer
import baseUrlReducer from "./features/serialConfig/baseUrlSlice";
// liveSerialData reducer
import liveSerialDataReducer from "./features/liveSerialData/liveDataSlice";

// Combine your reducers
const rootReducer = combineReducers({
  navDetail: navDetailReducer,
  baseUrl: baseUrlReducer,
  serialConfig: serialConfigReducer,
  liveSerialData: liveSerialDataReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["navDetail"], // Add the slices you want to persist
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
