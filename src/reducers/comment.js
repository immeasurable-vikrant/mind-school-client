import {
    RESET_COMMENT,
    LIST_COMMENT,
    RELOAD_COMMENT,
    COMMENT_ERROR,
    COMMENT_LOADING
} from '../actions/comment';

export function fetchCommentError(state = false, action) {
    switch (action.type) {
        case COMMENT_ERROR:
            return action.error;
        default:
            return state;
    }
}

export function fetchCommentLoading(state = false, action) {
    switch (action.type) {
        case COMMENT_LOADING:
            return action.loading;
        default:
            return state;
    }
}

export function fetchCommentList(state = {
    page:0,limit:0,total:0,comments:[]
}, action) {
    switch (action.type) {
        case RESET_COMMENT:
            return {
                page: 0,
                limit: 0,
                total: 0,
                comments: []
            };
        case LIST_COMMENT:
            return {
                page: action.data.page,
                limit: action.data.limit,
                total: action.data.total,
                comments: [...state.comments, ...action.data.comments]
            };
        case RELOAD_COMMENT:
            return {
                page: action.data.page,
                limit: action.data.limit,
                total: action.data.total,
                comments: [...action.data.comments]
            };
        default:
            return state;
    }
}
