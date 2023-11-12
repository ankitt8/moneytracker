import React from 'react';
import { Provider } from 'react-redux';
import Loader from './components/Loader';
import { Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import storeCreator from './reducers';
const { store } = storeCreator();
export default function AppProvider({
  children
}: {
  children: React.ReactElement;
}): JSX.Element {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </Provider>
    </ErrorBoundary>
  );
}
