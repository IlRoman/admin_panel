import React from 'react';
import './switcher.scss';

export const CustomSwitcher = ({ checked, onChange,...props }) => {
    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                {...props}
            />
            <span className="slider round" />
        </label>
    )
};
