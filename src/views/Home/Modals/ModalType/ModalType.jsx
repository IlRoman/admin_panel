import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions';
import { updateUser } from '../../../../crud/users';
import './modal.scss';
import { CustomDropdown } from '../../../../components/CustomDropdown/CustomDropdown';

export const ModalType = ({ closeModal, current, loadData }) => {
    const dispatch = useDispatch();
    const [type, setType] = useState('');

    useEffect(() => {
        if (current) {
            if (current.type !== 'none') {
                setType({
                    name: current.type,
                    value: current.type
                })
            }
        }
    }, [current]);

    const submit = () => {
        dispatch(showLoaderAction());
        updateUser(current.id, {
            ...current,
            type: type?.name || 'none',
            phone: {
                phoneNumber: current.phoneNumber,
                phonePrefix: current.phonePrefix,
            }
        })
            .then(() => {
                loadData();
                dispatch(hideLoaderAction());
                closeModal();
            })
    };

    const handleChange = value => {
        setType(value);
    };

    return (
        <div className="type-modal">
            <CustomModal
                title={`Set Type for ${current?.fname} ${current?.lname}`}
                close={closeModal}
                submit={submit}
                submitBtn="Save"
                cancelBtn="Cancel"
            >
                <div>
                    <div className='type-modal__label'>Type</div>
                    <div className='type-modal__dropdown'>
                        <CustomDropdown
                            value={type?.name}
                            onChange={handleChange}
                            options={[
                                { name: 'Matterport Service Providers', value: 'Matterport Service Providers' },
                                { name: 'Akrotonx Employees', value: 'Akrotonx Employees' },
                                { name: 'Akrotonx Freelancers', value: 'Akrotonx Freelancers' },
                            ]}
                            variant="grey"
                            isCancelButton={true}
                        />
                    </div>
                </div>
            </CustomModal >
        </div>
    )
};
