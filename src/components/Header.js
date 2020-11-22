import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { userInfo } from '../actions';
import getIn from '../utility/getIn';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Menu
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: 'transparent',
    color: 'black',
    boxShadow: '0px 0px 0px 0px'
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  sectionDesktop: {
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {}
  }
}));

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
        <Button onClick={() => history.push('/signin')}>Login</Button>
        <Button
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
        <AppBar position='sticky' className={classes.header}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            {/* <Toolbar> */}
            <Link style={{ textDecoration: 'none' }} to='/'>
              <Typography className={classes.title} variant='h4' noWrap>
                Silence
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
