import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import { ROUTES } from '@moneytracker/common/src/Constants';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faChartBar,
  faSignOutAlt,
  faFilter,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import LoginPage from '@moneytracker/common/src/pages/LoginPage';
import { AddTransactionButton } from '@moneytracker/common/src/components/AddTransactionButton';
import { OthersPage } from '@moneytracker/common/src/pages/OthersPage';
import { History } from '@moneytracker/common/src/pages/History';
library.add(faHome, faChartBar, faSignOutAlt, faFilter, faPlus);
const HomePage = lazy(() => import('@moneytracker/common/src/pages/HomePage'));
const UpcomingFeaturePage = lazy(() => import('@moneytracker/common/src/pages/UpcomingFeaturePage'));
const TransactionAnalysisPage = lazy(
  () => import('@moneytracker/common/src/pages/TransactionAnalysisPage')
);
const TransactionCategoriesPage = lazy(
  () => import('@moneytracker/common/src/pages/TransactionCategoriesPage')
);
const BankAccountsPage = lazy(() => import('@moneytracker/common/src/pages/BankAccountsPage'));
const CreditCardsPage = lazy(() => import('@moneytracker/common/src/pages/CreditCardsPage'));
const SnackBarFeedback = lazy(() => import('@moneytracker/common/src/components/FeedBack'));
const Header = lazy(() => import('@moneytracker/common/src/components/Header'));
const FixedBottomNavBar = lazy(() => import('@moneytracker/common/src/components/FixedBottomNavBar'));
import { useRouter as useNextRouter } from 'next/router';
function App() {
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username);
  const router = useNextRouter();
  const currentPath = router.pathname;
  console.log({currentPath});
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
          <Route path={ROUTES.CREDIT_CARDS}>
            <CreditCardsPage userId={userId} />
          </Route>
          <Route path={ROUTES.HOME}>
            <HomePage userId={userId} />
          </Route>
        </Switch>
        <FixedBottomNavBar userId={userId} />
        <SnackBarFeedback />
      </Header>
    </Router>
  );
}

export default App;
