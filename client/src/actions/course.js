import axios from 'axios';

import { hostUrl } from '../../config';

export const FETCH_COURSE_FAILURE = 'FETCH_COURSE_FAILURE';
export const FETCH_COURSE_LOADING = 'FETCH_COURSE_LOADING';
export const FETCH_COURSE_DONE = 'FETCH_COURSE_DONE';
export const FETCH_DETAIL_COURSE_DONE = 'FETCH_DETAIL_COURSE_DONE';
export const PAGINATE_ERROR = 'PAGINATE_ERROR';
export const PAGINATE_LOADING = 'PAGINATE_LOADING';
export const PAGINATE_RESET = 'PAGINATE_RESET';
export const PAGINATE_COURSE = 'PAGINATE_COURSE';

export function fetchCourseFailure(bool = false) {
  return (dispatch) => {
    return dispatch({
      type: FETCH_COURSE_FAILURE,
      failure: bool
    });
  };
}

export function fetchCourseLoading(bool = false) {
  return (dispatch) => {
    return dispatch({
      type: FETCH_COURSE_LOADING,
      loading: bool
    });
  };
}

export function fetchCourseDone(courses = null) {
  return (dispatch) => {
    return dispatch({
      type: FETCH_COURSE_DONE,
      data: courses
    });
  };
}

export function fetchCourses(keyword = '') {
  return (dispatch) => {
    dispatch(fetchCourseLoading(true));
    fetch(`${hostUrl}/courses/${keyword}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((res) => res.json())
      .then((res) => {
        setTimeout(() => {
          dispatch(fetchCourseLoading(false));
          return dispatch(fetchCourseDone(res.courses));
        }, 2000);
      })
      .catch(() => {
        return dispatch(fetchCourseFailure(true));
      });
  };
}

export function fetchDetailCourseDone(course = null) {
  return (dispatch) => {
    return dispatch({
      type: FETCH_DETAIL_COURSE_DONE,
      course
    });
  };
}

export function fetchDetailCourse(course_no = -1) {
  return (dispatch) => {
    dispatch(fetchCourseLoading(true));
    fetch(`${hostUrl}/courses/detail/${course_no}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        dispatch(fetchCourseLoading(false));
        return dispatch(fetchDetailCourseDone(response));
      })
      .catch(() => {
        return dispatch(fetchCourseFailure(true));
      });
  };
}

export function paginateError(error) {
  return function (dispatch) {
    dispatch({
      type: PAGINATE_ERROR,
      error
    });
  };
}

export function paginateLoading(loading) {
  return function (dispatch) {
    dispatch({
      type: PAGINATE_LOADING,
      loading
    });
  };
}

export function paginateReset() {
  return function (dispatch) {
    dispatch(paginateError(''));
    dispatch({
      type: PAGINATE_RESET
    });
  };
}

export function paginateCourse(response) {
  return (dispatch) => {
    return dispatch({
      type: PAGINATE_COURSE,
      data: response.data
    });
  };
}

export function paginate(textState = '', page = 0, limit = 0, sort, callback) {
  return function (dispatch) {
    dispatch(paginateLoading(true));

    const sort_type = sort.field;
    const sort_order = sort.value;
    const url = `${hostUrl}/paginate?keyword=${textState}&page=${page}&limit=${limit}&sort_type=${sort_type}&sort_order=${sort_order}}`;
    axios
      .get(url)
      .then((response) => {
        if (callback) callback();
        dispatch(paginateCourse(response));
        return dispatch(paginateLoading(false));
      })
      .catch((response) => {
        return dispatch(paginateError(response.message));
      });
  };
}
