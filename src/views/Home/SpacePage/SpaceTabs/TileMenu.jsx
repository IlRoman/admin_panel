import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../redux/actions';
import { CustomButton } from '../../../../components/CustomButton/CustomButton';
import { CustomSwitcher } from '../../../../components/CustomSwitcher/CustomSwitcher';
import { patchTileMenu } from '../../../../crud/spaces/spaces';
import { showSimpleModalAction } from '../../../../redux/actions';
import { CustomDropdown } from '../../../../components/CustomDropdown/CustomDropdown';

const switchers = [
    {
        title: <></>,
        text: 'Show Tile Menu',
        fieldName: 'showTileMenu',
    },
    {
        title: <></>,
        text: 'Show At Start',
        fieldName: 'showAtStart',
    },
    {
        title: 'Layout Settings',
        text: <p>Show Hero</p>,
        fieldName: 'showHero',
    },
];

export const TileMenu = ({ spaceData, setSpaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        showTileMenu: false,
        showAtStart: false,
        showHero: false,
        layoutColumns: { name: '1', value: '1' },
        help:false,
    });

    useEffect(() => {
        if (spaceData) {
            setFormData({
                ...spaceData.tileSettings,
                layoutColumns: {
                    name: spaceData.tileSettings.layoutColumns,
                    value: spaceData.tileSettings.layoutColumns,
                }
            });
        }
    }, [spaceData]);

    const submitForm = () => {
        dispatch(showLoaderAction());
        formData.layoutColumns = formData.layoutColumns.value;
        patchTileMenu(
            location.pathname.split('/')[3],
            formData
        )
            .then(res => {
                dispatch(hideLoaderAction());
                setSpaceData(prev => ({
                    ...prev,
                    tileSettings: { ...res.data },
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

    const handleChange = value => {
        setFormData(prev => ({
            ...prev,
            layoutColumns: value,
        }))
    };

    return (
        <div className='space-tab tilemenu-tab'>
            <h2 className='space-tab__title'>{`${spaceData?.name || 'Space'} - Tile Menu`}</h2>

            {switchers.map((elem, index) => {
                return (
                    <div className="space-tab__switcher-container" key={index}>
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

            <div className='space-tab__switcher-text' style={{ marginTop: '20px' }}>Number of Columns</div>
            <CustomDropdown
                variant="grey"
                value={formData.layoutColumns.value}
                onChange={handleChange}
                options={[
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 },
                    { name: '4', value: 4 },
                    { name: '5', value: 5 },
                ]}
            />

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
        </div>
    )
};
