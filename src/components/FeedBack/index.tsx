import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { OFFLINE_ERROR, SEVERITY_ERROR } from 'Constants';
import { useSelector } from 'react-redux';
import { updateStatusAction } from 'actions/actionCreator';
import styles from './style.module.scss';

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBarFeedback() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  // @ts-ignore
  const status = useSelector((state) => state.transactions.status);
  let { severity, msg } = status;

  useEffect(() => {
    const { showFeedback } = status;
    if (showFeedback !== null) {
      setOpen(true);
    }
  }, [status]);

  // if msg is null the component will not be mounted
  if (msg === null) return null;

  if (navigator.onLine === false) {
    msg = OFFLINE_ERROR;
    severity = SEVERITY_ERROR;
  }

  function handleClose() {
    setOpen(false);
    // the below code sets everythin gto null
    //  so that when page is changed the Snackbar feedback 
    //  doesn't render with the existing messages
    // want to make severity null but it require some props
    //  anyways is msg is empty string then nothing will be shown;;
    dispatch(updateStatusAction({
      showFeedback: null,
      msg: null,
      severity: null,
    }));
  };

  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <div className={styles.feedBackWrapper}>
        <Alert onClose={handleClose} severity={severity}>
          {msg}
        </Alert>
      </div>
    </Snackbar>
  );
}
