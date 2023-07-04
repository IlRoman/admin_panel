import React, { useState, useReducer } from 'react';
import './forgot-password.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomInput } from '../../components/CustomInput/CustomInput';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { showLoaderAction, hideLoaderAction } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import logo from '../../assets/icons/logo.png';
import check from '../../assets/icons/check-green.svg';
import { forgotPassword } from '../../crud/auth';
import {
    onInputChange,
    onFocusOut,
    formsReducer,
    validateForm,
    updateFormAction
} from '../../helpers/formUtils';

const initialState = {
    email: { value: "", touched: false, hasError: true, error: "" },
    isFormValid: false,
}

export const ForgotPassword = () => {
    const [formData, setFormData] = useReducer(formsReducer, initialState)
    const [messageIsSent, setMessageIsSent] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            forgotPassword(formData.email.value)
                .then(() => {
                    setMessageIsSent(true);
                    dispatch(hideLoaderAction());
                })
                .catch(err => {
                    let message = err?.response?.data?.message;
                    if (message === 'email not found') {
                        setFormData(updateFormAction({
                            ...formData.email,
                            name: 'email',
                            touched: true,
                            hasError: true,
                            error: 'Email not found',
                            isFormValid: false,
                        }))
                    }
                })
        }
    };

    return (
        <div className="reset-password-page">
            <div className="main-block">
                <div className="logo">
                    <img src={logo} alt="logo" />
                </div>
                <form className="form">
                    <div className="form__head flex-sb">
                        <h4>Reset Password</h4>
                    </div>

                    {messageIsSent
                        ? (
                            <div className="form__main-container">
                                <div className="form__img-wrapper">
                                    <img alt="success" src={check} className="form__success-img" />
                                </div>
                                <div className="form__success-text">
                                    Check your Email. The password has been sent to you
                                </div>
                            </div>
                        )
                        : (
                            <>
                                <div className="form__input">
                                    <CustomInput
                                        type="email"
                                        placeholder={`Email ${t('address')}`}
                                        formData={formData.email}
                                        onChange={e => onInputChange('email', e.target.value, setFormData, formData)}
                                        onBlur={e => onFocusOut('email', e.target.value, setFormData, formData)}
                                    />
                                </div>

                                <div className="form__button">
                                    <CustomButton
                                        type='submit'
                                        variant="green"
                                        name={"Send Password"}
                                        onClick={handleSubmit}
                                    />
                                </div>
                            </>
                        )
                    }

                    <div className="form__bottom-text">
                        <Link to="/login" className="form__link">
                            <span className="form__arrow">{"<"}</span>
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
};
