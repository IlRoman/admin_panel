import service from "./service";

export const fetchCollaborators = data => {
    return service.get(`admin/collaborators`, { ...data });
};

export const addCollaborator = data => {
    return service.post(`admin/collaborators`, { ...data })
};

export const updateCollaborator = (id, data) => {
    return service.patch(`admin/collaborators/${id}`, { ...data })
};

export const fetchCollabSpaces = (collabId, params) => {
    return service.get(`admin/collaborators/${collabId}/spaces`, {
        params: { ...params }
    })
};

export const deleteCollaborator = id => {
    return service.delete(`admin/collaborators/${id}`)
};

export const deleteCollaborators = ids => {
    return service.delete(`admin/collaborators`, {
        data: {
            ids: [...ids],
        }
    })
};

export const sendInviteToCollaborator = (id, message) => {
    return service.post(`admin/collaborators/${id}/invite`, { message })
};

export const resetPasswordForCollaborator = id => {
    return service.post(`admin/collaborators/${id}/resetPassword`)
};

export const manageCollabSpaces = (collabId, spaces) => {
    return service.post(`admin/collaborators/${collabId}/spaces`, { spaces })
};
