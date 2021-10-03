import { IAction } from "./interface";

export const ACTION_TYPES = {
  FETCH_DATA_START: "FETCH_DATA_START",
  FETCH_DATA_RESOLVED: "FETCH_DATA_RESOLVED",
  FETCH_DATA_REJECTED: "FETCH_DATA_REJECTED"
};
export const FETCH_STATES = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED"
};
export const initialState = {
  fetching: FETCH_STATES.IDLE
};
export const dataReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_DATA_START: {
      return {
        ...state,
        fetching: FETCH_STATES.PENDING
      };
    }
    case ACTION_TYPES.FETCH_DATA_RESOLVED: {
      return {
        ...state,
        fetching: FETCH_STATES.RESOLVED
      };
    }
    case ACTION_TYPES.FETCH_DATA_REJECTED: {
      return {
        ...state,
        fetching: FETCH_STATES.REJECTED
      };
    }
    default:
      return state;
  }
};
