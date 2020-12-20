import axios from 'axios';

import {history} from '../routes';
import {hostUrl} from '../../config';

export const FETCH_LECTURE_FAILURE = 'FETCH_LECTURE_FAILURE';
export const FETCH_LECTURE_LOADING = 'FETCH_LECTURE_LOADING';
export const FETCH_LECTURE_DONE = 'FETCH_LECTURE_DONE';

export function fetchLectureFailure(bool=false) {
    return (dispatch) => {
        return dispatch({
            type: FETCH_LECTURE_FAILURE,
            failure: bool
        });
    }
}

export function fetchLectureLoading(bool=false) {
    return (dispatch) => {
        return dispatch({
            type: FETCH_LECTURE_LOADING,
            loading: bool
        });
    }
}

export function fetchLectureDone(lecture=null) {
    return (dispatch) => {
        return dispatch({
            type: FETCH_LECTURE_DONE,
            lecture: lecture
        });
    }
}

export function fetchLecture(course_no=-1) {
    return (dispatch) => {
        dispatch(fetchLectureLoading(true));
        fetch(`${hostUrl}/lecture/${course_no}`)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            }).then(response => response.json())
            .then(response => {
                dispatch(fetchLectureLoading(false));
                return dispatch(fetchLectureDone(response));
            })
            .catch((response) => {
                return dispatch(fetchLectureFailure(response.message));
            });
    };
}

export function viewLecture(lecture_no=-1, header_no=-1, sub_no=-1) {
    return (dispatch) => {
        axios.post(`${hostUrl}/view-lecture`, {lecture_no, header_no, sub_no}, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('view ', response);
                localStorage.setItem('url', response.data);
                return history.push(`/lecture`);
            })
            .catch((response) => {
                return dispatch(fetchLectureFailure(response.message));
            });
    };
}