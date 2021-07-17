import { IAction } from "./interface"

export const FETCHING_STATES = {
    IDLE: "IDLE",
    PENDING: "PENDING",
    RESOLVED: "RESOLVED",
    REJECTED: "REJECTED"
}
export const fetchingStatusInitialState = {
    fetching: FETCHING_STATES.IDLE,
}
export const fetchingStatusReducer = (state = fetchingStatusInitialState, action: IAction) => {
    switch(action.type) {
        case FETCHING_STATES.PENDING: {
            return {
                ...state,
                fetching: FETCHING_STATES.PENDING
            }
        }
        case FETCHING_STATES.RESOLVED: {
            return {
                ...state,
                fetching: FETCHING_STATES.RESOLVED,
                // data: action.payload.data
            }
        }
        case FETCHING_STATES.REJECTED: {
            return {
                ...state,
                fetching: FETCHING_STATES.REJECTED,
                // error: action.payload.error
            }
        }
        default: return state;
    }
}