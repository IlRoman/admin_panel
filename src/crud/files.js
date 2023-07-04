import service from './service';

export const getImage = (url) => {
    return service.get(url, { responseType: "blob" })
};
