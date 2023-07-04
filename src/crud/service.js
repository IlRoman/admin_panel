import axios from "axios";
import { store } from "../index";
import { hideLoaderAction } from "../redux/actions";
import history from '../history.js';

const service = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("akroton_access_token")}`,
    },
});

service.interceptors.request.use(
    (request) => {
        request.headers.Authorization = `Bearer ${localStorage.getItem(
            "akroton_access_token"
        )}`;
        return request;
    },
    (error) => {
        return error;
    }
);

service.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status) {
            const { status } = error.response;

            if (
                status === 401 &&
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/forgot-password' &&
                window.location.pathname !== '/sign-up' &&
                !window.location.pathname.includes('auth')
            ) {
                localStorage.removeItem("akroton_access_token");
                history.push('/login');
            }

            const displayErrorMessage = () => {
                if (error?.response?.data?.errors) {
                    let errors = error.response.data.errors;
                    if (errors.rows) return;
                    let errorName = Object.keys(errors).length
                        ? Object.keys(errors)[0]
                        : null;
                    return errors[errorName].length ? errors[errorName][0] : null;
                }
            };

            store.dispatch(hideLoaderAction());
            if (displayErrorMessage()) alert(displayErrorMessage());
        }

        return Promise.reject(error);
    }
);

export default service;
