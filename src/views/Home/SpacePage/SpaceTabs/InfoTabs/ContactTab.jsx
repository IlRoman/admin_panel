import React, { useReducer, useEffect } from 'react';
import { CustomInput } from '../../../../../components/CustomInput/CustomInput';
import {
    onInputChange,
    onFocusOut,
    formsReducer,
    fillFormAction,
    validateForm,
} from '../../../../../helpers/formUtils';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../../redux/actions';
import PhoneInput from 'react-phone-number-input';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';
import { editSpaceContact } from '../../../../../crud/spaces/spaces';
import { reduceFormData } from '../../../../../helpers/reduceFormData';

const initialState2 = {
    contactName: { value: "", touched: false, hasError: true, error: "" },
    contactEmail: { value: "", touched: false, hasError: true, error: "" },
    contactPhone: { value: "", touched: false, hasError: true, error: "" },
    isFormValid: false,
};

export const ContactTab = ({ spaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useReducer(formsReducer, initialState2);

    useEffect(() => {
        if (spaceData) {
            setFormData(fillFormAction({
                contactName: { value: spaceData.contact.contactName, touched: false, hasError: true, error: "" },
                contactEmail: { value: spaceData.contact.contactEmail, touched: false, hasError: true, error: "" },
                contactPhone: { value: spaceData.contact.contactPhone, touched: false, hasError: true, error: "" },
                isFormValid: false,
            }));
        }
    }, [spaceData]);

    const submitForm = () => {
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            editSpaceContact(location.pathname.split('/')[3], reduceFormData(formData))
                .then(() => {
                    dispatch(hideLoaderAction());
                    handleSuccessModal();
                })
        }
    };

    return (
        <>
            <div className="space-tab__input-container" style={{ marginTop: '60px' }}>
                <div className="space-tab__input-name">Contact Name</div>
                <CustomInput
                    placeholder="Contact Name"
                    name="contactName"
                    formData={formData.contactName}
                    onChange={e => {
                        setEdited(true);
                        onInputChange("contactName", e.target.value, setFormData, formData);
                    }}
                    onBlur={e => onFocusOut("contactName", e.target.value, setFormData, formData)}
                    variantError="topright"
                />
            </div>
            <div className="space-tab__input-container">
                <div className="space-tab__input-name">Contact Email</div>
                <CustomInput
                    name="contactEmail"
                    placeholder="Contact Email"
                    formData={formData.contactEmail}
                    onChange={e => {
                        setEdited(true);
                        onInputChange("contactEmail", e.target.value, setFormData, formData);
                    }}
                    onBlur={e => onFocusOut("contactEmail", e.target.value, setFormData, formData)}
                    variantError="topright"
                />
            </div>
            <div className="space-tab__input-container" style={{ position: 'relative' }}>
                <div className="space-tab__input-name">Contact Phone</div>
                {
                    formData.contactPhone.touched && formData.contactPhone.hasError &&
                    <div className='phone-input-error-text'>{formData.contactPhone.error || 'This field if required'}</div>
                }

                <PhoneInput
                    value={formData.contactPhone.value}
                    onChange={value => {
                        setEdited(true);
                        onInputChange('contactPhone', value, setFormData, formData);
                    }}
                    onBlur={() => onFocusOut('contactPhone', formData.contactPhone.value, setFormData, formData)}
                    className={formData.contactPhone.touched && formData.contactPhone.hasError ? 'phone-input-error' : ''}
                    maxLength={18}
                />
            </div>
            <div className='space-tab__buttons'>
                <div className="space-tab__cancel-btn">
                    <CustomButton
                        name="Cancel"
                        variant="grey"
                        onClick={(e) => {
                            e.preventDefault();
                            if(edited) {
                                handleCancelModal();
                            } else {
                                closeModule();
                            }
                        }}
                    />
                </div>
                <div className="space-tab__submit-btn">
                    <CustomButton
                        variant="green"
                        name="Save"
                        onClick={(e) => {
                            e.preventDefault();
                            submitForm();
                        }}
                    />
                </div>
            </div>
        </>
    )
};
