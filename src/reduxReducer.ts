import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import transactionsReducers from "./features/transactions";
import userReducer from "./features/user";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: [],
};

const transactionsPersistConfig = {
  key: "transactions",
  storage,
  // whitelist: ['categories']
};
const userPersistConfig = {
  key: "user",
  storage,
};

const rootReducer = combineReducers({
  transactions: persistReducer(transactionsPersistConfig, transactionsReducers),
  // transactions,
  user: persistReducer(userPersistConfig, userReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
export default persistedReducer;
