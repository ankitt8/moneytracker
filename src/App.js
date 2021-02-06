import React, {Suspense, lazy} from 'react';
import './App.css';
import SnackBarFeedback from './components/SnackBarFeedback';
import Transactions from "./components/Transactions";
import TransactionSummary from './components/TransactionSummary';
import QuoteAndAddIcon from './components/QuoteAndAddIcon';
import Login from './components/Login';
import Header from './components/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loader from "./components/Loader";
const UpcomingFeature = lazy(() => import('./components/UpcomingFeature'));

function App() {
  return (
    <Router>
      <Header />
      <Suspense fallback={<Loader />}>
        <Switch >
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/bankaccounts">
            <UpcomingFeature />
          </Route>
          <Route path="/investments">
            <UpcomingFeature />
          </Route>
          <Route path="/budget">
            <UpcomingFeature />
          </Route>
          <Route path="/analysis">
            <UpcomingFeature />
          </Route>
          <Route path="/food-tracker">
            <UpcomingFeature />
          </Route>
          <Route path="/">
            <>
              <TransactionSummary />
              <QuoteAndAddIcon />
              <Transactions />
              <SnackBarFeedback />
            </>
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
