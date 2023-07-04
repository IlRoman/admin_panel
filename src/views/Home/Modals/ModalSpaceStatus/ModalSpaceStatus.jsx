import React from 'react';
import { useDispatch } from 'react-redux';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions';
import { changeSpaceStatus } from '../../../../crud/spaces/spaces';
import './modal.scss';


export const ModalSpaceStatus = ({ current, closeModal, loadData }) => {
    const dispatch = useDispatch();

    const submit = () => {
        dispatch(showLoaderAction());
        changeSpaceStatus({ status: !current?.entity?.status, id: current?.entity?.id })
            .then(() => {
                dispatch(hideLoaderAction());
                closeModal();
                loadData();
            })
    };

    return (
        <div className="space-status-modal">
            <CustomModal
                title={<>Do you really want <br /> to {current?.status ? 'deactivate' : 'activate'} this space?</>}
                close={closeModal}
                submit={submit}
                submitBtn="Yes"
                cancelBtn="No"
            >
            </CustomModal>
        </div>
    )
};
