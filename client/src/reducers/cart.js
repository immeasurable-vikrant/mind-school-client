import {
    LIST_CART,
    CART_ERROR
} from '../actions/cart';

export function fetchCartError(state = false, action) {
    switch (action.type) {
        case CART_ERROR:
            return action.error;
        default:
            return state;
    }
}

export function fetchCartList(state = [], action) {
    switch (action.type) {
        case LIST_CART:
            return action.courses;
        default:
            return state;
    }
}
