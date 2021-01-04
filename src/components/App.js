/** @format */

import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, Container } from '@material-ui/core';
import HomePage from './HomePage';
import HomePageSecondary from './HomePageSecondary';
// import Wrapper from './Wrapper';
import HeroImage from '../common-components/heroImage/heroImage.component';
import WhyLearn from './whyLearn/index';
import BecomeTeacher from './BecomeTeacher';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '16px',
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <HeroImage />
      {/* <Wrapper /> */}
      <CssBaseline />
      <Container maxWidth='md' className={classes.container}>
        <HomePage />
      </Container>
      <hr />
      <WhyLearn />
      <Container maxWidth='md' className={classes.container}>
        <HomePageSecondary />
      </Container>
      <hr />
      <BecomeTeacher />
    </Fragment>
  );
};
export default App;
