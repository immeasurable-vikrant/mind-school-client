/** @format */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import supportTeam from '../../public/assets/images/clock.png';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  text: {
    fontStyle: 'helvetica',
    fontSize: '24px',
    lineHeight: '29px',
    color: '#3c3b37',
    fontWeight: '700',
    marginTop: '22px',
    marginBottom: '54px',
    textAlign: 'center'
  },
  div: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  typoGraphy1: {
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#3c3b37',
    marginTop: '0',
    marginBotom: '0.4rem'
  },
  typoGraphy2: {
    marginBottom: '2.4rem',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '22px',
    color: '#3c3b37'
  },
  straightLine: {
    width: '100%',
    border: '1px solid #3c3b37'
  }
}));

const WhyLearn = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1 className={classes.text}>Why Learn on Immeasurable?</h1>
      <Grid container spacing={3}>
        <div className={classes.div}>
          <Grid item xs={2}>
            <img alt='rtyu' src={supportTeam} width='42px' height='42px' />
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.typoGraphy1}>
              Go at your own pace
            </Typography>
            <Typography className={classes.typoGraphy2}>
              Enjoy lifetime access to courses on Udemy’s website and app.
            </Typography>
          </Grid>
        </div>
        <div className={classes.div}>
          <Grid item xs={2}>
            <img alt='rtyu' src={supportTeam} width='42px' height='42px' />
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.typoGraphy1}>
              Go at your own pace
            </Typography>
            <Typography className={classes.typoGraphy2}>
              Enjoy lifetime access to courses on Udemy’s website and app.
            </Typography>
          </Grid>
        </div>
        <div className={classes.div}>
          <Grid item xs={2}>
            <img alt='rtyu' src={supportTeam} width='42px' height='42px' />
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.typoGraphy1}>
              Go at your own pace
            </Typography>
            <Typography className={classes.typoGraphy2}>
              Enjoy lifetime access to courses on Udemy’s website and app.
            </Typography>
          </Grid>
        </div>
      </Grid>
      <hr />
    </div>
  );
};

export default WhyLearn;
