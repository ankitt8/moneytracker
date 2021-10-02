import React, { useReducer, useEffect } from "react";
import { updateStatusAction } from "actions/actionCreator";
import { SEVERITY_ERROR } from "Constants";
import { useDispatch } from "react-redux";
import {
  apiStatusReducer,
  initialState,
  ACTION_TYPES,
} from "reactReducers/apiStatus";

/**
 *
 * @param fetchCallback function which perform asyc operation and returns response
 * @param messageOnRejected message to show when fetch is rejected
 * @param actionToDispatchOnResolved action to be dispatched when fetch is resolved
 * @param args argument taken by fetchCallback
 * @returns void
 */
const useFetchData = (
  fetchCallback: Function,
  messageOnRejected: string,
  actionToDispatchOnResolved: Function,
  ...args: string[]
) => {
  const dispatch = useDispatch();
  const [state, dataReducerDispatch] = useReducer(
    apiStatusReducer,
    initialState
  );

  const fetchData = async () => {
    dataReducerDispatch({
      type: ACTION_TYPES.FETCH_DATA_START,
    });
    const data = await fetchCallback(...args);
    if (data === null) {
      dataReducerDispatch({
        type: ACTION_TYPES.FETCH_DATA_REJECTED,
      });
      dispatch(
        updateStatusAction({
          showFeedBack: true,
          msg: messageOnRejected,
          severity: SEVERITY_ERROR,
        })
      );
    } else {
      dataReducerDispatch({
        type: ACTION_TYPES.FETCH_DATA_RESOLVED,
      });
      dispatch(actionToDispatchOnResolved(data));
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return state;
};

export default useFetchData;
