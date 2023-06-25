import React from 'react';
import { Provider } from 'react-redux';
import Loader from './components/Loader';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Suspense } from 'react';
import { ErrorBoundary } from '@moneytracker/common/src/components/ErrorBoundary';
import { PersistGate } from 'redux-persist/integration/react';
import storeCreator from './reducers';
const { store, persistor } = storeCreator();
export default function AppProvider({
  children
}: {
  children: React.ReactChildren;
}) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Suspense fallback={<Loader />}>{children}</Suspense>
          </MuiPickersUtilsProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
