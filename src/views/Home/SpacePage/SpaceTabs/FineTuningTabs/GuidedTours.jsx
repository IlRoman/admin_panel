import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../../redux/actions';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';
import { CustomSwitcher } from '../../../../../components/CustomSwitcher/CustomSwitcher';
import { CustomInput } from '../../../../../components/CustomInput/CustomInput';
import { patchGuidedTours } from '../../../../../crud/spaces/spaces';
import { showSimpleModalAction } from '../../../../../redux/actions';

const switchers = [
    {
        title: 'Pan',
        text: <p>
            Gently pan once you reach a new highlight in a Guided Tour
        </p>,
        fieldName: 'pan',
    },
    {
        title: 'Loop',
        text: <p>
            Loop back to the beginning once you reach the end
        </p>,
        fieldName: 'loop',
    },
    {
        title: 'Call To Action',
        text: <p>
            Call to action at the end of tour
        </p>,
        fieldName: 'callToAction',
    },
];

export const GuidedTours = ({ spaceData, setSpaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        pan: false,
        loop: false,
        callToAction: false
    });

    useEffect(() => {
        if (spaceData) {
            setFormData({ ...spaceData.guidedTours });
        }
    }, [spaceData]);

    const submitForm = () => {
        dispatch(showLoaderAction());
        patchGuidedTours(
            location.pathname.split('/')[3],
            formData
        )
            .then(res => {
                dispatch(hideLoaderAction());
                setSpaceData(prev => ({
                    ...prev,
                    guidedTours: { ...res.data },
                }));
                setEdited(false);
                dispatch(showSimpleModalAction({
                    title: 'Edited succsessfully'
                }));
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
                Guided Tours are defined as the automatic progression <br />
                through the highlight reel when the user presses the “Play” <br />
                button.
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
