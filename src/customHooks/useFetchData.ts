import { useReducer, useEffect, useState } from 'react';
import { updateStatusAction } from 'actions/actionCreator';
import { SEVERITY_ERROR } from 'Constants';
import { useDispatch } from 'react-redux';
import { dataReducer, initialState, ACTION_TYPES } from 'reducers/DataReducer';

/**
 *
 * @param fetchCallback function which perform asyc operation and returns response
 * @param messageOnRejected message to show when fetch is rejected
 * @param actionToDispatchOnResolved action to be dispatched when fetch is resolved
 * @param fetchCallbackArgs argument taken by fetchCallback
 * @returns void
 */
const useFetchData = (
  fetchCallback: (userId: string) => any,
  messageOnRejected: string,
  actionToDispatchOnResolved: () => void,
  refetchData = null,
  ...fetchCallbackArgs: string[]
) => {
  const dispatch = useDispatch();
  const [fetchStatus, dataReducerDispatch] = useReducer(
    dataReducer,
    initialState
  );
  const [data, setData] = useState(null);

  const fetchData = async () => {
    dataReducerDispatch({
      type: ACTION_TYPES.FETCH_DATA_START
    });
    try {
      const data = await fetchCallback(...fetchCallbackArgs);
      // console.log(data);
      // const dataJson = await data.json();
      if (data?.error || data == null) {
        handleErrorCase();
        return;
      }
      setData(data);
      dataReducerDispatch({
        type: ACTION_TYPES.FETCH_DATA_RESOLVED
      });
      actionToDispatchOnResolved && dispatch(actionToDispatchOnResolved(data));
    } catch (e) {
      handleErrorCase(e);
    }
    function handleErrorCase(e) {
      console.log(e);
      dataReducerDispatch({
        type: ACTION_TYPES.FETCH_DATA_REJECTED
      });
      dispatch(
        updateStatusAction({
          showFeedBack: true,
          msg: messageOnRejected,
          severity: SEVERITY_ERROR
        })
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, [refetchData]);
  return { fetchStatus, data };
};

export default useFetchData;
