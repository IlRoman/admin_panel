import React from 'react'
import './Loader.scss'
import ClipLoader from "react-spinners/ClipLoader";

export const CustomLoader = () => {
    return (
        <div className="custom-loader">
            <div className="background" />
            <div className="loader">
                <ClipLoader size={150} />
            </div>
        </div>
    )
};