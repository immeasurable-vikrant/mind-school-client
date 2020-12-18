import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { userInfo } from '../actions';
import {useStyles } from './useStyles'
import getIn from '../utility/getIn';
import {
  AppBar,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Menu
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

const Header = withRouter(({ logged }) => {
  const history = useHistory();
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem
        onClick={() => {
          history.push('/view-courses');
        }}>
        <IconButton aria-label='show 4 new mails' color='inherit'></IconButton>
        <p>My Courses</p>
      </MenuItem>

      <MenuItem
        onClick={() => {
          history.push('/search-results');
        }}>
        <p>Search Courses</p>
      </MenuItem>

      <MenuItem
        onClick={() => {
          history.push('/list-cart');
        }}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'></IconButton>
        <p>My Cart</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push('/help');
        }}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'></IconButton>
        <p>Help</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push('/signout');
        }}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'></IconButton>
        <p>Sign Out</p>
      </MenuItem>
    </Menu>
  );

  const renderProfilePic = () => {
    return (
      logged && (
        <Fragment>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label=' user profile'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'>
              <AccountCircle />
            </IconButton>
          </div>
          {renderMobileMenu}
        </Fragment>
      )
    );
  };

  const renderLogin = () => {
    return (
      <Fragment>
        <Button
          className={classes.login}
          variant='contained'
          onClick={() => history.push('/signin')}>
          Sign In
        </Button>
        <Button
        variant='contained'
          className={classes.login}
          onClick={() => {
            history.push('/signup');
          }}>
          Sign Up
        </Button>
      </Fragment>
    );
  };

  const renderNav = () => {
    return (
      <div className={classes.grow}>
        <AppBar className={classes.header}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '24px'
            }}>
            <Link style={{ textDecoration: 'none' }} to='/'>
              <Typography className={classes.title} variant='h6' noWrap>
                immeasurable
              </Typography>
            </Link>
            <div>{logged ? renderProfilePic() : renderLogin()}</div>
          </div>
        </AppBar>
      </div>
    );
  };

  return <div className='App'>{renderNav()}</div>;
});

const mapStateToProps = (state) => {
  const auth = getIn(state, ['auth']);
  const { logged, user } = auth;
  return {
    logged,
    user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserInfo: () => {
      return dispatch(userInfo());
    }
  };
};

Header.propTypes = {
  logged: PropTypes.bool
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
