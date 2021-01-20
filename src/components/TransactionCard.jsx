import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Transactions from './Transactions';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    display: "flex",
    padding: 10
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  // pos: {
  //   marginBottom: 12,
  // },
});

export default function TransactionCard({heading, amount}) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
         {heading}
        </Typography>
        <Typography variant="h5" component="h2">
          {amount}
        </Typography>
        {/* <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
     
    </Card>
  );
}
