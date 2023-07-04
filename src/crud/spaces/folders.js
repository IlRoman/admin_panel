import service from "../service";

export const getFolders = (data, path) => {
    return service.get(`admin/spaces/folder/resolve${path}`, { ...data })
};

export const createFolder = data => {
    return service.post(`admin/spaces/folder`, { ...data });
};

export const deleteFolders = ids => {
    return service.delete(`admin/spaces/folders/deleteMany`, {
        data: { ids: [...ids] },
    })
};

export const deleteSpace = ids => {
    return service.delete(`admin/spaces/deleteMany`, {
        data: { ids: [...ids] },
    })
};

export const deleteEntities = deleted => {
    return service.delete(`admin/spaces/entities/deleteMany`, {
        data: { ...deleted },
    })
};

export const renameFolder = ({ id, title }) => {
    return service.patch(`admin/spaces/folder/${id}`, { title })
};
