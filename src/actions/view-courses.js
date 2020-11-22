import axios from 'axios';

import { hostUrl } from '../../config';

export const VIEW_COURSES_ERROR = 'VIEW_COURSES_ERROR';
export const VIEW_COURSES_LOADING = 'VIEW_COURSES_LOADING';
export const FETCH_VIEW_COURSES = 'FETCH_VIEW_COURSES';

export function viewCoursesError(error = '') {
  return (dispatch) => {
    return dispatch({
      type: VIEW_COURSES_ERROR,
      error
    });
  };
}

export function viewCoursesLoading(bool = false) {
  return (dispatch) => {
    return dispatch({
      type: VIEW_COURSES_LOADING,
      loading: bool
    });
  };
}

export function viewCoursesData(data) {
  return function (dispatch) {
    return dispatch({
      type: FETCH_VIEW_COURSES,
      courses: data
    });
  };
}

export function fetchViewCourses() {
  return (dispatch) => {
    dispatch(viewCoursesLoading(true));
    const token = localStorage.getItem('token');
    axios
      .get(`${hostUrl}/view-courses`, {
        headers: {
          authorization: token
        }
      })
      .then((response) => {
        dispatch(viewCoursesLoading(false));
        return dispatch(viewCoursesData(response.data));
      })
      .catch((response) => {
        return dispatch(viewCoursesError(response.message));
      });
  };
}
