import React, { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import SnackBarFeedback from 'components/SnackBarFeedback';
import Transactions from 'components/Transactions';
import TransactionSummaryAndAdd from 'components/TransactionSummaryAndAdd';
import Login from 'components/Login';
import Header from 'components/Header';
import Loader from 'components/Loader';
import TransactionCategory from 'components/TransactionCategory';

const UpcomingFeature = lazy(() => import('components/UpcomingFeature'));
const TransactionAnalysisPage = lazy(() => import('components/TransactionAnalysis'));
const BankAccountPage = lazy(() => import('components/BankAccounts'));

function App() {
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username)
  if (userId === '') {
    return <Login />
  }
  return (
      <Router>
        <Header username={username} />
        <Suspense fallback={<Loader />}>
          <Switch >
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/transaction-category">
              <div className='desktop-view'>
                <TransactionCategory />
                <SnackBarFeedback />
              </div>
            </Route>
            <Route path="/bankaccounts">
              <BankAccountPage />
            </Route>
            <Route path="/investments">
              <UpcomingFeature />
            </Route>
            <Route path="/budget">
              <UpcomingFeature />
            </Route>
            <Route path="/analysis">
              <div className='desktop-view'>
                <TransactionAnalysisPage />
              </div>
            </Route>
            <Route path="/food-tracker">
              <UpcomingFeature />
            </Route>
            <Route path="/">
              <div className="desktop-view">
                <TransactionSummaryAndAdd userId={userId} />
                <Transactions userId={userId} />
                <SnackBarFeedback />
              </div>
            </Route>
          </Switch>
        </Suspense>
      </Router>
  );
}

export default App;