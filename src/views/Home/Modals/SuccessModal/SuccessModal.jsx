import React from 'react';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import './modal.scss';

export const SuccessModal = ({ title, submitBtn, submit, close, text }) => {
    return (
        <div className='success-modal'>
            <CustomModal
                title={title}
                submitBtn={submitBtn}
                submit={submit}
                isCancelBtn={false}
                close={close}
            >
                {text && <p>{text}</p>}
            </CustomModal>
        </div>
    )
};
