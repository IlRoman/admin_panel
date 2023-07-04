import {
    SIGN_IN,
    SIGN_UP,
    SET_LANGUAGE,
    SET_ME,
} from '../constantTypes'

const initialState = {
    language: {
        name: "English",
        value: "en"
    },
    id: null,
    number: null,
    fname: null,
    lname: null,
    email: null,
    verified: null,
    logoutTime: null,
    recoveryToken: null,
    role: null,
    createdAt: null,
    deletedAt: null,
    verifySend: null,
    jobTitle: null,
    company: null,
    country: null,
    city: null,
    street: null,
    zip: null,
    phoneNumber: null,
    phonePrefix: null,
    active: null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_IN:
            return { ...state, ...action.payload }
        case SET_LANGUAGE:
            return { ...state, language: action.payload }
        case SET_ME:
            return {
                ...state,
                ...action.payload,
                language: {
                    name: "English",
                    value: "en"
                },
            }
        default: return state;
    }
};
