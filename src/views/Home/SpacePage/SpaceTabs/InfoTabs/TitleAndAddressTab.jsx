import React, { useReducer } from 'react';
import { CustomInput } from '../../../../../components/CustomInput/CustomInput';
import {
    onInputChange,
    onFocusOut,
    formsReducer,
    fillFormAction,
    validateForm,
    updateFormAction
} from '../../../../../helpers/formUtils';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../../redux/actions';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';
import { editSpaceMainInfo } from '../../../../../crud/spaces/spaces';
import { CustomRadio } from '../../../../../components/CustomRadio/CustomRadio';
import { useEffect } from 'react';
import { CustomTextArea } from '../../../../../components/CustomTextArea/CustomTextArea';
import { reduceFormData } from '../../../../../helpers/reduceFormData';

const initialState = {
    name: { value: '', touched: false, hasError: true, error: '' },
    presentedBy: { value: '', touched: false, hasError: true, error: '' },
    address: { value: '', touched: false, hasError: true, error: '' },
    addressVisibility: { value: { name: 'None', value: 'none' }, touched: false, hasError: true, error: '' },
    externalUrl: { value: '', touched: false, hasError: true, error: '' },
    summary: { value: '', touched: false, hasError: true, error: '' },
    isFormValid: false,
};

export const TitleAndAddressTab = ({ spaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useReducer(formsReducer, initialState);

    useEffect(() => {
        if (spaceData) {
            let addressVisibility =
                spaceData.addressVisibility === 'full'
                    ? { name: 'Full Address', value: 'full' }
                    : spaceData.addressVisibility === 'partial'
                        ? { name: 'City Only', value: 'partial' }
                        : spaceData.addressVisibility === 'none'
                            ? { name: 'None', value: 'none' }
                            : { name: '', value: '' }

            setFormData(fillFormAction({
                name: { value: spaceData.name, touched: false, hasError: true, error: '' },
                presentedBy: { value: spaceData.presentedBy, touched: false, hasError: true, error: '' },
                address: { value: spaceData.address, touched: false, hasError: true, error: '' },
                addressVisibility: { value: addressVisibility, touched: false, hasError: true, error: '' },
                externalUrl: { value: spaceData.externalUrl, touched: false, hasError: true, error: '' },
                summary: { value: spaceData.summary, touched: false, hasError: true, error: '' },
                isFormValid: false,
            }));
        }
    }, [spaceData]);

    const submitForm = () => {
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            editSpaceMainInfo(location.pathname.split('/')[3], reduceFormData(formData))
                .then(() => {
                    dispatch(hideLoaderAction());
                    handleSuccessModal();
                })
        }
    };

    return (
        <>
            <div className="space-tab__input-container">
                <h2 className='space-tab__title'>Main Info</h2>

                <div className="space-tab__input-name">Title</div>
                <CustomInput
                    name="name"
                    formData={formData.name}
                    onChange={e => {
                        setEdited(true);
                        onInputChange("name", e.target.value, setFormData, formData);
                    }}
                    onBlur={e => {
                        onFocusOut("name", e.target.value, setFormData, formData)
                    }}
                    variantError="topright"
                />

                <div className="space-tab__input-name">Presented By</div>
                <CustomInput
                    name="presentedBy"
                    formData={formData.presentedBy}
                    onChange={e => {
                        setEdited(true);
                        onInputChange("presentedBy", e.target.value, setFormData, formData);
                    }}
                    onBlur={e => onFocusOut("presentedBy", e.target.value, setFormData, formData)}
                    variantError="topright"
                />

                <div className="space-tab__input-name">Public Address</div>
                <CustomInput
                    name="address"
                    formData={formData.address}
                    onChange={e => {
                        setEdited(true);
                        onInputChange("address", e.target.value, setFormData, formData);
                    }}
                    onBlur={e => onFocusOut("address", e.target.value, setFormData, formData)}
                    variantError="topright"
                />
            </div>

            <h2 className='space-tab__title'>Adress Visibility</h2>
            <CustomRadio
                data={[
                    { name: 'Full Address', value: 'full' },
                    { name: 'City Only', value: 'partial' },
                    { name: 'None', value: 'none' }
                ]}
                onChange={value => {
                    setEdited(true);
                    onInputChange("addressVisibility", value, setFormData, formData);
                }}
                value={formData.addressVisibility.value}
            />

            <div className="space-tab__input-name">External Website</div>
            <CustomInput
                name="externalUrl"
                formData={formData.externalUrl}
                onChange={e => {
                    setEdited(true);
                    onInputChange("externalUrl", e.target.value, setFormData, formData);
                }}
                onBlur={e => onFocusOut("externalUrl", e.target.value, setFormData, formData)}
                variantError="topright"
            />

            <div className="space-tab__input-name">Summary</div>
            <div className='space-tab__textarea'>
                <CustomTextArea
                    name="summary"
                    formData={formData.summary}
                    onChange={e => {
                        setEdited(true);
                        onInputChange("summary", e.target.value, setFormData, formData);
                    }}
                    onBlur={e => onFocusOut("summary", e.target.value, setFormData, formData)}
                    variantError="topright"
                />
            </div>

            <div className='space-tab__buttons'>
                <div className="space-tab__cancel-btn">
                    <CustomButton
                        name="Cancel"
                        variant="grey"
                        onClick={(e) => {
                            e.preventDefault();
                            if (edited) {
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
