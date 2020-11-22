import React, { Fragment } from 'react';
import { CssBaseline, Container } from '@material-ui/core';
import Header from './Header';
import HomePage from './HomePage';
import Footer from './Footer';
import Wrapper from './Wrapper';
import WrapperDown from './WrapperDown';

const App = () => {
  return (
    <Fragment>
      <Header />
      <Wrapper />
      <CssBaseline />
      <Container maxWidth='md'>
        <HomePage style={{ backgroundColor: 'green', height: '100vh' }} />
      </Container>
      <WrapperDown />
      <Footer />
    </Fragment>
  );
};
export default App;
