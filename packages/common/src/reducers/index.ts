import { createStore, combineReducers } from 'redux';
import transactions from './transactions';
import user from './user';

// const rootPersistConfig = {
//   key: 'root',
//   storage,
//   whitelist: []
// };
//
// const transactionsPersistConfig = {
//   key: 'transactions',
//   storage
//   // whitelist: ['categories']
// };
// const userPersistConfig = {
//   key: 'user',
//   storage
// };
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const rootReducer = combineReducers({
//   transactions: persistReducer(transactionsPersistConfig, transactions),
//   // transactions,
//   user: persistReducer(userPersistConfig, user)
// });

const rootReducer = combineReducers({
  transactions: transactions,
  // transactions,
  user: user
});

// const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
// const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

const storeCreator = () => {
  const store = createStore(rootReducer);
  return { store };
};

export default storeCreator;
