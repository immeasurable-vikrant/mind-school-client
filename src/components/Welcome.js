import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMessage } from '../actions';

const Welcome = ({ message, getMessage }) => {
  useEffect(() => {
    return () => {
      getMessage();
    };
  }, []);
  return (
    <div>
      <div>{message}</div>
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
