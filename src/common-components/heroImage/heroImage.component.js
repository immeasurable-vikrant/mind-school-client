/** @format */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userInfo } from '../../actions';
import getIn from '../../utility/getIn';
import './heroImage.styles.scss';

const HeroImage = ({
  auth,
  fetchUserInfo,
  heading,
  subHeading,
  description,
}) => {
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <section className='top-banner-section'>
      <div className='banner-image-div'>
        <img
          className='banner-image'
          src='https://source.unsplash.com/random'
          alt='Banner Image'
        />
      </div>
      <div className='banner-overlay-div'></div>
      <div className='banner-text-div'>
        <span className='banner-text'>
          <p className='banner-h1-text'>
            {heading} {auth}
          </p>
          <p className='banner-h1-text'>{subHeading}</p>
          <p className='banner-body-text'>{description}</p>
          <p className='banner-btn'>
            <a className='banner-btn-item' href='https://www.cambermast.com'>
              Get started &#8594;
            </a>
          </p>
        </span>
      </div>
    </section>
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
