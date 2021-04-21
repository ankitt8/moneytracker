import { TransactionsStoreInitialState } from "./transactions/interface";
import { UserStoreInitialState } from "./user/interface";

export interface ReduxStore {
  transactions: TransactionsStoreInitialState;
  user: UserStoreInitialState;
}