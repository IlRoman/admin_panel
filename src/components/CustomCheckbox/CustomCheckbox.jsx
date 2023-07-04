import React from 'react';
import check from '../../assets/icons/check.png';
import './checkbox.scss';

export const CustomCheckbox = ({ label, checked, onChange }) => {
    return (
        <div className="custom-checkbox">
            <div
                className="checkbox"
                onClick={onChange}
            >
                {checked && <img src={check} alt="checked" />}
            </div>
            <div
                className="label pointer"
                onClick={onChange}
            >
                {label}
            </div>
        </div>
    )
};
