import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../../redux/actions';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';
import { CustomSwitcher } from '../../../../../components/CustomSwitcher/CustomSwitcher';
import { patchVisibility } from '../../../../../crud/spaces/spaces';
import { showSimpleModalAction } from '../../../../../redux/actions';

const switchers = [
    {
        title: 'Dollhouse View',
        text: <p>
            Show Dollhouse View in: Fly-In, Bottom Left Corner (Button), <br />
            Highlight Reel (Snapshot)
        </p>,
        fieldName: 'dollhouseViewVisibility',
    },
    {
        title: 'Floorplan',
        text: <p>
            Show Floorplan Button
        </p>,
        fieldName: 'floorplanVisibility',
    },
    {
        title: 'Guided Tour Buttons',
        text: <p>
            Show Guided Tour Buttons
        </p>,
        fieldName: 'guidedTourButtonsVisibility',
    },
    {
        title: 'Highlight Reel',
        text: <p>
            Show highlight ree
        </p>,
        fieldName: 'highlightReelVisibility',
    },
    {
        title: 'Remove Info Panel',
        text: <p>
            {'Remove the “Info” panel in the top-left corner after loading'} <br />
            {'COMMENT: enabled > mls=2; disabled > mps = 1'}
        </p>,
        fieldName: 'removeInfoPanelVisibility',
    },
    {
        title: 'POIs',
        text: <p>
            (Show POIs)
        </p>,
        fieldName: 'poisVisibility',
    },
    {
        title: 'Pins',
        text: <p>
            Show placed 360º Views pins in Dollhouse and Floor Plan
        </p>,
        fieldName: 'pinsVisibility',
    },
    {
        title: 'Portal',
        text: <p>
            Show placed 360º Views connection portals while in Inside View
        </p>,
        fieldName: 'portalVisibility',
    },
    {
        title: 'Conference Call',
        text: <p>
            Enable Conference Call Button
        </p>,
        fieldName: 'conferenceCallVisibility',
    },
    {
        title: 'VR Button',
        text: <p>
            Show Virtual Reality Button
        </p>,
        fieldName: 'vrButtonVisibility',
    },
    {
        title: 'Share Button',
        text: <p>
            Show Link Share Button
        </p>,
        fieldName: 'shareButtonVisibility',
    },
];

export const Visibility = ({ spaceData, setSpaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        pinsVisibility: false,
        poisVisibility: false,
        portalVisibility: false,
        vrButtonVisibility: false,
        floorplanVisibility: false,
        shareButtonVisibility: false,
        dollhouseViewVisibility: false,
        highlightReelVisibility: false,
        conferenceCallVisibility: false,
        removeInfoPanelVisibility: false,
        guidedTourButtonsVisibility: false
    });

    useEffect(() => {
        if (spaceData) {
            setFormData({ ...spaceData.visibility });
        }
    }, [spaceData]);

    const submitForm = () => {
        dispatch(showLoaderAction());
        patchVisibility(
            location.pathname.split('/')[3],
            formData
        )
            .then(res => {
                dispatch(hideLoaderAction());
                setSpaceData(prev => ({
                    ...prev,
                    visibility: { ...res.data },
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
                What the user will see
            </div>
            {switchers.map((elem, index) => {
                return (
                    <div className={`space-tab__switcher-container ${index + 1 === switchers.length ? 'last' : ''}`}>
                        <div className='space-tab__switcher-text-block'>
                            <div className='space-tab__switcher-title'>{elem.title}</div>
                            <div className='space-tab__switcher-text'>{elem.text}</div>
                        </div>
                        <div className='space-tab__switcher'>
                            <CustomSwitcher
                                checked={formData[elem.fieldName]}
                                onChange={() => handleSwitch(elem.fieldName)}
                            />
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
