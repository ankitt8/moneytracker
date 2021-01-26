import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { OFFLINE_ERROR } from '../Constants';
import { useSelector } from 'react-redux';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SnackBarFeedback() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const status = useSelector((state) => state.transactions.status);
  const { addTransaction, editTransaction, deleteTransaction } = status;
  let { severity, msg } = status;
  useEffect(() => {
    if (addTransaction !== null || editTransaction !== null || deleteTransaction !== null) {
      setOpen(true);
    }
  }, [addTransaction, deleteTransaction, editTransaction, status]);
  if (navigator.onLine === false) {
    msg = OFFLINE_ERROR;
    severity = 'error';
  }

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
