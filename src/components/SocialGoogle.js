/** @format */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn, userInfo } from '../actions';

const SocialGoogle = ({ fetchSignIn, fetchUserInfo, location }) => {
  const history = useHistory();
  

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const setToken = params.get('token')
    localStorage.setItem('token', setToken)
    fetchSignIn();
    fetchUserInfo();
    history.push('/');
  }, []);

  return <div />

};

SocialGoogle.propTypes = {
  location: PropTypes.object,
  fetchUserInfo: PropTypes.func,
  fetchSignIn: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSignIn: () => dispatch(signIn()),
    fetchUserInfo: () => dispatch(userInfo()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(SocialGoogle));
