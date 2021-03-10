import React, { Suspense, lazy } from 'react';
import SnackBarFeedback from './components/SnackBarFeedback';
import Transactions from './components/Transactions';
import TransactionSummaryAndAdd from './components/TransactionSummaryAndAdd';
import Login from './components/Login';
import Header from './components/Header';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Loader from './components/Loader';
import TransactionCategory from './components/TransactionCategory';
import { useSelector } from "react-redux";
import './App.css';
import TransactionAnalysisPage from 'components/TransactionAnalysis';

const UpcomingFeature = lazy(() => import('./components/UpcomingFeature'));

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
              <UpcomingFeature />
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
                {/*<div className="quote-and-add-icon">*/}
                {/*  <Quote/>*/}
                {/*  <AddTransaction userId={userId}/>*/}
                {/*</div>*/}
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