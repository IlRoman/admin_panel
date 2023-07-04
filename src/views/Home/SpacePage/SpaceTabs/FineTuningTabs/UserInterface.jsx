import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../../redux/actions';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';
import { CustomSwitcher } from '../../../../../components/CustomSwitcher/CustomSwitcher';
import { CustomInput } from '../../../../../components/CustomInput/CustomInput';
import { patchUserInterface } from '../../../../../crud/spaces/spaces';
import { showSimpleModalAction } from '../../../../../redux/actions';

const switchers = [
    {
        title: 'Floors',
        text: <p>
            Let the user navigate the 3D model floor by floor. If disabled, <br />
            option to switch floors is disabled and model is treated as “all one <br />
            floor”
        </p>,
        fieldName: 'floorsEnabled',
    },
    {
        title: 'No Zoom',
        text: <p>
            Disable zooming in 3D Showcase
        </p>,
        fieldName: 'zoomDisabled',
    },
    {
        title: 'Scroll Wheel',
        text: <p>
            Enables scroll wheel input from the mouse, so the 3D model can <br />
            zoom in
        </p>,
        fieldName: 'scrollWheel',
    },
];

export const UserInterface = ({ spaceData, setSpaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        floorsEnabled: false,
        zoomDisabled: false,
        scrollWheel: false
    });

    useEffect(() => {
        if (spaceData) {
            setFormData({ ...spaceData.userInterface });
        }
    }, [spaceData]);

    const submitForm = () => {
        dispatch(showLoaderAction());
        patchUserInterface(
            location.pathname.split('/')[3],
            formData
        )
            .then(res => {
                dispatch(hideLoaderAction());
                setSpaceData(prev => ({
                    ...prev,
                    userInterface: { ...res.data },
                }));
                setEdited(false);
                dispatch(showSimpleModalAction({
                    title: 'Edited succsessfully'
                }))
            })
    };

    const handleSwitch = fieldName => {
        setEdited(true);
        setFormData(prev => {
            return {
                ...prev,
                [fieldName]: !prev[fieldName],
            }
        })
    };

    return (
        <>
            <div className='space-tab__subtitle'>
                What the user can do
            </div>
            {switchers.map((elem, index) => {
                return (
                    <div className={`space-tab__switcher-container ${index + 1 === switchers.length ? 'last' : ''}`}>
                        <div className='space-tab__switcher-text-block'>
                            <div className='space-tab__switcher-title'>{elem.title}</div>
                            <div className='space-tab__switcher-text'>{elem.text}</div>
                        </div>
                        <div className='space-tab__switcher'>
                            {elem.fieldName === 'guidedTourDelay'
                                ? (
                                    <div style={{ width: '33px', height: '34px' }}>
                                        <CustomInput

                                        />
                                    </div>
                                )
                                : (
                                    <CustomSwitcher
                                        checked={formData[elem.fieldName]}
                                        onChange={() => handleSwitch(elem.fieldName)}
                                    />
                                )}
                        </div>
                    </div>
                )
            })}

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
