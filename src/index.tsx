import { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Loader from 'components/Loader';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import storeCreator from './reducers/index';
const { store, persistor } = storeCreator();

export default store;

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </MuiPickersUtilsProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
