import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../../redux/actions';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';
import { CustomSwitcher } from '../../../../../components/CustomSwitcher/CustomSwitcher';
import { SimpleInput } from '../../../../../components/CustomInput/SimpleInput';
import { useLocation } from 'react-router-dom';
import { patchLaunching } from '../../../../../crud/spaces/spaces';
import { showSimpleModalAction } from '../../../../../redux/actions';

const switchers = [
    {
        title: 'Help',
        text: 'Show Help at Start of Virtual Tour',
        fieldName: 'help',
    },
    {
        title: 'New Tab (Mobile only)',
        text: <p>
            Only for mobile. If a Matterport model is embedded on a <br />
            webpage, then when user presses the play button, 3D Showcase <br />
            opens in a new browser tab
        </p>,
        fieldName: 'newTab',
    },
    {
        title: 'Autoplay in iFrame',
        text: <p>
            Automatically opens the Matterport model when the iframe loads <br />
            on the page where it is embedded
        </p>,
        fieldName: 'autoplay',
    },
    {
        title: 'Quickstart',
        text: <p>
            Enable: go straight into Inside View; disable:zoom in from <br />
            Dollhouse View; Only works if Start Position is Inside View
        </p>,
        fieldName: 'quickstart',
    },
    {
        title: 'Guided Tour Delay (seconds)',
        text: <p>
            Number of seconds after initial fly-in before the Guided Tour <br />
            automatically starts. Help is not shown. Set to a negative number <br />
            to not start the Guided Tour
        </p>,
        fieldName: 'guidedTourDelay',
    },
    {
        title: 'Highlight Reel Visible',
        text: <p>
            Keep the highlight reel visible upon launch - <br />
            see also Visibility
        </p>,
        fieldName: 'highlightReelLaunching',
    },
];

export const Launching = ({ spaceData, setSpaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [formData, setFormData] = useState({
        help: false,
        newTab: false,
        autoplay: false,
        quickstart: false,
        guidedTourDelay: 0,
        highlightReelLaunching: false,
        status: false
    });

    useEffect(() => {
        if (spaceData) {
            setFormData({ ...spaceData.launching });
        }
    }, [spaceData]);

    const submitForm = () => {
        dispatch(showLoaderAction());
        if (!formData.guidedTourDelay) formData.guidedTourDelay = 0;
        patchLaunching(
            location.pathname.split('/')[3],
            formData
        )
            .then(res => {
                dispatch(hideLoaderAction());
                setSpaceData(prev => ({
                    ...prev,
                    launching: { ...res.data },
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

    const handleChange = e => {
        const reg = /^-?\d*\.?\d*$/;
        if (reg.test(e.target.value)) {
            setFormData(prev => ({
                ...prev,
                guidedTourDelay: +e.target.value,
            }))
        }
    };

    return (
        <>
            <div className='space-tab__subtitle'>
                This will happen when the User starts
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
                                        <SimpleInput
                                            value={formData.guidedTourDelay}
                                            onChange={handleChange}
                                            isSearch={false}
                                            placeholder='0'
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
