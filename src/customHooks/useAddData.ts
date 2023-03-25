import { useState } from 'react';

interface IApiAddDataState {
  loading: boolean;
  result: null | any;
  error: string;
}

interface IUseAddDataReturnType {
  addDataApiCall: (addDataApiCallback: () => Promise<any>) => Promise<any>;
  state: IApiAddDataState;
}
export default function useAddData(
  addDataApiSuccessHandler: (response: any) => void,
  addDataApiErrorHandler: (error: any) => void,
  addDataApiFinalHandler: () => void
): IUseAddDataReturnType {
  const [apiAddDataState, setApiAddDataState] = useState<IApiAddDataState>({
    loading: false,
    result: null,
    error: ''
  });
  const addDataApiCall = async (addDataApiCallback: () => Promise<any>) => {
    setApiAddDataState({ loading: true, result: null, error: '' });
    try {
      const res = await addDataApiCallback();
      setApiAddDataState({ loading: false, result: res, error: '' });
      addDataApiSuccessHandler(res);
    } catch (error: any) {
      if (typeof error === 'string') {
        setApiAddDataState({ loading: false, result: null, error });
      } else {
        setApiAddDataState({ loading: false, result: null, error: '' });
      }
      addDataApiErrorHandler(error);
    } finally {
      addDataApiFinalHandler && addDataApiFinalHandler();
    }
  };

  return { addDataApiCall, state: apiAddDataState };
}
