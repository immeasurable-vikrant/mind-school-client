import axios from 'axios';

import { history } from '../routes';
import { hostUrl } from '../../config';

export const RESET_COMMENT = 'RESET_COMMENT';
export const ADD_COMMENT = 'ADD_COMMENT';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export const LIST_COMMENT = 'LIST_COMMENT';
export const RELOAD_COMMENT = 'RELOAD_COMMENT';
export const COMMENT_ERROR = 'COMMENT_ERROR';
export const COMMENT_SUCCESS = 'COMMENT_SUCCESS';
export const COMMENT_LOADING = 'COMMENT_LOADING';

export function commentError(error = '') {
  return (dispatch) => {
    return dispatch({
      type: COMMENT_ERROR,
      error
    });
  };
}

export function commentLoading(bool = false) {
  return (dispatch) => {
    return dispatch({
      type: COMMENT_LOADING,
      loading: bool
    });
  };
}

export function commentData(response = null) {
  return (dispatch) => {
    return dispatch({
      type: LIST_COMMENT,
      data: response.data
    });
  };
}

export function commentReload(response = null) {
  return (dispatch) => {
    return dispatch({
      type: RELOAD_COMMENT,
      data: response.data
    });
  };
}

export function resetComment() {
  return function (dispatch) {
    dispatch(commentError(''));
    dispatch({
      type: RESET_COMMENT
    });
  };
}

export function listComment(
  course_no = -1,
  page = 0,
  limit = 0,
  reload = false
) {
  return function (dispatch) {
    dispatch(commentLoading(true));
    const url = `${`${hostUrl}/comments` + '?'}${$.param({
      course_no,
      page,
      limit
    })}`;

    axios
      .get(url)
      .then((response) => {
        setTimeout(() => {
          dispatch(commentLoading(false));
          if (!reload) {
            return dispatch(commentData(response));
          } else {
            return dispatch(commentReload(response));
          }
        }, 2000);
      })
      .catch((response) => {
        return dispatch(commentError(response.message));
      });
  };
}

export function addComment(
  course_no = -1,
  page = 0,
  limit = 0,
  content,
  rating,
  helpful,
  failed = null
) {
  return function (dispatch) {
    dispatch(commentLoading(true));
    axios
      .post(
        `${hostUrl}/add-comment`,
        { course_no, content, rating, helpful },
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
      )
      .then((response) => {
        return history.push(`/detail`);
      })
      .catch((response) => {
        if (failed) failed();
        return dispatch(commentError(response.message));
      });
  };
}

export function removeComment(course_no = -1, page = 0, limit = 0, comment_no) {
  return function (dispatch) {
    dispatch(commentLoading(true));
    axios
      .post(
        `${hostUrl}/remove-comment`,
        { course_no, comment_no },
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
      )
      .then((response) => {
        const offset = page * limit;
        return dispatch(listComment(course_no, 1, offset, true));
      })
      .catch((response) => {
        return dispatch(commentError(response.message));
      });
  };
}

export function toggleHelpful(course_no = -1, page = 0, limit = 0, comment_no) {
  return function (dispatch) {
    dispatch(commentLoading(true));
    axios
      .post(
        `${hostUrl}/toggle-helpful`,
        { course_no, comment_no },
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')
          }
        }
      )
      .then((response) => {
        const offset = page * limit;
        return dispatch(listComment(course_no, 1, offset, true));
      })
      .catch((response) => {
        return dispatch(commentError(response.message));
      });
  };
}
