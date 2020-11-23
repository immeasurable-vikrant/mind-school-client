import {
    FETCH_COURSE_FAILURE,
    FETCH_COURSE_LOADING,
    FETCH_COURSE_DONE,
    FETCH_DETAIL_COURSE_DONE,
    PAGINATE_ERROR,
    PAGINATE_LOADING,
    PAGINATE_RESET,
    PAGINATE_COURSE
} from '../actions/course';

export function fetchCourseFailure(state = false, action) {
    switch (action.type) {
        case FETCH_COURSE_FAILURE:
            return action.failure;
        default:
            return state;
    }
}

export function fetchCourseLoading(state = false, action) {
    switch (action.type) {
        case FETCH_COURSE_LOADING:
            return action.loading;
        default:
            return state;
    }
}

export function fetchCourseDone(state = [], action) {
    switch (action.type) {
        case FETCH_COURSE_DONE:
            return [...action.data];
        default:
            return state;
    }
}

export function fetchDetailCourseDone(state = {}, action) {
    switch (action.type) {
        case FETCH_DETAIL_COURSE_DONE:
            return action.course;
        default:
            return state;
    }
}

export function paginate(state = {
    error: '',
    loading: false,
    page: 0,
    limit: 0,
    total: 0,
    courses: []
}, action) {
    switch (action.type) {
        case PAGINATE_ERROR:
            return {
                ...state,
                error: action.error
            };
        case PAGINATE_LOADING:
            return {
                ...state,
                loading: action.loading
            };
        case PAGINATE_RESET:
            return {
                error:'',
                page: 0,
                limit: 0,
                total: 0,
                courses: []
            };
        case PAGINATE_COURSE:
            return {
                page: action.data.page,
                limit: action.data.limit,
                total: action.data.total,
                courses: [...state.courses, ...action.data.courses]
            };
        default:
            return state;
    }
}
