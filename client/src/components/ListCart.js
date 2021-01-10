/** @format */

//Libraries Import
import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  buyCourse,
  listCart,
  addCart,
  removeCart,
  payCart,
} from '../actions/cart';
import { userInfo } from '../actions';
//Config Import
import { hostUrl } from '../../config';
//Auth Import
import SignIn from '../auth/SignIn';

const numberWithCommas = (x) => {
  const parts = parseInt(x, 10).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '8px 16px',
  },
  rootCartSubtitle: {
    margin: '16px 0 8px',
  },
  cartTitle: {
    fontSize: '18px',
    fontWeight: '500',
    lineHeight: '22px',
    color: '#29303b',
    margin: '16px',
  },
  coursesCartPara: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '22px',
    margin: '0',
  },
  courseLength: {
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '22px',
    margin: '0 8px',
  },
  coursePrice: {
    fontSize: '22px',
    fontWeight: '600',
    lineHeight: '21px',
    color: '#000000',
  },
  removeFromCart: {
    fontSize: '15px',
    lineHeight: '22px',
    fontWeight: '500',
  },
  courseTitle: {
    fontSize: '17px',
    fontWeight: '700',
    lineHeight: '18px',
    color: '#29303b',
    margin: '4px 0',
  },
  courseSubTitle: {
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '19px',
    color: '#29303b',
    margin: '4px 0',
  },
  totalPrice: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '51px',
    color: '#29303b',
  },
  totalTitle: {
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '26px',
    color: '#29303b',
  },
  renderList: {
    margin: '30px',
  },
}));

const styles = {
  dialogRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  dialogContent: {
    position: 'relative',
    width: '80vw',
    transform: '',
  },
  dialogBody: {
    paddingBottom: 0,
  },
};

const ListCart = ({
  logged,
  user,
  courses,
  fetchBuyCourse,
  fetchUserInfo,
  fetchListCart,
  fetchAddCart,
  fetchRemoveCart,
  fetchPayCart,
}) => {
  const classes = useStyles();
  const [state, setState] = useState({
    open: false,
    total: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }
    fetchListCart();
  }, [fetchUserInfo, fetchListCart]);

  const combineTotal = (courses) => {
    if (courses) {
      if (courses.length > 0) {
        let amount = 0;
        courses.map((course) => (amount += course.price));
        setState({ total: amount });
      }
    }
  };

  // componentWillReceiveProps(nextProps) {
  //     if(nextProps !== this.props) {
  //         this.combineTotal(nextProps.courses);
  //     }
  // }

  //Hooks
  //Printing 1st iteration:
  useEffect(() => {
    combineTotal(courses);
  }, [courses]);

  //Skipping first iteration (exactly like componentWillReceiveProps):
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    combineTotal(courses);
  }, [courses]);

  const handleOpen = () => {
    setState({ open: true });
  };

  const handleClose = () => {
    setState({ open: false });
  };

  const onPayCart = () => {
    if (logged) {
      fetchPayCart(courses);
    } else {
      handleOpen();
    }
  };

  const onRemoveCart = (course_no) => {
    if (logged) {
      fetchRemoveCart(course_no);
    } else {
      handleOpen();
    }
  };

  const renderDialog = () => {
    return (
      <div>
        <Dialog
          contentStyle={styles.dialogContent}
          bodyStyle={styles.dialogBody}
          style={styles.dialogRoot}
          modal={false}
          open={state.open}
          onRequestClose={handleClose}
          repositionOnUpdate={false}
          autoScrollBodyContent={true}>
          <SignIn redirect={handleClose} dialog={true} />
          <br />
          <br />
        </Dialog>
      </div>
    );
  };

  const renderTop = () => {
    if (courses) {
      return (
        <Grid className={classes.root}>
          <Grid container item xs={6} spacing={3}>
            <Typography className={classes.cartTitle}>
              Shoopping Cart!
            </Typography>
          </Grid>
          <Grid
            className={classes.rootCartSubtitle}
            container
            item
            xs={6}
            spacing={3}>
            <span className={classes.courseLength}>{courses.length}</span>
            <p className={classes.coursesCartPara}>Courses in Cart</p>
          </Grid>
        </Grid>
      );
    }
  };

  const listCourse = (course) => {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-4'>
            <div
              style={{
                overflow: 'hidden',
              }}>
              <img
                style={{ width: '100%', height: '100%' }}
                alt=''
                src={`${hostUrl}/images/${course.picture}`}
              />
            </div>
          </div>
          <div className='col-sm-8'>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '12px 0',
                }}>
                <span className={classes.coursePrice}>${course.price}</span>
                <span
                  className={classes.removeFromCart}
                  onClick={() => {
                    onRemoveCart(course.no);
                  }}>
                  Remove
                </span>
              </div>
              <div className={classes.courseTitle}>{course.title}</div>
              <div className={classes.courseSubTitle}>{course.subtitle}</div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  };

  const renderList = () => {
    if (courses) {
      return _.map(courses, (course, i) => {
        return <div key={i}>{listCourse(course)}</div>;
      });
    }
  };

  const renderCheckout = () => {
    return (
      <div>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-sm-12'>
              <br />
              <div className={classes.totalTitle}>
                Total :{' '}
                <span className={classes.totalPrice}>
                  ${numberWithCommas(state.total)}
                </span>
              </div>
              <br />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: 10,
                }}>
                <button
                  type='button'
                  name='paycart'
                  className='btn btn-lg btn-primary btn-block'
                  onClick={(e) => {
                    e.preventDefault();
                    onPayCart();
                  }}>
                  Checkout
                </button>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderDialog()}
      {renderTop()}
      {renderList()}
      {renderCheckout()}
    </div>
  );
};

ListCart.propTypes = {
  logged: PropTypes.bool,
  courses: PropTypes.object,
  user: PropTypes.object,
  fetchAddCart: PropTypes.func,
  fetchBuyCourse: PropTypes.func,
  fetchListCart: PropTypes.func,
  fetchRemoveCart: PropTypes.func,
  fetchPayCart: PropTypes.func,
  fetchUserInfo: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged,
    user: state.auth.user,
    courses: state.fetchCartList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBuyCourse: (course_no) => dispatch(buyCourse(course_no)),
    fetchListCart: () => dispatch(listCart()),
    fetchAddCart: (course_no) => dispatch(addCart(course_no)),
    fetchRemoveCart: (course_no) => dispatch(removeCart(course_no)),
    fetchPayCart: (courses) => dispatch(payCart(courses)),
    fetchUserInfo: () => dispatch(userInfo()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListCart),
);
