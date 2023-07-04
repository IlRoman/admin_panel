import React, { useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { CustomTextArea } from '../../../../components/CustomTextArea/CustomTextArea';
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions';
import { sendInviteToCollaborator } from '../../../../crud/collaborators';
import { sendInviteToUser } from '../../../../crud/users';
import './modal.scss';
import {
    onInputChange,
    onFocusOut,
    formsReducer,
    validateForm,
    updateFormAction
} from '../../../../helpers/formUtils';
import { reduceFormData } from '../../../../helpers/reduceFormData';

const initialState = {
    message: { value: '', touched: false, hasError: true, error: '' },
    isFormValid: false,
};

export const ModalInvite = ({ variant, current, closeModal }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useReducer(formsReducer, initialState);

    const submit = () => {
        if (validateForm(formData, setFormData)) {
            if (variant === 'collaborator') {
                dispatch(showLoaderAction())
                sendInviteToCollaborator(current.id, formData.message.value)
                    .then(() => {
                        dispatch(hideLoaderAction());
                        setTimeout(() => {
                            closeModal();
                        }, 500);
                    })
            } else {
                dispatch(showLoaderAction())
                sendInviteToUser(current.id, formData.message.value)
                    .then(() => {
                        dispatch(hideLoaderAction());
                        setTimeout(() => {
                            closeModal();
                        }, 500);
                    })
            }
        }
    };

    return (
        <div className="invite-modal">
            <CustomModal
                title={`Send Invite to ${current?.fname} ${current?.lname}`}
                close={closeModal}
                submit={submit}
                submitBtn="Send"
                cancelBtn="Cancel"
            >
                <div className='invite-modal__textarea'>
                    <div className='invite-modal__additional-text'>Additional Text</div>
                    <CustomTextArea
                        maxLength={255}
                        formData={formData.message}
                        onChange={e => onInputChange('message', e.target.value, setFormData, formData)}
                        onBlur={e => onFocusOut('message', e.target.value, setFormData, formData)}
                    />
                </div>
            </CustomModal>
        </div>
    )
};
