import React, { useState, useEffect, useRef } from 'react';
import dangerIcon from '../../assets/icons/danger.png';
import search from '../../assets/icons/search.png';
import eye from '../../assets/icons/eye.svg';
import eyeCrossedOut from '../../assets/icons/eye-crossed-out.svg';
import './input.scss';

export const CustomInput = ({
    type,
    formData,
    placeholder,
    onChange,
    isSearch,
    onBlur,
    maxLength = 255,
    disabled,
    variantError = 'aside',  /* aside or topright */
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animation, setAnimation] = useState(false);
    const ref = useRef();

    useEffect(() => {
        setTimeout(() => {
            setAnimation(true);
        }, 200)
    }, [formData]);

    const handleChange = (e) => {
        setAnimation(false);
        onChange(e);
    };

    const getType = () => {
        if (type === 'password') {
            if (isVisible) {
                return 'text';
            } else {
                return 'password';
            }
        }
        return type || 'text'
    };

    const handleShow = () => {
        setIsVisible(prev => !prev);
    };

    const isVisibleEye = type === 'password';

    const getEyeStyle = () => {
        if (formData?.touched && formData?.hasError && variantError === 'aside') {
            return {
                paddingRight: '35px'
            }
        } return {};
    };

    return (
        <div className={`custom-input ${formData?.hasError && formData?.touched ? 'custom-input_error' : ''}`} ref={ref}>
            <input
                className={`custom-input__input ${formData?.hasError && formData?.touched ? 'custom-input__input_error' : ''}`}
                type={getType()}
                placeholder={placeholder || ''}
                value={formData?.value || ''}
                onChange={handleChange}
                maxLength={maxLength}
                onBlur={onBlur}
                disabled={disabled}
            />

            {isSearch && (
                <div className="custom-input-icon-container">
                    <img alt="search" src={search} className="custom-input-icon" />
                </div>
            )}

            {isVisibleEye && (
                <div
                    className="custom-input-icon-container pointer"
                    onClick={handleShow}
                    style={getEyeStyle()}
                >
                    <img alt="eye" src={isVisible ? eyeCrossedOut : eye} className="custom-input-icon" />
                </div>
            )}

            {formData?.touched && formData?.hasError && variantError === 'aside' && (
                <>
                    <img
                        className={`custom-input__image ${animation ? 'custom-input__image_animated' : ''}`}
                        src={dangerIcon}
                        alt="error"
                    />
                    {formData?.error && (
                        <div className={`custom-input__err-container ${animation ? 'custom-input__err-container_animated' : ''}`}>
                            <div className="custom-input__err-text">{formData?.error}</div>
                        </div>
                    )}
                </>
            )}

            {formData?.touched && formData?.hasError && variantError === 'topright' && (
                <div className="custom-input__topright-err">
                    {formData?.error}
                </div>
            )}
        </div>
    )
};
