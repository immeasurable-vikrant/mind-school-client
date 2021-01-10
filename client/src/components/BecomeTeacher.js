/** @format */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '16px',
  },
  teachButton: {
    color: '#8E44AD',
    border: '1px solid #8E44AD',
    borderRadius: '10px',
    backgroundColor: 'white',
    margin: '5px',
  },
  text: {
    fontStyle: 'helvetica',
    fontSize: '32px',
    lineHeight: '38px',
    color: '#3c3b37',
    fontWeight: '700',
    margin: '24px',
    textAlign: 'center',
  },
  div: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '24px 16px',
  },
  typoGraphy: {
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '22px',
    color: '#3c3b37',
    marginTop: '0',
    marginBotom: '0.4rem',
  },
}));

const BecomeTeacher = () => {
  const classes = useStyles();
  const history = useHistory();
  const navigateToBecomeTeacherPage = () => history.push('/become-teacher');
  return (
    <div className={classes.root}>
      <h3 className={classes.text}>Become a teacher</h3>
      <Grid container spacing={3}>
        <div className={classes.div}>
          <Grid item xs={8}>
            <Typography className={classes.typoGraphy}>
              Top instructors from around the world teach millions of students
              on Udemy. We provide the tools and skills to teach what you love.
            </Typography>
          </Grid>
        </div>
      </Grid>
      <div className={classes.divButton}>
        <Button
          className={classes.teachButton}
          variant='contained'
          onClick={navigateToBecomeTeacherPage}>
          Start teaching today
        </Button>
      </div>
      <hr />
    </div>
  );
};

export default BecomeTeacher;
