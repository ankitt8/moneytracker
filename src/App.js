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
import {useSelector} from "react-redux";
const UpcomingFeature = lazy(() => import('./components/UpcomingFeature'));
function App() {
  const userId = useSelector((state) => state.user.userId);
  const username = useSelector((state) => state.user.username)
  if(userId === '') {
    return <Login />
  }
  return (
      <Router>
        <Header username={ username }/>
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

              <div className="desktop-view">
                <TransactionSummary/>
                <QuoteAndAddIcon userId={userId}/>
                <Transactions userId={userId}/>
                <SnackBarFeedback/>
              </div>

            </Route>
          </Switch>
        </Suspense>
      </Router>
  );
}

export default App;
