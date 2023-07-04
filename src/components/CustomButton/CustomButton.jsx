import React from 'react';
import './button.scss';

export const CustomButton = ({
    variant,
    name,
    onClick,
    disabled,
    typeSize,
    type = '',
    onMouseOver,
    onMouseLeave,
}) => {
    return (
        <div className={`custom-button ${typeSize ? `${typeSize}` :''}`}>
            <button
                type={type}
                onClick={onClick ? onClick : () => { }}
                disabled={disabled || false}
                className={`button
                    ${disabled ? 'button_disabled' : ''}
                    ${variant || "green"}
                `}
                onMouseOver={onMouseOver && onMouseOver}
                onMouseLeave={onMouseLeave && onMouseLeave}
            >
                {name}
            </button>
        </div>
    )
};
