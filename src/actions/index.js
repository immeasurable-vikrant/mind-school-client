import axios from 'axios';
import { history } from '../routes';
import { hostUrl } from '../../config';

export const USER_INFO = 'USER_INFO';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_ERROR = 'SIGN_ERROR';
export const FETCH_MESSAGE = 'FETCH_MESSAGE';

export function signError(error = '') {
  return (dispatch) => {
    return dispatch({
      type: SIGN_ERROR,
      payload: error
    });
  };
}

export function userData(data = null) {
  return (dispatch) => {
    return dispatch({
      type: USER_INFO,
      user: data
    });
  };
}

export function userInfo() {
  return function (dispatch) {
    const token = localStorage.getItem('token');
    if (token && token.length > 0) {
      axios
        .get(`${hostUrl}/token`, {
          headers: {
            authorization: token
          }
        })
        .then((response) => {
          return dispatch(userData(response.data));
        })
        .catch((response) => {
          return dispatch(signError(response.message));
        });
    } else {
      return dispatch(userData(null));
    }
  };
}

export function signIn() {
  return (dispatch) => {
    return dispatch({
      type: SIGN_IN
    });
  };
}

export function signUp({ email, password, name, avatar, failed = null }) {
  return function (dispatch) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('name', name);

    if (avatar) {
      formData.append('avatar', avatar);
    }

    axios
      .post(`${hostUrl}/signup`, formData)
      .then((response) => {
        localStorage.setItem('token', response.data.token);

        dispatch(signIn());
        dispatch(userInfo());

        return history.push('/');
      })
      .catch((response) => {
        if (failed) failed();
        return dispatch(signError(response.message));
      });
  };
}

export function logIn({ email, password, redirect = null, failed = null }) {
  return function (dispatch) {
    axios
      .post(`${hostUrl}/signin`, { email, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);

        dispatch(signIn());
        dispatch(userInfo());

        if (!redirect) {
          return history.push('/');
        } else {
          redirect();
        }
      })
      .catch(() => {
        if (failed) failed();
        return dispatch(signError('Log-In Failed.'));
      });
  };
}

export function signOut() {
  return (dispatch) => {
    return dispatch({
      type: SIGN_OUT
    });
  };
}

export function logout() {
  return function (dispatch) {
    const token = localStorage.getItem('token');
    axios
      .get(`${hostUrl}/signout`, {
        headers: {
          authorization: token
        }
      })
      .then((response) => {
        localStorage.removeItem('token');

        return dispatch(signOut());
      })
      .catch((response) => {
        return dispatch(signError(response.message));
      });
  };
}

export function messageData(data) {
  return (dispatch) => {
    return dispatch({
      type: FETCH_MESSAGE,
      payload: data
    });
  };
}

export function fetchMessage() {
  return function (dispatch) {
    axios
      .get(hostUrl, {
        headers: { authorization: localStorage.getItem('token') }
      })
      .then((response) => {
        dispatch(messageData(response.data.message));
      });
  };
}
