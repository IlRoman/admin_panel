import service from "../service";

export const getAllSpaces = () => {
    return service.get(`admin/spaces/all`);
};

export const getSpace = id => {
    return service.get(`admin/spaces/${id}`);
};

export const changeSpaceStatus = ({ status, id }) => {
    return service.patch(`admin/spaces/status/${id}`, { status })
};

export const editSpaceContact = (id, data) => {
    return service.patch(`admin/spaces/${id}/contact`, { ...data });
};

export const editSpaceMainInfo = (id, data) => {
    return service.patch(`admin/spaces/${id}/maininfo`, { ...data });
};

export const setPhotoAndLocation = (id, formData) => {
    return service.post(`admin/spaces/${id}/photo`, formData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    })
};

export const patchLaunching = (id, data) => {
    return service.patch(`admin/spaces/${id}/launching`, { ...data })
};

export const patchVisibility = (id, data) => {
    return service.patch(`admin/spaces/${id}/visibility`, { ...data })
};

export const patchUserInterface = (id, data) => {
    return service.patch(`admin/spaces/${id}/userInterface`, { ...data })
};

export const patchGuidedTours = (id, data) => {
    return service.patch(`admin/spaces/${id}/guidedTours`, { ...data })
};

export const patchTileMenu = (id, data) => {
    return service.patch(`admin/spaces/${id}/tile/settings`, { ...data })
};

export const getPoiList = (id, params) => {
    return service.get(`admin/spaces/${id}/poi`, { params });
};

export const updatePoi = (spaceId, poiId, data) => {
    return service.patch(`admin/spaces/${spaceId}/poi/${poiId}`, { ...data })
};

export const uploadPoiMedia = (poiId, data) => {
    return service.post(`admin/spaces/poi/${poiId}/image`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

export const deletePoiMedia = (poiId) => {
    return service.delete(`admin/spaces/poi/${poiId}/image`)
};

export const uploadPoiIcon = (poiId, data) => {
    return service.post(`admin/spaces/poi/${poiId}/icon`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

export const deletePoiIcon = (poiId) => {
    return service.delete(`admin/spaces/poi/${poiId}/icon`)
};


export const deletePoi = (spaceId, poiId) => {
    return service.delete(`admin/spaces/${spaceId}/poi/${poiId}`)
}

export const getCategories = (spaceId, params) => {
    return service.get(`admin/spaces/${spaceId}/category`, { params })
}

export const addCategories = (spaceId, data) => {
    return service.post(`admin/spaces/${spaceId}/category`, { ...data })
}

export const deleteCategories = (spaceId, categoryId) => {
    return service.delete(`admin/spaces/${spaceId}/category/${categoryId}`)
}

export const updateCategories = (spaceId, categoryId, data) => {
    return service.patch(`admin/spaces/${spaceId}/category/${categoryId}`, { ...data })
}

export const createPoi = (spaceId, data) => {
    return service.post(`admin/spaces/${spaceId}/poi`, { ...data })
}

export const getPhotoSetting = (spaceId) => {
    return service.get(`admin/spaces/${spaceId}/takePhotoSettings`)
}

export const updatePhotoSetting = (spaceId, data) => {
    return service.post(`admin/spaces/${spaceId}/takePhotoSettings`, { ...data })
}

export const createSpacePhoto = (spaceId, data) => {
    return service.post(`admin/spaces/${spaceId}/downloads`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getDownloadsSpace = (spaceId, params) => {
    return service.get(`admin/spaces/${spaceId}/downloads`, { params })
}

export const deleteDownloadsSpace = (spaceId, data) => {
    return service.delete(`admin/spaces/${spaceId}/downloads`, {
        ...data
    })
}

export const getFrontendUser = (spaceId, params) => {
    return service.get(`admin/spaces/${spaceId}/feusers`, { params })
}

export const createFrontendUser = (spaceId, data) => {
    return service.post(`admin/spaces/${spaceId}/feusers`, { ...data })
}

export const updateFrontendUser = (spaceId, id, data) => {
    return service.patch(`admin/spaces/${spaceId}/feusers/${id}`, { ...data })
}

export const deleteFrontendUser = (spaceId, id) => {
    return service.delete(`admin/spaces/${spaceId}/feusers/${id}`)
}

export const createOrderPlan = (data) => {
    return service.post(`admin/spaces/floorplan/order`, { ...data })
}

export const getMiniMap = (spaceId) => {
    return service.get(`admin/spaces/${spaceId}/minimapInfo`)
}

export const updateMiniMap = (spaceId, id, data) => {
    return service.patch(`admin/spaces/${spaceId}/minimapInfo/${id}`, { ...data })
}

export const getImageForMinimap = (imageId) => {
    return service.get(`db-files/${imageId}`, { responseType: "blob" })
}

export const deleteImageForMinimap = (imageId) => {
    return service.delete(`admin/spaces/minimap/${imageId}/delete-image`)
}

export const uploadMinimapPhoto = (spaceId, floor, data) => {
    return service.post(`admin/spaces/${spaceId}/minimap/${floor}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const createSpace = (data) => {
    return service.post(`admin/spaces`, { ...data })
}

export const addUserToSpace = (id, data) => {
    return service.post(`admin/spaces/${id}/feusers/add-to-space`, { ...data })
}

export const sendResetPassword = (spaceIs, userIs) => {
    return service.post(`admin/spaces/${spaceIs}/feusers/${userIs}/send-password-reset`)
}

export const fetchSpaceCollab = params => {
    return service.get(`admin/spaces/${params.id}/collaborators`, {
        params: { ...params },
    })
};

export const addSpaceCollab = (id, data) => {
    return service.post(`admin/spaces/${id}/collaborators`, {
        ...data
    })
};

export const fetchSpaceUser = params => {
    return service.get(`admin/spaces/${params.id}/users`, {
        params: { ...params },
    })
};

export const addSpaceUser = (id, data) => {
    return service.post(`admin/spaces/${id}/users`, {
        ...data
    })
};

export const updateSpaceName = (id, data) => {
    return service.patch(`admin/spaces/${id}`, {
        ...data
    })
};

export const fetchTile = spaceId => {
    return service.get(`admin/spaces/${spaceId}/menu`)
};

export const createSimpleTile = (id, data) => {
    return service.post(`admin/spaces/${id}/tile`, {
        ...data
    })
};

export const createHeroTile = (id, data) => {
    return service.patch(`admin/spaces/${id}/hero`, {
        ...data
    })
};

export const uploadMediaTile = (id, data) => {
    return service.post(`admin/spaces/${id}/tileMedia`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteSimpleTile = (spaceId, tileId) => {
    return service.delete(`admin/spaces/${spaceId}/tile/${tileId}`)
}

export const updateSimpleTile = (spaceId, tileId, data) => {
    return service.patch(`admin/spaces/${spaceId}/tile/${tileId}`, { ...data })
}
export const uploadTileMedia = (data) => {
  return service.post(`admin/spaces/tiles/image`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};