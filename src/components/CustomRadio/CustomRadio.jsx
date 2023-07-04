import React from 'react';
import './radio.scss';

export const CustomRadio = ({ data, value, onChange }) => {
    const handleChange = elem => {
        onChange(elem);
    };

    return (
        <div className="custom-radio">
            {data.map(elem => {
                return (
                    <div
                        className="custom-radio__elem" key={elem.name}
                        onClick={() => handleChange(elem)}
                    >
                        <div
                            className={`custom-radio__checkbox ${value?.name === elem.name ? 'custom-radio__checkbox_checked' : ''}`}>
                            {value?.name === elem.name && (
                                <div className="custom-radio__dot" />
                            )}
                        </div>
                        <div className="custom-radio__title">{elem.name || ''}</div>
                    </div>
                )
            })}
        </div>
    )
};
