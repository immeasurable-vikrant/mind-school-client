import {
    USER_INFO,
    SIGN_IN,
    SIGN_OUT,
    SIGN_ERROR,
    FETCH_MESSAGE
} from '../actions';

export default function (state = {error: '', logged: false, user: null}, action) {
    switch (action.type) {
        case USER_INFO:
            return {...state, user: action.user};
        case SIGN_IN:
            return {...state, error: '', logged: true};
        case SIGN_OUT:
            return {...state, error: '', logged: false};
        case SIGN_ERROR:
            return {...state, error: action.payload};
        case FETCH_MESSAGE:
            return {...state, message: action.payload};
        default:
            return state;
    }
}
