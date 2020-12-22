import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions';

import Header from '../components/Header';
// import Footer from '../components/footer';

const SignOut = ({ logged, logOut }) => {
  const [showLogin, setShowLogin] = useState(false);
  const history = useHistory();

  // useEffect(() => {
  //     return () => {
  //         logOut()
  //     }
  // }, [])

  useMemo(() => {
    logOut();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin({ showLogin: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderLogin = () => {
    if (!logged) {
      if (showLogin) {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: 10
            }}>
            <button
              type='button'
              name='login'
              className='btn btn-lg btn-danger'
              onClick={(e) => {
                e.preventDefault();
                history.push('/signin');
              }}>
              Log back in here.
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div>
      <Header />
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            margin: 20,
            textAlign: 'center !important',
            verticalAlign: 'middle !important',
            display: 'inline-block'
          }}>
          <br />
          <p>Thank you for visiting Immeasurable!</p>
          <p>You have successfully logged out of your account.</p>
          <br />
        </div>
        <div>
          {renderLogin()}
          <p>&nbsp;</p>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

SignOut.propTypes = {
  logged: PropTypes.bool,
  logOut: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logout())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SignOut)
);
