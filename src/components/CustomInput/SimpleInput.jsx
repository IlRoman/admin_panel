import React from 'react';
import search from '../../assets/icons/search.png';
import './input.scss';

export const SimpleInput = ({
    value,
    placeholder,
    onChange,
    maxLength = 255,
    isSearch = false,
}) => {

    return (
        <div className="custom-input">
            <input
                className="custom-input__input"
                type="text"
                placeholder={placeholder || ''}
                value={value || ''}
                onChange={onChange}
                maxLength={maxLength}
            />

            {isSearch && (
                <div className="custom-input-icon-container">
                    <img alt="search" src={search} className="custom-input-icon" />
                </div>
            )}
        </div>
    )
};
