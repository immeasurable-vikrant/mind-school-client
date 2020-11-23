/** @format */

//Libraries Import
import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  buyCourse,
  listCart,
  addCart,
  removeCart,
  payCart
} from '../actions/cart';
import { userInfo } from '../actions';
//Config Import
import { hostUrl } from '../../config';
//Auth Import
import SignIn from '../auth/SignIn';

import Header from './Header';
// import Footer from './footer';

const numberWithCommas = (x) => {
  const parts = parseInt(x, 10).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const styles = {
  dialogRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0
  },
  dialogContent: {
    position: 'relative',
    width: '80vw',
    transform: ''
  },
  dialogBody: {
    paddingBottom: 0
  }
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
  fetchPayCart
}) => {
  const [state, setState] = useState({
    open: false,
    total: 0
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
        <div
          style={{ width: '100%', backgroundColor: 'rgba(33, 33, 33, 0.9)' }}>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-sm-12'>
                <br />
                <div className='text-size-second text-bold text-white'>
                  <span>Shopping Cart</span>
                </div>
                <div className='text-size-fifth'>
                  <span className='text-emphasis-third'>{courses.length}</span>
                  <span className='text-white'> Courses in Cart</span>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const listCourse = (course) => {
    return (
      <div>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-sm-4'>
              <div
                style={{
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 8,
                  marginBottom: 8,
                  overflow: 'hidden'
                }}>
                <img
                  style={{ width: '100%', height: '100%' }}
                  alt=''
                  src={`${hostUrl}/images/${course.picture}`}
                />
              </div>
            </div>
            <div className='col-sm-8'>
              <div
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 12,
                  marginBottom: 12
                }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className='text-size-fifth text-bold text-emphasis-fourth'>
                    ${course.price}
                  </span>
                  <span>
                    <Button
                      onClick={() => {
                        onRemoveCart(course.no);
                      }}>
                      Remove
                    </Button>
                  </span>
                </div>
                <div className='text-size-fifth text-bold'>{course.title}</div>
                <div className='text-size-fifth'>{course.subtitle}</div>
              </div>
            </div>
          </div>
        </div>
        <br />
        {/* </Paper> */}
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
      <div style={{ width: '100%', backgroundColor: 'rgba(33, 33, 33, 0.9)' }}>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-sm-12'>
              <br />
              <div className='text-size-second text-bold text-white'>
                Total :{' '}
                <span className='text-size-second text-emphasis-third text-bold'>
                  ${numberWithCommas(state.total)}
                </span>
              </div>
              <br />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: 10
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
      <Header />
      {renderDialog()}
      {renderTop()}
      {renderList()}
      {renderCheckout()}
      {/* <Footer/> */}
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
  fetchUserInfo: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged,
    user: state.auth.user,
    courses: state.fetchCartList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBuyCourse: (course_no) => dispatch(buyCourse(course_no)),
    fetchListCart: () => dispatch(listCart()),
    fetchAddCart: (course_no) => dispatch(addCart(course_no)),
    fetchRemoveCart: (course_no) => dispatch(removeCart(course_no)),
    fetchPayCart: (courses) => dispatch(payCart(courses)),
    fetchUserInfo: () => dispatch(userInfo())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListCart)
);
