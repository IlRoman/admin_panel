import React, { useState, useEffect, } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomDropdown } from '../../components/CustomDropdown/CustomDropdown';
import './sign-up.scss';
import { showLoaderAction, hideLoaderAction, setLanguage } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { validateStep1, validateStep2 } from './validate';
import { SignUpPage } from './SignUp';
import { WelcomePage } from './WelcomePage';
import { ConfirmationPage } from './ConfirmationPage';
import logo from '../../assets/icons/logo.png';

const languages = [
    { name: 'English', value: 'en' },
    { name: 'Deutsch', value: 'ru' },
    { name: 'Italian', value: 'ru' }
];

const SignUp = () => {
    const [step, setStep] = useState(1);
    const { i18n } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const lang = useSelector(state => state.profile.language);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email_address: '',
        company: '',
        password: '',
        validate_password: '',
        street: '',
        zip: '',
        city: '',
        country: {},
        phone_number: '',
    });
    const [errors, setErrors] = useState({
        first_name: null,
        last_name: null,
        email_address: null,
        company: null,
        password: null,
        validate_password: null,
        street: null,
        zip: null,
        city: null,
        country: null,
        phone_number: null,
    });

    useEffect(() => {
        if (i18n) {
            i18n.changeLanguage(lang.value);
        }
    }, [i18n, lang]);

    const onChangeLanguage = (value) => {
        dispatch(setLanguage(value))
    };

    const resetErrors = () => {
        setErrors({
            first_name: null,
            last_name: null,
            email_address: null,
            company: null,
            password: null,
            validate_password: null,
        })
    };

    const resetError = (name) => {
        setErrors(prev => {
            return {
                ...prev,
                [name]: null,
            }
        })
    };

    const onChangeInput = (value, name) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        resetError(name);
    };

    const handleValidateStep1 = () => {
        return validateStep1(formData, setErrors)
    };

    const handleValidateStep2 = () => {
        return validateStep2(formData, setErrors)
    };

    const handleSubmit = () => {
        // need fix
        resetErrors();

        if (step === 1) {
            if (handleValidateStep1()) {
                dispatch(showLoaderAction())
                setTimeout(() => {
                    setStep(2)
                    return dispatch(hideLoaderAction())
                }, 2000)
            }
        }

        if (step === 2) {
            if (handleValidateStep2()) {
                dispatch(showLoaderAction())
                setTimeout(() => {
                    setStep(3)
                    return dispatch(hideLoaderAction())
                }, 2000)
            }
        }

        if (step === 3) {
            dispatch(showLoaderAction())
            setTimeout(() => {
                history.push('/login');
                return dispatch(hideLoaderAction())
            }, 2000)
        }
    };

    return (
        <div className="sign-up-page">
            <div className="main-block">
                <div className="logo">
                    <img src={logo} alt="logo" />
                </div>
                <div className="form">
                    <div className="form__head flex-sb">
                        <h4 className="form__title">
                            {/* need translate */}
                            {step === 1 && 'Sign Up'}
                            {step === 2 && 'Address'}
                            {step === 3 && 'Confirmation'}
                        </h4>
                        <div className="form__language">
                            <CustomDropdown
                                variant="white"
                                placeholder={lang.name}
                                value={lang}
                                onChange={onChangeLanguage}
                                options={languages}
                                serch={false}
                            />
                        </div>
                    </div>

                    {step === 1 && (
                        <SignUpPage
                            handleSubmit={handleSubmit}
                            onChangeInput={onChangeInput}
                            formData={formData}
                            errors={errors}
                            validate={handleValidateStep1}
                        />
                    )}
                    {step === 2 && (
                        <WelcomePage
                            handleSubmit={handleSubmit}
                            onChangeInput={onChangeInput}
                            formData={formData}
                            errors={errors}
                            validate={handleValidateStep2}
                        />
                    )}
                    {step === 3 && (
                        <ConfirmationPage
                            handleSubmit={handleSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    )
};

export default SignUp;
