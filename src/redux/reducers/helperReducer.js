import {
    SHOW_LOADER,
    HIDE_LOADER,
    SHOW_ERROR_MODAL,
    HIDE_ERROR_MODAL,
} from '../constantTypes';

const initialState = {
    loader: false,
    simpleModal: { isModal: false, title: '', text: '' }
};

export const helperReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_LOADER:
            return {
                ...state,
                loader: true
            }
        case HIDE_LOADER:
            return {
                ...state,
                loader: false
            }
        case SHOW_ERROR_MODAL:
            return {
                ...state,
                simpleModal: {
                    isModal: true,
                    title: action.payload.title,
                    text: action.payload.text,
                }
            }
        case HIDE_ERROR_MODAL:
            return {
                ...state,
                simpleModal: {
                    isModal: false,
                    title: '',
                    text: '',
                }
            }
        default: return state
    }
};
