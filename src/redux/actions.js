import {
    SIGN_IN,
    SET_ME,
    SHOW_LOADER,
    HIDE_LOADER,
    SET_LANGUAGE,
    SHOW_ERROR_MODAL,
    HIDE_ERROR_MODAL,
} from "./constantTypes"

export const signInAction = data => {
    return {
        type: SIGN_IN,
        payload: data
    }
};

export const showLoaderAction = () => {
    return {
        type: SHOW_LOADER
    }
};

export const hideLoaderAction = () => {
    return {
        type: HIDE_LOADER
    }
};

export const setLanguage = (lang) => {
    return {
        type: SET_LANGUAGE,
        payload: lang
    }
};

export const showSimpleModalAction = ({ title, text }) => {
    return {
        type: SHOW_ERROR_MODAL,
        payload: { title, text },
    }
};

export const hideSimpleModalAction = () => {
    return {
        type: HIDE_ERROR_MODAL,
    }
};

export const setMe = (payload) => {
    return {
        type: SET_ME,
        payload
    }
};
