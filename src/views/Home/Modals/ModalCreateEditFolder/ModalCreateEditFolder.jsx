import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { CustomInput } from '../../../../components/CustomInput/CustomInput';
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions';
import { createFolder, renameFolder } from '../../../../crud/spaces/folders';
import './modal.scss';
import {
    onInputChange,
    onFocusOut,
    formsReducer,
    validateForm,
    fillFormAction,
    updateFormAction,
} from '../../../../helpers/formUtils';

const initialState = {
    title: { value: '', touched: false, hasError: true, error: '' },
    isFormValid: false,
};

export const ModalCreateEditFolder = ({ closeModal, loadData, thisFolder, current }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useReducer(formsReducer, initialState);

    useEffect(() => {
        if (current) {
            setFormData(fillFormAction({
                title: { value: current.entity.title, touched: false, hasError: true, error: '' },
                isFormValid: false,
            }))
        }
    }, [current]);

    const submit = () => {
        if (validateForm(formData, setFormData)) {
            dispatch(showLoaderAction());
            if (!current) {
                let parent = thisFolder?.id ? thisFolder.id : 1;
                createFolder({ title: formData.title.value, parent })
                    .then(() => {
                        loadData();
                        dispatch(hideLoaderAction());
                        closeModal();
                    })
                    .catch(err => {
                        if (err?.response?.data?.message) {
                            let error = err?.response?.data?.message
                            if(error === "folder exists ") error = 'This name is already in use'
                            dispatch(hideLoaderAction());
                            setFormData(updateFormAction({
                                ...formData.title,
                                name: 'title',
                                touched: true,
                                hasError: true,
                                error: error,
                                isFormValid: false,
                            }));
                        }
                    })
            } else {
                renameFolder({ id: current.entity.id, title: formData.title.value })
                    .then(() => {
                        loadData();
                        dispatch(hideLoaderAction());
                        closeModal();
                    }).catch(err => {
                    if (err?.response?.data?.message) {
                        let error = err?.response?.data?.message
                        if(error === "folder exists") error = 'This name is already in use'
                        dispatch(hideLoaderAction());
                        setFormData(updateFormAction({
                            ...formData.title,
                            name: 'title',
                            touched: true,
                            hasError: true,
                            error: error,
                            isFormValid: false,
                        }));
                    }
                })
            }
        }
    };

    return (
        <div className="create-folder-modal">
            <CustomModal
                title={current ? 'Rename Folder' : 'Add Folder'}
                close={closeModal}
                submit={submit}
                submitBtn={current ? 'Rename' : 'Add'}
                cancelBtn="Cancel"
            >
                <div className='create-folder-modal__input'>
                    <div className='create-folder-modal__input-label'>Name of the folder</div>
                    <CustomInput
                        formData={formData.title}
                        onChange={e => onInputChange('title', e.target.value, setFormData, formData)}
                        onBlur={e => onFocusOut('title', e.target.value, setFormData, formData)}
                        variantError='topright'
                    />
                </div>
            </CustomModal>
        </div>
    )
};
