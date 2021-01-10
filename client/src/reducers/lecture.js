import {
    FETCH_LECTURE_FAILURE,
    FETCH_LECTURE_LOADING,
    FETCH_LECTURE_DONE
} from '../actions/lecture';

export default (state = {
    error:'',
    loading:false,
    lecture:{}
}, action) => {
    switch (action.type) {
        case FETCH_LECTURE_FAILURE:
            return {...state, error: action.failure};
        case FETCH_LECTURE_LOADING:
            return {...state, loading: action.loading};
        case FETCH_LECTURE_DONE:
            return {...state, lecture: action.lecture};
        default:
            return state;
    }
};
