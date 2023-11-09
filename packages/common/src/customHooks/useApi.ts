import { useState } from 'react';

interface IApiAddDataState {
  loading: boolean;
  result: null | any;
  error: string;
}

interface IUseAddDataReturnType {
  apiCall: (addDataApiCallback: () => Promise<any>) => Promise<any>;
  state: IApiAddDataState;
}
export default function useApi(
  addDataApiSuccessHandler: (response: any) => void,
  addDataApiErrorHandler?: (error: any) => void,
  addDataApiFinalHandler?: () => void
): IUseAddDataReturnType {
  const [apiAddDataState, setApiAddDataState] = useState<IApiAddDataState>({
    loading: false,
    result: null,
    error: ''
  });
  const apiCall = async (addDataApiCallback: () => Promise<any>) => {
    setApiAddDataState({ loading: true, result: null, error: '' });
    try {
      const res = await addDataApiCallback();
      console.log({res})
      setApiAddDataState({ loading: false, result: res, error: '' });
      addDataApiSuccessHandler && addDataApiSuccessHandler(res);
    } catch (error: any) {
      console.log(error)
      if (typeof error === 'string') {
        setApiAddDataState({ loading: false, result: null, error });
      } else {
        setApiAddDataState({ loading: false, result: null, error: '' });
      }
      addDataApiErrorHandler && addDataApiErrorHandler(error);
    } finally {
      addDataApiFinalHandler && addDataApiFinalHandler();
    }
  };

  return { apiCall, state: apiAddDataState };
}
