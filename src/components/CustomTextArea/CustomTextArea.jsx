import React, { useState, useEffect, useRef } from 'react';
import dangerIcon from '../../assets/icons/danger.png';
import search from '../../assets/icons/search.png';
import eye from '../../assets/icons/eye.svg';
import eyeCrossedOut from '../../assets/icons/eye-crossed-out.svg';
import './textarea.scss';

export const CustomTextArea = ({
    type,
    formData,
    placeholder,
    onChange,
    isSearch,
    onBlur,
    maxLength = 1000,
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
        setAnimation(false);
    };

    const isVisibleEye = type === 'password' && !formData.error;

    return (
        <div className={`custom-textarea ${formData?.hasError && formData?.touched ? 'custom-textarea_error' : ''}`} ref={ref}>
            <textarea
                className={`custom-textarea__input ${formData?.hasError && formData?.touched ? 'custom-textarea__input_error' : ''}`}
                type={getType()}
                placeholder={placeholder || ''}
                value={formData?.value || ''}
                onChange={handleChange}
                maxLength={maxLength}
                onBlur={onBlur}
            />

            {isSearch && (
                <div className="custom-textarea-icon-container">
                    <img alt="search" src={search} className="custom-textarea-icon" />
                </div>
            )}

            {isVisibleEye && (
                <div
                    className="custom-textarea-icon-container pointer"
                    onClick={handleShow}
                >
                    <img alt="eye" src={isVisible ? eyeCrossedOut : eye} className="custom-textarea-icon" />
                </div>
            )}

            {formData?.touched && formData?.hasError && variantError === 'aside' && (
                <>
                    <img
                        className={`custom-textarea__image ${animation ? 'custom-textarea__image_animated' : ''}`}
                        src={dangerIcon}
                        alt="error"
                    />
                    {formData?.error && (
                        <div className={`custom-textarea__err-container ${animation ? 'custom-textarea__err-container_animated' : ''}`}>
                            <div className="custom-textarea__err-text">{formData?.error}</div>
                        </div>
                    )}
                </>
            )}

            {formData?.touched && formData?.hasError && variantError === 'topright' && (
                <div className="custom-textarea__topright-err">
                    {formData?.error}
                </div>
            )}
        </div>
    )
};
