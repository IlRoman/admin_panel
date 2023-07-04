import React, { useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CustomInput } from '../../components/CustomInput/CustomInput';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import './login-page.scss';
import { showLoaderAction, hideLoaderAction, setLanguage, setMe } from '../../redux/actions';
import logo from '../../assets/icons/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { login, fetchMe } from '../../crud/auth';
import {
    onInputChange,
    onFocusOut,
    formsReducer,
    validateForm,
    updateFormAction,
} from '../../helpers/loginFormUtils';

const initialState = {
    email: { value: "", touched: false, hasError: true, error: "" },
    password: { value: "", touched: false, hasError: true, error: "" },
    isFormValid: false,
};

export const LoginPage = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [formData, setFormData] = useReducer(formsReducer, initialState);
    const lang = useSelector(state => state.profile.language);

    const getUserInfo = () => {
        fetchMe()
            .then(res => {
                dispatch(setMe(res.data));
                history.push('/home/spaces?page=1');
            })
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction())
            login(formData.email.value, formData.password.value, lang.name.toLowerCase())
                .then(res => {
                    localStorage.setItem('akroton_access_token', res.data.accessToken);
                    dispatch(hideLoaderAction());
                    getUserInfo();
                })
                .catch(err => {
                    dispatch(hideLoaderAction());
                    let message = err?.response?.data?.message;
                    if (+err?.response?.status === 401 || message === 'Wrong password') {
                        setFormData(updateFormAction({
                            ...formData.email,
                            name: 'email',
                            touched: true,
                            hasError: true,
                            error: message, /*'The Email Address or password was entered incorrectly. Please try again',*/
                            isFormValid: false,
                        }))
                        setFormData(updateFormAction({
                            ...formData.password,
                            name: 'password',
                            touched: true,
                            hasError: true,
                            error: message,
                            isFormValid: false,
                        }))
                    }
                })
        }
    };

    return (
        <div className="login-page">
            <div className="main-block">
                <div className="logo">
                    <img src={logo} alt="logo" />
                </div>
                <form className="form">
                    <div className="form__head flex-sb">
                        <h4 className="form__title">
                            {t('login')}
                        </h4>
                    </div>
                    <div className="form__input">
                        <CustomInput
                            type="email"
                            placeholder={`Email ${t('address')}`}
                            formData={formData.email}
                            onChange={e => onInputChange('email', e.target.value, setFormData, formData)}
                            onBlur={e => onFocusOut('email', e.target.value, setFormData, formData)}
                        />
                    </div>
                    <div className="form__input">
                        <CustomInput
                            type="password"
                            placeholder={t('password')}
                            formData={formData.password}
                            onChange={e => onInputChange('password', e.target.value, setFormData, formData)}
                            onBlur={e => onFocusOut('password', e.target.value, setFormData, formData)}
                        />
                    </div>
                    <div className="flex-sb">
                        <div />
                        <Link to="/forgot-password">
                            <div className="text pointer">
                                {`${t('forgot.password')}?`}
                            </div>
                        </Link>
                    </div>

                    <div className="form__button">
                        <CustomButton
                            type='submit'
                            name={"Login"}
                            onClick={handleSubmit}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
};
