import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn, userInfo } from '../actions';

const SocialGoogle = ({ fetchSignIn, fetchUserInfo }) => {
  const history = useHistory();

  const { token } = useParams();

  useEffect(() => {
    localStorage.setItem('token', token);
    fetchSignIn();
    fetchUserInfo();
    history.push('/');
  }, []);

  return (
    <div>
      <h2>HELLLO FUCKER</h2>
    </div>
  );
};

SocialGoogle.propTypes = {
  location: PropTypes.object,
  fetchUserInfo: PropTypes.func,
  fetchSignIn: PropTypes.func
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSignIn: () => dispatch(signIn()),
    fetchUserInfo: () => dispatch(userInfo())
  };
};

export default withRouter(connect(null, mapDispatchToProps)(SocialGoogle));
