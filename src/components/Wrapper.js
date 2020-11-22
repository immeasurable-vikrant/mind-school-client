import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { userInfo } from '../actions';
import getIn from '../utility/getIn';
import wrapper from '../../public/assets/images/stable.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  typography: {
    position: 'absolute',
    top: '100px',
    marginLeft: '32px',
    textAlign: 'center',
    color: 'darkGray',
    fontSize: '42px'
  }
}));

const Wrapper = ({ auth, fetchUserInfo }) => {
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <img alt='rtyu' src={wrapper} width='100%' />
          <Typography
            className={classes.typography}
            align='center'
            variant='body1'
            gutterBottom>
            Welcome {auth}!
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => {
  const auth = getIn(state, ['auth', 'user', 'profile', 'name']);
  return {
    auth
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserInfo: () => {
      return dispatch(userInfo());
    }
  };
};

Wrapper.propTypes = {
  logged: PropTypes.bool,
  auth: PropTypes.string,
  fetchUserInfo: PropTypes.func
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Wrapper)
);
