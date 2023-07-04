import service from "./service";

export const login = (email, password, language) => {
    return service.post('auth/admin/login', {
        email,
        password,
        language,
    });
};

export const logout = () => {
    return service.post('auth/logout');
};

export const forgotPassword = email => {
    return service.post('auth/admin/forgotPassword', { email });
};

export const changePassword = (password, passwordConfirmation, token) => {
    return service.patch('auth/admin/changePassword', {
        password,
        passwordConfirmation,
        token
    });
};

export const verifyToken = token => {
    return service.post(`auth/verifyToken`, { token })
};

export const createPasswordFE = (data) => {
    return service.post('auth/change-password-feuser',{...data})
};

export const fetchMe = () => {
    return service.get(`auth/me`)
};
