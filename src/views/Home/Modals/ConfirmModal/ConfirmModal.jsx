import React from 'react';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import './modal.scss';

export const ConfirmModal = ({ title, cancelBtn, submitBtn, submit, close, text }) => {
    return (
        <div className='confirm-modal'>
            <CustomModal
                title={title}
                cancelBtn={cancelBtn}
                submitBtn={submitBtn}
                submit={submit}
                close={close}
            >
                <p>{text}</p>
            </CustomModal>
        </div>
    )
};
