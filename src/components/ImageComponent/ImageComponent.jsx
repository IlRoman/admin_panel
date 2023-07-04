import React, { useState, useEffect } from 'react';
import { getImage } from '../../crud/files';

export const ImageComponent = ({ src, alt }) => {
    const [url, setUrl] = useState();

    useEffect(() => {
        src && getImage(src)
            .then(res => {
                const reader = new window.FileReader();
                reader.readAsDataURL(res.data);
                reader.onload = function () {
                    setUrl(reader.result)
                }
            })
    }, [src])

    return (
        url ? <img src={url} alt={alt || ''} /> : <></>
    )
};
