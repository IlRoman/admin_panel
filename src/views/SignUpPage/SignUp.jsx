import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CustomInput } from '../../components/CustomInput/CustomInput';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import './sign-up.scss';

export const SignUpPage = ({
    handleSubmit,
    onChangeInput,
    formData,
    errors,
    validate,
}) => {

    useEffect(() => {
        document.onkeydown = (e) => {
            if (e.key === 'Enter') {
                handleSubmit();
            };
        };
    });

    const { t } = useTranslation();

    return (
        <>
            <div className="form__input">
                <CustomInput
                    type="text"
                    placeholder={"First Name"}
                    value={formData.first_name}
                    onChange={onChangeInput}
                    name="first_name"
                    error={errors.first_name}
                    maxLength={255}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomInput
                    type="text"
                    placeholder={"Last Name"}
                    value={formData.last_name}
                    onChange={onChangeInput}
                    name="last_name"
                    error={errors.last_name}
                    maxLength={255}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomInput
                    type="email"
                    placeholder={`Email ${t('address')}`}
                    value={formData.email}
                    onChange={onChangeInput}
                    name="email"
                    error={errors.email}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomInput
                    type="text"
                    placeholder={`Company`}
                    value={formData.company}
                    onChange={onChangeInput}
                    name="company"
                    error={errors.company}
                    maxLength={255}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomInput
                    type="text"
                    placeholder={`Job title`}
                    value={formData.job_title}
                    onChange={onChangeInput}
                    name="job_title"
                    error={errors.job_title}
                    maxLength={255}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomInput
                    type="password"
                    placeholder={t('password')}
                    value={formData.password}
                    onChange={onChangeInput}
                    name="password"
                    error={errors.password}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomInput
                    type="password"
                    placeholder={`Confirm Password`}
                    value={formData.validate_password}
                    onChange={onChangeInput}
                    name="validate_password"
                    error={errors.validate_password}
                    onBlur={validate}
                />
            </div>

            <div className="form__button">
                <CustomButton
                    name={"Continue"}
                    onClick={handleSubmit}
                />
            </div>


            <div className="form__bottom-text">
                Already have an account?
                <Link to="/login">
                    <span>Login</span>
                </Link>
            </div>
        </>
    )
};
