import { createStore, combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import transactions from './transactions';
import user from './user';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: [],
};

const transactionsPersistConfig = {
  key: 'transactions',
  storage,
  blacklist: ['status']
};
const userPersistConfig = {
  key: 'user',
  storage,
};

const rootReducer = combineReducers({
  // transactions: persistReducer(transactionsPersistConfig, transactions),
  transactions,
  user: persistReducer(userPersistConfig, user),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
const storeCreator = () => {
  const store = createStore(persistedReducer, composeWithDevTools());
  const persistor = persistStore(store);
  return { store, persistor };
};

export default storeCreator;

