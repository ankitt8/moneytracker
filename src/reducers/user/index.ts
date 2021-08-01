import { Action } from "reducers/transactions/interface";
import { UserStoreInitialState } from "./interface";

const initialState: UserStoreInitialState = {
  userId: "",
  username: "",
};
const user = (
  state: UserStoreInitialState = initialState,
  action: Action
): UserStoreInitialState => {
  switch (action.type) {
    case "USER_AUTHENTICATED": {
      const { userId, username } = action.payload;
      return {
        ...state,
        userId,
        username,
      };
    }
    default:
      return state;
  }
};

export default user;
