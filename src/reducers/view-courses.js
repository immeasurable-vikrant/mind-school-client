import {
    VIEW_COURSES_ERROR,
    VIEW_COURSES_LOADING,
    FETCH_VIEW_COURSES
} from '../actions/view-courses';

export function viewCoursesError(state = false, action) {
    switch (action.type) {
        case VIEW_COURSES_ERROR:
            return action.error;
        default:
            return state;
    }
}

export function viewCoursesLoading(state = false, action) {
    switch (action.type) {
        case VIEW_COURSES_LOADING:
            return action.loading;
        default:
            return state;
    }
}

export function fetchViewCourses(state=[], action) {
    switch (action.type) {
        case FETCH_VIEW_COURSES:
            return action.courses;
        default:
            return state;
    }
}
