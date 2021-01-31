import React from 'react';
import './App.css';
import SnackBarFeedback from './components/SnackBarFeedback';
import Transactions from './components/Transactions';
import TransactionSummary from './components/TransactionSummary';
import QuoteAndAddIcon from './components/QuoteAndAddIcon'
import Header from './components/Header';
// import Fab from '@material-ui/core/Fab';
// import AddIcon from '@material-ui/icons/Add';
import UpcomingFeature from './components/UpcomingFeature';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <Switch >
        
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
        <Route path="/">
          <div style={{ marginTop: '60px' }}>
            <TransactionSummary />
            <QuoteAndAddIcon />
            <Transactions />
            <SnackBarFeedback />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
