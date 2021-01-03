import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userInfo } from '../actions';
import getIn from '../utility/getIn';
import { Button } from '@material-ui/core';

const Checkout = ({ auth, fetchUserInfo }) => {
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const goToRazorPay = () => {};

  return (
    <div>
      <div
        style={{
          flex: 'display',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button onClick={goToRazorPay}>
          Buy The Fucking Course from razorPay
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const auth = getIn(state, ['auth', 'user', 'profile', 'name']);
  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserInfo: () => {
      return dispatch(userInfo());
    },
  };
};

Checkout.propTypes = {
  logged: PropTypes.bool,
  auth: PropTypes.string,
  fetchUserInfo: PropTypes.func,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Checkout),
);
