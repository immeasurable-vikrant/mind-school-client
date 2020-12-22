/** @format */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { userInfo } from '../actions';
import getIn from '../utility/getIn';
//material-ui imports
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  Button
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SchoolIcon from '@material-ui/icons/School';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  header: {
    backgroundColor: '#FBFCFC',
    color: 'black',
    boxShadow: '0 4px 12px rgba(0,0,0,.08) ',
    position: 'unset'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  login: {
    color: '#8E44AD',
    border: '1px solid #8E44AD',
    borderRadius: '10px',
    backgroundColor: 'white',
    margin: '5px'
  },
  title: {
    display: 'none',
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
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    border: '1px solid #616A6B',
    borderRadius: '8px',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
}));

const Header = withRouter(({ logged }) => {
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // const handleProfileMenuOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem
        onClick={() => {
          history.push('/view-courses');
        }}>
        <IconButton aria-label='show 11 my courses' color='inherit'>
          <SchoolIcon />
        </IconButton>
        <p>My Courses</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push('/signout');
        }}>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

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
        <IconButton aria-label='show 11 my courses' color='inherit'>
          <SchoolIcon />
        </IconButton>
        <p>My Courses</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push('/list-cart');
        }}>
        <IconButton aria-label='show 11 new cart' color='inherit'>
          <Badge badgeContent={11} color='secondary'>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          history.push('/signout');
        }}>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  const renderProfilePic = () => {
    return (
      logged && (
        <Fragment>
          <div className={classes.sectionDesktop}>
            <IconButton
              onClick={() => {
                history.push('/list-cart');
              }}
              aria-label='show 17 new cart'
              color='inherit'>
              <Badge badgeContent={17} color='secondary'>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              aria-label=' user profile'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'>
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'>
              <AccountCircle />
            </IconButton>
          </div>
        </Fragment>
      )
    );
  };

  const renderLogin = () => {
    return (
      <Fragment>
        <div className={classes.sectionMobile}>
          <div style={{width:'100%'}}>
            <Button
              className={classes.login}
              variant='contained'
              onClick={() => history.push('/signin')}>
              Sign In
            </Button>
          </div>
        </div>
        <div className={classes.sectionDesktop}>
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
        </div>
      </Fragment>
    );
  };

  const renderNav = () => {
    return (
      <div className={classes.grow}>
        <AppBar position='static' className={classes.header}>
          <Toolbar>
            <Typography className={classes.title} variant='h6' noWrap>
              Immeasurable
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Search…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <div className={classes.grow} />
            {!logged ? renderProfilePic() : renderLogin()}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
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
