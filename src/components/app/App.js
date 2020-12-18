import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, Container } from '@material-ui/core';
import Header from '../Header';
import HomePage from '../HomePage';
import Footer from '../Footer';
import Wrapper from '../Wrapper';
import WhyLearn from '../WhyLearn';
import BecomeTeacher from '../BecomeTeacher';
// import WrapperDown from './WrapperDown';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '16px'
  }
}));

const App = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Header />
      <Wrapper />
      <CssBaseline />
      <Container maxWidth='md' className={classes.container}>
        <HomePage />
      </Container>
      <hr />
      <WhyLearn />
      <Container maxWidth='md' className={classes.container}>
        <HomePage />
      </Container>
      <hr />
      <BecomeTeacher />
      <Footer />
    </Fragment>
  );
};
export default App;
