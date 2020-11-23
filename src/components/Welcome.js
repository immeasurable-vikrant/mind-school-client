import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMessage } from '../actions';
import Header from './Header';
import Footer from './Footer';

const Welcome = ({ message, getMessage }) => {
  useEffect(() => {
    return () => {
      getMessage();
    };
  }, []);
  return (
    <div>
      <Header />
      <div>{message}</div>
      <Footer />
    </div>
  );
};

Welcome.propTypes = {
  message: PropTypes.string,
  getMessage: PropTypes.func
};
const mapStateToProps = (state) => {
  return { message: state.auth.message };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMessage: () => dispatch(fetchMessage())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
