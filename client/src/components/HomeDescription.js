import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import mind from '../../public/assets/images/mind.jpg';
import mindful from '../../public/assets/images/mindful.jpg';
import undraw from '../../public/assets/images/undraw.png';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItmes: 'center',
    padding: '16px'
  },
  typography: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '25px',
    color: 'darkgray'
  }
}));

export default function NestedGrid() {
  const classes = useStyles();

  function FormRow() {
    return (
      <Fragment>
        <Grid item xs={12} sm={4} lg={4}>
          <img alt='rtyu' src={mindful} width='100%' />
          <Typography align='center' variant='h5' gutterBottom>
            Learn a mindful Approach
          </Typography>
          <Typography
            className={classes.typography}
            align='center'
            variant='body1'
            gutterBottom>
            Explore guided exercises, videos, and more to help you get healthier
            and happier.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <img alt='rtyu' src={mind} width='100%' />
          <Typography align='center' variant='h5' gutterBottom>
            Immeasurable loves science
          </Typography>
          <Typography
            className={classes.typography}
            align='center'
            variant='body1'
            gutterBottom>
            Just 10 days of Headspace can increase happiness by 16%.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <img alt='rtyu' src={undraw} width='100%' />
          <Typography align='center' variant='h5' gutterBottom>
            Join over 60 million
          </Typography>
          <Typography
            className={classes.typography}
            align='center'
            variant='body1'
            gutterBottom>
            Explore guided exercises, videos, and more to help you get healthier
            and happier.
          </Typography>
        </Grid>
      </Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={2}>
          <FormRow />
        </Grid>
      </Grid>
    </div>
  );
}
