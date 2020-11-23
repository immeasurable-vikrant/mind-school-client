import {
    SIGN_OUT
} from '../actions';

import {combineReducers} from 'redux';
import {reducer as form} from 'redux-form';
import auth from './authentication';

import {fetchCourseFailure} from './course';
import {fetchCourseLoading} from './course';
import {fetchCourseDone} from './course';
import {paginate} from './course';
import {fetchDetailCourseDone} from './course';

import {fetchCartError} from './cart';
import {fetchCartList} from './cart';

import lecture from './lecture';

import {fetchCommentError} from './comment';
import {fetchCommentLoading} from './comment';
import {fetchCommentList} from './comment';

import {viewCoursesError} from './view-courses';
import {viewCoursesLoading} from './view-courses';
import {fetchViewCourses} from './view-courses';

const rootReducer = combineReducers({
    form,
    auth,
    fetchCourseFailure,
    fetchCourseLoading,
    fetchCourseDone,
    paginate,
    fetchDetailCourseDone,
    fetchCartError,
    fetchCartList,
    lecture,
    fetchCommentError,
    fetchCommentLoading,
    fetchCommentList,
    viewCoursesError,
    viewCoursesLoading,
    fetchViewCourses
});

const initialState = rootReducer({}, {});

const reducers = (state, action) => {
    if (action.type === SIGN_OUT) {
        state = initialState;
    }

    return rootReducer(state, action)
};

export default reducers;
