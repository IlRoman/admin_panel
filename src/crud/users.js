import service from "./service";

export const fetchUsers = params => {
    return service.get(`admin/users/`, { ...params });
};

export const addUser = (data) => {
    return service.post(`admin/users`, { ...data })
};

export const updateUser = (id, data) => {
    return service.patch(`admin/users/${id}`, { ...data })
};

export const deleteUser = (id) => {
    return service.delete(`admin/users/${id}`)
};

export const deleteUsers = (ids) => {
    return service.delete(`admin/users`, {
        data: { ids: [...ids] }
    })
};

export const sendInviteToUser = (id, message) => {
    return service.post(`admin/users/${id}/invite`, { message })
};

export const resetPasswordForUser = (id) => {
    return service.post(`admin/users/${id}/resetPassword`)
};

export const fetchUserSpaces = (userId, params) => {
    return service.get(`admin/users/${userId}/spaces`, {
        params: { ...params }
    })
};

export const fetchCollabs = params => {
    return service.get(`admin/users/${params.id}/collaborators`, {
        params: { ...params },
    })
};

export const manageCollabs = ({ id, collaborators }) => {
    return service.post(`admin/users/${id}/collaborators`, { collaborators })
};

export const manageUserSpaces = (userId, spaces) => {
    return service.post(`admin/users/${userId}/spaces`, { spaces })
};
