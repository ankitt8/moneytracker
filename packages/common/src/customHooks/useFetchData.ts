import { useReducer, useEffect, useState } from 'react';
import { updateStatusAction } from '@moneytracker/common/src/actions/actionCreator';
import { SEVERITY_ERROR } from '@moneytracker/common/src/Constants';
import { useDispatch } from 'react-redux';
import {
  dataReducer,
  initialState,
  ACTION_TYPES
} from '@moneytracker/common/src/reducers/DataReducer';

/**
 *
 * @param fetchCallback function which perform asyc operation and returns response
 * @param messageOnRejected message to show when fetch is rejected
 * @param actionToDispatchOnResolved action to be dispatched when fetch is resolved
 * @param refetchData
 * @param handleFetchResponse
 * @param fetchCallbackArgs argument taken by fetchCallback
 * @returns void
 */
const useFetchData = (
  fetchCallback: (userId: string) => Promise<any>,
  messageOnRejected: string,
  actionToDispatchOnResolved: () => { type: string; payload: any },
  refetchData = null,
  handleFetchResponse: (data: any) => Promise<any>,
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
      if (data?.error || data == null) {
        handleErrorCase();
        return;
      }
      setData(data);
      if (handleFetchResponse) await handleFetchResponse(data);
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
