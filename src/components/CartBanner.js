import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Paper, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { buyCourse, addCart } from '../actions/cart';
import { userInfo } from '../actions';
import { hostUrl } from '../../config';
import SignIn from '../auth/SignIn';
import './style.css';

const numberWithCommas = (x) => {
  const parts = parseInt(x, 10).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const CartBanner = ({
  course,
  logged,
  user,
  fetchUserInfo,
  fetchBuyCourse,
  fetchAddCart
}) => {
  const [state, setState] = useState({
    open: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }
  }, [fetchUserInfo]);

  /* RAZORPAY Integration */

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleOpen = () => {
    setState({ open: true });
  };

  const handleClose = () => {
    setState({ open: false });
  };

  const learn = () => {
    if (logged) {
      fetchBuyCourse(course.no);
    } else {
      handleOpen();
    }
  };

  const onBuyCourse = async () => {
    if (logged) {
      const result = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js'
      );
      if (!result) {
        alert('RazorPay SDK failed to load. Are you online ?');
        return;
      }
      const data = await fetch('http://localhost:5000/razorpay', {
        method: 'POST'
      }).then((t) => t.json());
      const options = {
        //   key: __DEV__
        //     ? 'rzp_test_6laePmGzrlqoaS'
        //     : 'generate a new PRODUCTION(Live) key from razorpay', // Enter the Key ID generated from the Dashboard
        key: 'rzp_test_6laePmGzrlqoaS',
        currency: data.currency,
        amount: data.amount,
        name: 'Immeasurable Inc.',
        description: 'Thankyou for buying the course. Have a happy learning.',
        image: 'https://example.com/your_logo',
        //   order_id: 'order_9A33XWu170gUtm', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler(data) {
          alert(data.razorpay_payment_id);
          alert(data.razorpay_order_id);
          alert(data.razorpay_signature);
        },
        prefill: {
          name: 'Gaurav Kumar',
          email: 'gaurav.kumar@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Razorpay Corporate Office'
        },
        theme: {
          color: '#F37254'
        }
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      fetchBuyCourse(course.no);
      // console.log('WINDOWWRAZORPAY', window)
      // if(response){
      //    fetchBuyCourse(course.no);
      // }
      // fetchBuyCourse(course.no);
    } else {
      handleOpen();
    }
  };

  const addToCart = () => {
    if (logged) {
      fetchAddCart(course.no);
    } else {
      handleOpen();
    }
  };

  const renderDialog = () => {
    return (
      <div>
        <Dialog
          //    contentStyle={ styles.dialogContent }
          //    bodyStyle={ styles.dialogBody }
          //    style={ styles.dialogRoot }
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

  const renderButton = (course) => {
    let filtered = null;
    if (course) {
      if (user) {
        filtered = user.courses.filter(function (_course) {
          if (_course.no === course.no) {
            return _course;
          }
        });
      }
    }

    if (filtered) {
      if (filtered.length > 0) {
        if (filtered[0].learn) {
          return (
            <div>
              <div className='btn-group-buy'>
                <Button
                  color='primary'
                  fullWidth={true}
                  onClick={() => learn()}>
                  Learn the Course
                </Button>
              </div>
            </div>
          );
        }
      }
    }

    return (
      <Fragment>
        <div className='btn-group-buy'>
          <Button
            fullWidth={true}
            variant='outlined'
            color='primary'
            onClick={() => onBuyCourse()}>
            Buy Now
          </Button>
        </div>
        <div className='btn-group-buy'>
          <Button
            size='large'
            color='primary'
            variant='outlined'
            fullWidth={true}
            onClick={addToCart}>
            Add to Cart
          </Button>
        </div>
      </Fragment>
    );
  };

  const renderPicture = (course) => {
    if (course.picture) {
      return (
        <div>
          <img
            alt=''
            width='100%'
            height='100%'
            src={`${hostUrl}/images/${course.picture}`}
          />
        </div>
      );
    }
  };

  const renderBanner = () => {
    return (
      <div>
        <Paper
          elevation={0}
          // style={{
          //   width: '100%',
          //   height: '100%',
          //   overflow: 'hidden',
          //   backgroundColor: '#FFF',
          //   display: 'inline-block'
          // }}
        >
          <div>
            <div style={{ marginBottom: 6 }} />
            <div style={{ textAlign: 'center' }}>{renderPicture(course)}</div>
            <div className='clp-component-render'>
              <h3 className='course-title'>{course.title}</h3>
              <div className='course-subtitle'>{course.subtitle}</div>
            </div>
            <div className='clp-badge-rating'>
              <div className='clp-lead-item'>
                <div className='clp-course-avg'>{course.average}*****</div>
                <div className='clp-course-rev'>{course.reviews} students</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <Button fullWidth={true}>Preview the Course</Button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 6 }}>
              {/* <Button onClick={displayRazorPay}>Buy from razorPay</Button> */}
            </div>
            <div
              style={{ textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
              <strong className='text-size-second text-black'>
                ${numberWithCommas(course.price)}
              </strong>
            </div>
            {renderButton(course)}
          </div>
        </Paper>
      </div>
    );
  };

  return (
    <div>
      {renderDialog()}
      {renderBanner()}
    </div>
  );
};

CartBanner.propTypes = {
  course: PropTypes.object,
  user: PropTypes.object,
  logged: PropTypes.bool,
  fetchAddCart: PropTypes.func,
  fetchBuyCourse: PropTypes.func,
  fetchUserInfo: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged,
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBuyCourse: (course_no) => dispatch(buyCourse(course_no)),
    fetchAddCart: (course_no) => dispatch(addCart(course_no)),
    fetchUserInfo: () => dispatch(userInfo())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CartBanner)
);
