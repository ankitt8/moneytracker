import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import SnackBarFeedback from "components/FeedBack";
import HomePage from "pages/HomePage";
import LoginPage from "pages/LoginPage";
import Header from "components/Header";
import Loader from "components/Loader";
import FixedBottomNavBar from "components/FixedBottomNavBar";
import { ROUTES } from "Constants";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faChartBar,
  faSignOutAlt,
  faFilter,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
library.add(faHome, faChartBar, faSignOutAlt, faFilter, faPlus);

const UpcomingFeaturePage = lazy(() => import("pages/UpcomingFeaturePage"));
const TransactionAnalysisPage = lazy(() =>
  import("pages/TransactionAnalysisPage")
);
const TransactionCategoriesPage = lazy(() =>
  import("pages/TransactionCategoriesPage")
);
const BankAccountsPage = lazy(() => import("pages/BankAccountsPage"));

function App() {
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username);
  if (userId === "") {
    return <LoginPage />;
  }
  return (
    <Router>
      <Header username={username}>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path={ROUTES.LOGIN}>
              <LoginPage />
            </Route>
            <Route path={ROUTES.TRANSACTION_CATEGORIES}>
              <div>
                <TransactionCategoriesPage userId={userId} />
                <SnackBarFeedback />
              </div>
            </Route>
            <Route path={ROUTES.BANK}>
              <BankAccountsPage />
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
                <SnackBarFeedback />
              </>
            </Route>
            <Route path={ROUTES.FOOD_TRACKER}>
              <UpcomingFeaturePage />
            </Route>
            <Route path={ROUTES.HOME}>
              <HomePage userId={userId} />
            </Route>
          </Switch>
        </Suspense>
        <FixedBottomNavBar userId={userId} />
      </Header>
    </Router>
  );
}

export default App;
