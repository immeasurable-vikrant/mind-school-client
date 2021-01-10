import _ from 'lodash';
import axios from 'axios';

import { history } from '../routes';
import { hostUrl } from '../../config';
import { signError } from './index';

export const ADD_CART = 'ADD_CART';
export const REMOVE_CART = 'REMOVE_CART';
export const LIST_CART = 'LIST_CART';
export const CART_ERROR = 'CART_ERROR';
export const CART_SUCCESS = 'CART_SUCCESS';

export function cartError(error = '') {
  return (dispatch) => {
    return dispatch({
      type: CART_ERROR,
      error
    });
  };
}

export function buyCourse(course_no = -1, redirect = true) {
  return function (dispatch) {
    axios
      .post(
        `${hostUrl}/buy-cart`,
        { course_no },
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
      )
      .then((response) => {
        if (redirect) {
          localStorage.setItem('course', course_no);
          return history.push(`/detail`);
        } else {
          return history.push(`/view-courses`);
        }
      })
      .catch((response) => {
        return dispatch(cartError(response.message));
      });
  };
}

export function cartData(data = null) {
  return (dispatch) => {
    return dispatch({
      type: LIST_CART,
      courses: data
    });
  };
}

export function listCart() {
  return function (dispatch) {
    const token = localStorage.getItem('token');
    axios
      .get(`${hostUrl}/list-cart`, {
        headers: {
          authorization: token
        }
      })
      .then((response) => {
        return dispatch(cartData(response.data));
      })
      .catch((response) => {
        return dispatch(signError(response.message));
      });
  };
}

export function addCart(course_no = -1) {
  return function (dispatch) {
    axios
      .post(
        `${hostUrl}/add-cart`,
        { course_no },
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
      )
      .then((response) => {
        return history.push(`/list-cart`);
      })
      .catch((response) => {
        return dispatch(cartError(response.message));
      });
  };
}

export function removeCart(course_no = -1) {
  return function (dispatch) {
    axios
      .post(
        `${hostUrl}/remove-cart`,
        { course_no },
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
      )
      .then((response) => {
        return history.push(`/list-cart`);
      })
      .catch((response) => {
        return dispatch(cartError(response.message));
      });
  };
}

export function payCart(courses = null) {
  return function (dispatch) {
    _.map(courses, (course, i) => {
      dispatch(buyCourse(course.no, false));
    });
  };
}
