/** @format */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userInfo } from '../../actions';
import getIn from '../../utility/getIn';
import './heroImage.styles.scss';

const HeroImage = ({ auth, fetchUserInfo }) => {
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className='hero-image' style={{ height: '100%' }}>
      <div className='hero-text'>
        <h1 className='hero-image-heading'>Canada Goose</h1>
        <p className='hero-image-para'>spring styles have arrived</p>
        <button>SHOP NOW</button>
      </div>
      <div className='hero-exclusions'>
        <p className='exclusions'>*click here for details</p>
      </div>
      <div id='popup1' className='overlay'>
        <div className='popup'>
          <a className='close' href='#'>
            &times;
          </a>
          <div className='content'>
            <h2>Promotional Information & Exclusions</h2>
            This is a list of exclusions
          </div>
        </div>
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

HeroImage.propTypes = {
  logged: PropTypes.bool,
  auth: PropTypes.string,
  fetchUserInfo: PropTypes.func,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeroImage),
);
