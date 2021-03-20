import React, { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import SnackBarFeedback from 'components/SnackBarFeedback';
import Transactions from 'components/Transactions';
import TransactionSummaryAndAdd from 'components/TransactionSummaryAndAdd';
import Login from 'components/Login';
import Header from 'components/Header';
import Loader from 'components/Loader';
import FixedBottomNavBar from 'components/FixedBottomNavBar';
import { ROUTES } from 'Constants';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faChartBar, faSignOutAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
library.add(faHome, faChartBar, faSignOutAlt, faFilter);

const UpcomingFeature = lazy(() => import('components/UpcomingFeature'));
const TransactionAnalysisPage = lazy(() => import('components/TransactionAnalysis'));
const TransactionCategoriesPage = lazy(() => import('components/TransactionCategories'));
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
      <FixedBottomNavBar />
      <Suspense fallback={<Loader />}>
        <Switch >
          <Route path={ROUTES.LOGIN}>
            <Login />
          </Route>
          <Route path={ROUTES.TRANSACTION_CATEGORIES}>
            <div className='desktop-view'>
              <TransactionCategoriesPage />
              <SnackBarFeedback />
            </div>
          </Route>
          <Route path={ROUTES.BANK}>
            <BankAccountPage />
          </Route>
          <Route path={ROUTES.INVESTMENT}>
            <UpcomingFeature />
          </Route>
          <Route path={ROUTES.BUDGET}>
            <UpcomingFeature />
          </Route>
          <Route path={ROUTES.SPEND_ANALYSIS}>
            <div className='desktop-view'>
              <TransactionAnalysisPage />
            </div>
          </Route>
          <Route path={ROUTES.FOOD_TRACKER}>
            <UpcomingFeature />
          </Route>
          <Route path={ROUTES.HOME}>
            <div className='desktop-view'>
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