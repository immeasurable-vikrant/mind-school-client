/** @format */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import supportTeam from '../../public/assets/images/undraw.png';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  text: {
    textTransform: 'uppercase',
    fontSize: '2.2rem',
    fontWeight: 'bold',
    marginTop: '100px',
    marginBottom: '54px',
    textAlign: 'center'
  },
  div: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '40px',
    maxHeight: '350px'
  }
}));

const WrapperDown = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1 className={classes.text}>WHAT YOU CAN GET BY JOINING IMMEASURABLE</h1>
      <Grid container spacing={3}>
        <div className={classes.div}>
          <Grid item xs={6}>
            <img alt='rtyu' src={supportTeam} width='100%' height='300px' />
          </Grid>
          <Grid item xs={6}>
            <Typography>
              Our comprehensive courses have 300+ hours (and counting) of
              lessons available 24/7. You’ll learn everything from beginner
              programming fundamentals to the most advanced concepts.
            </Typography>
          </Grid>
        </div>
        <Grid item xs={6}>
          <Typography>
            Our comprehensive courses have 300+ hours (and counting) of lessons
            available 24/7. You’ll learn everything from beginner programming
            fundamentals to the most advanced concepts.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <img alt='rtyu' src={supportTeam} width='100%' height='300px' />
        </Grid>
        <Grid item xs={6}>
          <img alt='rtyu' src={supportTeam} width='100%' height='300px' />
        </Grid>
        <Grid item xs={6}>
          <Typography>
            Our comprehensive courses have 300+ hours (and counting) of lessons
            available 24/7. You’ll learn everything from beginner programming
            fundamentals to the most advanced concepts.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default WrapperDown;
