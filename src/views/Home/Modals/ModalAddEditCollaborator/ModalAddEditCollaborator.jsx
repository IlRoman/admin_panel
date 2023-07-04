import React, { useEffect, useReducer } from 'react';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { CustomInput } from '../../../../components/CustomInput/CustomInput';
import {
    onInputChange,
    onFocusOut,
    formsReducer,
    validateForm,
    fillFormAction,
    updateFormAction,
} from '../../../../helpers/formUtils';
import { useDispatch } from 'react-redux';
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions';
import { addCollaborator, updateCollaborator } from '../../../../crud/collaborators';
import { reduceFormData } from '../../../../helpers/reduceFormData';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './modal.scss';

const initialState = {
    fname: { value: "", touched: false, hasError: true, error: "" },
    lname: { value: "", touched: false, hasError: true, error: "" },
    company: { value: "", touched: false, hasError: true, error: "" },
    jobTitle: { value: "", touched: false, hasError: true, error: "" },
    email: { value: "", touched: false, hasError: true, error: "" },
    street: { value: "", touched: false, hasError: true, error: "" },
    city: { value: "", touched: false, hasError: true, error: "" },
    zip: { value: "", touched: false, hasError: true, error: "" },
    phoneNumber: { value: "", touched: false, hasError: true, error: "" },
    website: { value: "", touched: false, hasError: true, error: "" },
    isFormValid: false,
};

export const ModalAddEditCollaborator = ({ closeModal, current, loadData }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useReducer(formsReducer, initialState);

    useEffect(() => {
        if (current) {
            setFormData(
                fillFormAction({
                    fname: { value: current.fname, touched: false, hasError: true, error: "" },
                    lname: { value: current.lname, touched: false, hasError: true, error: "" },
                    company: { value: current.company, touched: false, hasError: true, error: "" },
                    jobTitle: { value: current.jobTitle, touched: false, hasError: true, error: "" },
                    email: { value: current.email, touched: false, hasError: true, error: "" },
                    street: { value: current.street, touched: false, hasError: true, error: "" },
                    city: { value: current.city, touched: false, hasError: true, error: "" },
                    zip: { value: current.zip, touched: false, hasError: true, error: "" },
                    phoneNumber: { value: current.phonePrefix + current.phoneNumber, touched: false, hasError: true, error: "" },
                    website: { value: current.website, touched: false, hasError: true, error: "" },
                    isFormValid: false,
                })
            )
        }
    }, [current]);

    const handleAddCollaborator = () => {
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            let phoneData = '';
            if (typeof formData.phoneNumber.value === 'string') {
                phoneData = parsePhoneNumber(formData.phoneNumber.value);
            }
            const data = reduceFormData(formData);
            if (!data.website) {
                delete data.website
            }
            data.country = phoneData.country;
            data.phone = {
                phoneNumber: phoneData.nationalNumber,
                phonePrefix: '+' + phoneData.countryCallingCode,
            };
            delete data.phoneNumber;
            addCollaborator(data)
                .then(() => {
                    dispatch(hideLoaderAction());
                    closeModal();
                    loadData();
                })
                .catch(err => {
                    if (err?.response?.data?.message === 'email already in use') {
                        setFormData(updateFormAction({
                            name: 'email',
                            value: formData.email.value,
                            hasError: true,
                            error: 'email already in use',
                            touched: true,
                            isFormValid: false,
                        }))
                    } else if (err?.response?.data?.message[0] === "website must be an URL address") {
                        setFormData(updateFormAction({
                            name: 'website',
                            value: formData.website.value,
                            hasError: true,
                            error: 'website must be an URL address',
                            touched: true,
                            isFormValid: false,
                        }))
                    }
                })
        }
    };

    const onUpdateCollaborator = () => {
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            let phoneData = '';
            if (typeof formData.phoneNumber.value === 'string') {
                phoneData = parsePhoneNumber(formData.phoneNumber.value);
            }
            const data = reduceFormData(formData);
            if (!data.website || data.website.trim() === "") {
                delete data.website
            }
            data.country = phoneData.country;
            data.phone = {
                phoneNumber: phoneData.nationalNumber,
                phonePrefix: '+' + phoneData.countryCallingCode,
            };
            delete data.phoneNumber;
            updateCollaborator(current.id, data)
                .then(() => {
                    dispatch(hideLoaderAction());
                    closeModal();
                    loadData();
                })
                .catch(err => {
                    if (err?.response?.data?.message === 'email already in use') {
                        setFormData(updateFormAction({
                            name: 'email',
                            value: formData.email.value,
                            hasError: true,
                            error: 'email already in use',
                            touched: true,
                            isFormValid: false,
                        }))
                    } else if (err?.response?.data?.message[0] === "website must be an URL address") {
                        setFormData(updateFormAction({
                            name: 'website',
                            value: formData.website.value,
                            hasError: true,
                            error: 'website must be an URL address',
                            touched: true,
                            isFormValid: false,
                        }))
                    }
                })
        }
    };

    return (
        <div className="add-edit-collaborator-modal">
            <CustomModal
                title={`${current ? 'Edit' : "Add"} Collaborator`}
                close={closeModal}
                submit={current ? onUpdateCollaborator : handleAddCollaborator}
            >
                <div className="add-edit-collaborator-modal__input-container">
                    <div className="add-edit-collaborator-modal__input-name">First Name</div>
                    <CustomInput
                        name="fname"
                        formData={formData.fname}
                        onChange={e => onInputChange("fname", e.target.value, setFormData, formData)}
                        onBlur={e => {
                            onFocusOut("fname", e.target.value, setFormData, formData)
                        }}
                        variantError="topright"
                    />
                </div>
                <div className="add-edit-collaborator-modal__input-container">
                    <div className="add-edit-collaborator-modal__input-name">Last Name</div>
                    <CustomInput
                        name="lname"
                        formData={formData.lname}
                        onChange={e => onInputChange("lname", e.target.value, setFormData, formData)}
                        onBlur={e => {
                            onFocusOut("lname", e.target.value, setFormData, formData)
                        }}
                        variantError="topright"
                    />
                </div>
                <div className="add-edit-collaborator-modal__input-container">
                    <div className="add-edit-collaborator-modal__input-name">Company</div>
                    <CustomInput
                        name="company"
                        formData={formData.company}
                        onChange={e => onInputChange("company", e.target.value, setFormData, formData)}
                        onBlur={e => {
                            onFocusOut("company", e.target.value, setFormData, formData)
                        }}
                        variantError="topright"
                    />
                </div>
                <div className="add-edit-collaborator-modal__input-container">
                    <div className="add-edit-collaborator-modal__input-name">Job title</div>
                    <CustomInput
                        name="jobTitle"
                        formData={formData.jobTitle}
                        onChange={e => onInputChange("jobTitle", e.target.value, setFormData, formData)}
                        onBlur={e => {
                            onFocusOut("jobTitle", e.target.value, setFormData, formData)
                        }}
                        variantError="topright"
                    />
                </div>
                <div className="add-edit-collaborator-modal__input-container">
                    <div className="add-edit-collaborator-modal__input-name">Email</div>
                    <CustomInput
                        name="email"
                        formData={formData.email}
                        onChange={e => onInputChange("email", e.target.value, setFormData, formData)}
                        onBlur={e => {
                            onFocusOut("email", e.target.value, setFormData, formData)
                        }}
                        variantError="topright"
                        maxLength={100}
                    />
                </div>
                <div className="add-edit-collaborator-modal__input-container">
                    <div className="add-edit-collaborator-modal__input-name">Street</div>
                    <CustomInput
                        name="street"
                        formData={formData.street}
                        onChange={e => onInputChange("street", e.target.value, setFormData, formData)}
                        onBlur={e => {
                            onFocusOut("street", e.target.value, setFormData, formData)
                        }}
                        variantError="topright"
                    />
                </div>
                <div className="flex-sb">
                    <div className="add-edit-collaborator-modal__input-container add-edit-collaborator-modal__city">
                        <div className="add-edit-collaborator-modal__input-name">City</div>
                        <CustomInput
                            name="city"
                            formData={formData.city}
                            onChange={e => onInputChange("city", e.target.value, setFormData, formData)}
                            onBlur={e => {
                                onFocusOut("city", e.target.value, setFormData, formData)
                            }}
                            variantError="topright"
                        />
                    </div>
                    <div className="add-edit-collaborator-modal__input-container add-edit-collaborator-modal__zip">
                        <div className="add-edit-collaborator-modal__input-name">Zip</div>
                        <CustomInput
                            name="zip"
                            formData={formData.zip}
                            onChange={e => onInputChange("zip", e.target.value, setFormData, formData)}
                            onBlur={e => {
                                onFocusOut("zip", e.target.value, setFormData, formData)
                            }}
                            variantError="topright"
                            maxLength={25}
                        />
                    </div>
                </div>
                <div className="add-edit-collaborator-modal__input-container">
                    <div className="add-edit-collaborator-modal__input-name">Country / Phone</div>
                    {
                        formData.phoneNumber.touched && formData.phoneNumber.hasError &&
                        <div className='phone-input-error-text'>{formData.phoneNumber.error || 'This field if required'}</div>
                    }

                    <PhoneInput
                        value={formData.phoneNumber.value}
                        onChange={value => onInputChange('phoneNumber', value, setFormData, formData)}
                        onBlur={() => onFocusOut('phoneNumber', formData.phoneNumber.value, setFormData, formData)}
                        className={formData.phoneNumber.touched && formData.phoneNumber.hasError ? 'phone-input-error' : ''}
                        maxLength={18}
                    />

                </div>
                <div className="add-edit-collaborator-modal__input-container">
                    <div className="add-edit-collaborator-modal__input-name">Website</div>
                    <CustomInput
                        formData={formData.website}
                        onChange={e => onInputChange("website", e.target.value, setFormData, formData)}
                        onBlur={e => {
                            onFocusOut("website", e.target.value, setFormData, formData)
                        }}
                        variantError="topright"
                    />
                </div>
            </CustomModal >
        </div >
    )
};
