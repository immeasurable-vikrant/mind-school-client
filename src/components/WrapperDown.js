import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import wrapper from '../../public/assets/images/undraw.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  }
}));

const WrapperDown = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <img alt='rtyu' src={wrapper} width='100%' />
        </Grid>
      </Grid>
    </div>
  );
};

export default WrapperDown;
