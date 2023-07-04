import React, { useEffect, useReducer } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CustomInput } from '../../components/CustomInput/CustomInput';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { showLoaderAction, hideLoaderAction, showSimpleModalAction } from '../../redux/actions'
import { useDispatch } from 'react-redux';
import logo from '../../assets/icons/logo.png';
import { changePassword, createPasswordFE, verifyToken } from '../../crud/auth'
import { onInputChange, onFocusOut, formsReducer, updateFormAction, validateForm } from '../../helpers/formUtils';
import './new-password.scss';
import { reduceFormData } from '../../helpers/reduceFormData'

const initialState = {
    password: { value: "", touched: false, hasError: true, error: "" },
    confirm: { value: "", touched: false, hasError: true, error: "" },
    isFormValid: false,
}

export const NewPasswordPage = () => {
    const location = useLocation();
    const token = location.search.split('=')[1];
    const [formData, setFormData] = useReducer(formsReducer, initialState);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        document.onkeydown = (e) => {
            if (e.key === 'Enter') {
                handleSubmit();
            };
        };
    });

    useEffect(() => {
        if (location.pathname.split('/')[2] === 'verify') return
        verifyToken(token)
            .catch(err => {
                if (
                    err.response.data.message === 'Token invalid' ||
                    err.response.data.message === 'jwt expired' ||
                    err.response.status === 401
                ) {
                    history.push('/auth/token-expired')
                }
            })
    }, []);

    const validate = () => {
        if (formData.password.value !== formData.confirm.value) {
            setFormData(updateFormAction({
                ...formData.confirm,
                name: 'confirm',
                touched: true,
                hasError: true,
                error: 'Password does not match',
                isFormValid: false,
            }))
            return false;
        } else return true;
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (validate() && validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            if (location.pathname.split('/')[2] === 'verify') {
                let splitUrl = location?.search.split('&');
                let token = splitUrl[0].split('=')[1];
                let email = splitUrl[1]?.split('=')[1];
                let reduce = reduceFormData(formData)
                let sendObj = {
                    token,
                    email,
                    password: reduce.password,
                    passwordConfirm: reduce.confirm
                }
                createPasswordFE(sendObj).then(res => {
                    history.push('/login');
                })
                    .catch(err => {
                        const errors = err?.response?.data
                        const { error, message, statusCode } = errors;
                        dispatch(showSimpleModalAction({ title: error, text: message }))
                    })
                    .finally(() => {
                        dispatch(hideLoaderAction())
                    })
            } else {
                changePassword(formData.password.value, formData.confirm.value, token)
                    .then(() => {
                        dispatch(hideLoaderAction());
                        history.push('/login');
                    })
                    .catch(err => {
                        if (err.response.data.message === 'Token invalid') {
                            dispatch(hideLoaderAction());
                            history.push('/auth/token-expired')
                        }
                    })
            }
        }
    };

    const handleCancel = () => {
        location.pathname.split('/')[2] !== 'invite'
            ? history.push('/login')
            : window.location.pathname = 'https://akrotonx.com'
    };

    return (
        <div className="new-password-page">
            <div className="main-block">
                <div className="logo">
                    <img src={logo} alt="logo" />
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form__head flex-sb">
                        <h4>
                            {location.pathname.split('/')[2] !== 'invite'
                                ? 'New Password'
                                : 'Password Registration'
                            }
                        </h4>
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

                    <div className="form__input">
                        <CustomInput
                            type="password"
                            placeholder={t('password')}
                            formData={formData.confirm}
                            onChange={e => onInputChange('confirm', e.target.value, setFormData, formData)}
                            onBlur={e => {
                                onFocusOut('confirm', e.target.value, setFormData, formData);
                                validate();
                            }}
                        />
                    </div>

                    <div className="form__button">
                        <CustomButton
                            type='submit'
                            variant="green"
                            name={location.pathname.split('/')[2] !== 'invite' ? 'Confirm' : 'Submit'}
                            onClick={handleSubmit}
                        />
                    </div>

                    <div className="form__button">
                        <CustomButton
                            variant="grey"
                            name={"Cancel"}
                            onClick={handleCancel}
                        />
                    </div>
                </form>
            </div>
        </div >
    )
};
