import React from 'react';
import { useDispatch } from 'react-redux';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions';
import { resetPasswordForCollaborator } from '../../../../crud/collaborators';
import { resetPasswordForUser } from '../../../../crud/users';
import './modal.scss';

export const ModalResetPassword = ({ variant, closeModal, current }) => {
    const dispatch = useDispatch();

    const submit = () => {
        dispatch(showLoaderAction());
        if (variant === 'collaborator') {
            resetPasswordForCollaborator(current.id)
                .then(() => {
                    dispatch(hideLoaderAction());
                    closeModal();
                })
        } else {
            resetPasswordForUser(current.id)
                .then(() => {
                    dispatch(hideLoaderAction());
                    closeModal();
                })
        }
    };

    return (
        <div className="delete-modal">
            <CustomModal
                title="Reset Password"
                close={closeModal}
                submit={submit}
                submitBtn="Confirm"
                cancelBtn="Cancel"
            >
                <p>
                    {`Please confirm resetting User Password. An Email will be sent to ${current?.fname} ${current?.lname}`}
                </p>
            </CustomModal >
        </div>
    )
};
