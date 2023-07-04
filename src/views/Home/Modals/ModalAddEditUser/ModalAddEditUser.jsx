import React, { useEffect, useReducer } from 'react';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { CustomInput } from '../../../../components/CustomInput/CustomInput';
import { CustomDropdown } from '../../../../components/CustomDropdown/CustomDropdown';
import {
    onInputChange,
    onFocusOut,
    formsReducer,
    fillFormAction,
    validateForm,
    updateFormAction
} from '../../../../helpers/formUtils';
import { reduceFormData } from '../../../../helpers/reduceFormData';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import { addUser, updateUser } from '../../../../crud/users';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../redux/actions';
import './modal.scss';

const initialState = {
    fname: { value: "", touched: false, hasError: true, error: "" },
    lname: { value: "", touched: false, hasError: true, error: "" },
    email: { value: "", touched: false, hasError: true, error: "" },
    company: { value: "", touched: false, hasError: true, error: "" },
    jobTitle: { value: "", touched: false, hasError: true, error: "" },
    street: { value: "", touched: false, hasError: true, error: "" },
    city: { value: "", touched: false, hasError: true, error: "" },
    zip: { value: "", touched: false, hasError: true, error: "" },
    phoneNumber: { value: "", touched: false, hasError: true, error: "" },
    type: { value: "", touched: false, hasError: true, error: "" },
    isFormValid: false,
};

export const ModalAddEditUser = ({ closeModal, current, loadData }) => {
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
                    type: { value: current.type == 'none' ? '' : { name: current.type, value: current.type }, touched: false, hasError: true, error: "" },
                    isFormValid: false,
                })
            )
        }
    }, [current]);

    const handleAddUser = () => {
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            const phoneData = parsePhoneNumber(formData.phoneNumber.value);
            const data = reduceFormData(formData);
            data.country = phoneData.country;
            data.phone = {
                phoneNumber: phoneData.nationalNumber,
                phonePrefix: '+' + phoneData.countryCallingCode,
            };
            delete data.phoneNumber;
            data.role = 'user'
            if(!data.type){
                data.type = 'none'
            }
           /* if (data.type?.value?.trim() === '') {
                data.type = 'none';
            } else {
                data.type = data.type.value;
            }*/
            addUser(data)
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
                    }
                })
        }
    };

    const onUpdateUser = () => {
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            const phoneData = parsePhoneNumber(formData.phoneNumber.value);
            const data = reduceFormData(formData);
            data.country = phoneData.country;
            data.phone = {
                phoneNumber: phoneData.nationalNumber,
                phonePrefix: '+' + phoneData.countryCallingCode,
            };
            delete data.phoneNumber;
            if (!data.type) {
                data.type = 'none'
            } else {
            }
            data.role = 'user'
            updateUser(current.id, data)
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
                    }
                })
        }
    };

    return (
        <div className="add-edit-user-modal">
            <CustomModal
                title={`${current ? 'Edit' : "Add"} User`}
                close={closeModal}
                submit={current ? onUpdateUser : handleAddUser}
            >
                <div className="add-edit-user-modal__input-container">
                    <div className="add-edit-user-modal__input-name">First Name</div>
                    <CustomInput
                        formData={formData.fname}
                        onChange={e => onInputChange('fname', e.target.value, setFormData, formData)}
                        onBlur={e => onFocusOut('fname', e.target.value, setFormData, formData)}
                        variantError="topright"
                    />
                </div>
                <div className="add-edit-user-modal__input-container">
                    <div className="add-edit-user-modal__input-name">Last Name</div>
                    <CustomInput
                        formData={formData.lname}
                        onChange={e => onInputChange('lname', e.target.value, setFormData, formData)}
                        onBlur={e => onFocusOut('lname', e.target.value, setFormData, formData)}
                        variantError="topright"
                    />
                </div>
                <div className="add-edit-user-modal__input-container">
                    <div className="add-edit-user-modal__input-name">Email</div>
                    <CustomInput
                        formData={formData.email}
                        onChange={e => onInputChange('email', e.target.value, setFormData, formData)}
                        onBlur={e => onFocusOut('email', e.target.value, setFormData, formData)}
                        variantError="topright"
                        maxLength={100}
                    />
                </div>
                <div className="add-edit-user-modal__input-container">
                    <div className="add-edit-user-modal__input-name">Job Title</div>
                    <CustomInput
                        formData={formData.jobTitle}
                        onChange={e => onInputChange('jobTitle', e.target.value, setFormData, formData)}
                        onBlur={e => onFocusOut('jobTitle', e.target.value, setFormData, formData)}
                        variantError="topright"
                    />
                </div>
                <div className="add-edit-user-modal__input-container">
                    <div className="add-edit-user-modal__input-name">Company</div>
                    <CustomInput
                        formData={formData.company}
                        onChange={e => onInputChange('company', e.target.value, setFormData, formData)}
                        onBlur={e => onFocusOut('company', e.target.value, setFormData, formData)}
                        variantError="topright"
                    />
                </div>
                <div className="add-edit-user-modal__input-container">
                    <div className="add-edit-user-modal__input-name">Street</div>
                    <CustomInput
                        formData={formData.street}
                        onChange={e => onInputChange('street', e.target.value, setFormData, formData)}
                        onBlur={e => onFocusOut('street', e.target.value, setFormData, formData)}
                        variantError="topright"
                    />
                </div>
                <div className="flex-sb">
                    <div className="add-edit-user-modal__input-container add-edit-user-modal__city">
                        <div className="add-edit-user-modal__input-name">City</div>
                        <CustomInput
                            formData={formData.city}
                            onChange={e => onInputChange('city', e.target.value, setFormData, formData)}
                            onBlur={e => onFocusOut('city', e.target.value, setFormData, formData)}
                            variantError="topright"
                        />
                    </div>
                    <div className="add-edit-user-modal__input-container add-edit-user-modal__zip">
                        <div className="add-edit-user-modal__input-name">Zip</div>
                        <CustomInput
                            formData={formData.zip}
                            onChange={e => onInputChange('zip', e.target.value, setFormData, formData)}
                            onBlur={e => onFocusOut('zip', e.target.value, setFormData, formData)}
                            variantError="topright"
                            maxLength={25}
                        />
                    </div>
                </div>
                <div className="add-edit-user-modal__input-container">
                    <div className="add-edit-user-modal__input-name">Country / Phone</div>
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
                <div className="add-edit-user-modal__input-container">
                    <div className="add-edit-user-modal__input-name">Type</div>
                    <CustomDropdown
                        formData={formData.type}
                        value={formData.type.value.name}
                        onChange={value => onInputChange('type', value, setFormData, formData)}
                        onBlur={value => onFocusOut('type', value, setFormData, formData)}
                        options={[
                            { name: 'Matterport Service Providers', value: 'Matterport Service Providers' },
                            { name: 'Akrotonx Employees', value: 'Akrotonx Employees' },
                            { name: 'Akrotonx Freelancers', value: 'Akrotonx Freelancers' },
                        ]}
                        variant="grey"
                        isCancelButton={true}
                    />
                </div>
            </CustomModal >
        </div>
    )
};
