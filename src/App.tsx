import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import { ROUTES } from 'Constants';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faChartBar,
  faSignOutAlt,
  faFilter,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import LoginPage from 'pages/LoginPage';
import { AddTransactionButton } from 'components/AddTransactionButton';
import { OthersPage } from 'pages/OthersPage';
import { History } from 'pages/History';
library.add(faHome, faChartBar, faSignOutAlt, faFilter, faPlus);
console.log('test');
const HomePage = lazy(() => import('pages/HomePage'));
const UpcomingFeaturePage = lazy(() => import('pages/UpcomingFeaturePage'));
const TransactionAnalysisPage = lazy(
  () => import('pages/TransactionAnalysisPage')
);
const TransactionCategoriesPage = lazy(
  () => import('pages/TransactionCategoriesPage')
);
const BankAccountsPage = lazy(() => import('pages/BankAccountsPage'));
const SnackBarFeedback = lazy(() => import('components/FeedBack'));
const Header = lazy(() => import('components/Header'));
const FixedBottomNavBar = lazy(() => import('components/FixedBottomNavBar'));

function App() {
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username);
  if (userId === '') {
    return <LoginPage />;
  }
  window.userId = userId;
  return (
    <Router>
      <Header username={username}>
        <Switch>
          <Route path={ROUTES.LOGIN}>
            <LoginPage />
          </Route>
          <Route path={ROUTES.TRANSACTION_CATEGORIES}>
            <div>
              <TransactionCategoriesPage userId={userId} />
            </div>
          </Route>
          <Route path={ROUTES.BANK}>
            <BankAccountsPage userId={userId} />
          </Route>
          <Route path={ROUTES.INVESTMENT}>
            <UpcomingFeaturePage />
          </Route>
          <Route path={ROUTES.BUDGET}>
            <UpcomingFeaturePage />
          </Route>
          <Route path={ROUTES.SPEND_ANALYSIS}>
            <>
              <TransactionAnalysisPage userId={userId} />
            </>
          </Route>
          <Route path={ROUTES.FOOD_TRACKER}>
            <UpcomingFeaturePage />
          </Route>
          <Route path={ROUTES.OTHERS}>
            <OthersPage />
          </Route>
          <Route path={ROUTES.HISTORY}>
            <History userId={userId} />
          </Route>
          <Route path={ROUTES.HOME}>
            <HomePage userId={userId} />
          </Route>
        </Switch>
        <FixedBottomNavBar userId={userId} />
        <SnackBarFeedback />
      </Header>
      <AddTransactionButton userId={userId} />
    </Router>
  );
}

export default App;
