import { createStore } from "redux";
import { persistStore } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import persistedReducer from "reduxReducer";
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

const store = createStore(persistedReducer, composeEnhancers());
// @ts-ignore
const persistor = persistStore(store);

export { store, persistor };
