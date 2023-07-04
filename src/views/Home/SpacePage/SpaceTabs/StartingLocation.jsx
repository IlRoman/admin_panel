import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { CustomButton } from '../../../../components/CustomButton/CustomButton';
import { ImageComponent } from '../../../../components/ImageComponent/ImageComponent';
import { setPhotoAndLocation } from '../../../../crud/spaces/spaces';
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions';
import { ReactComponent as Eye } from '../../../../assets/icons/eye.svg';
import { dataURLtoFile } from '../../../../helpers/base64ToFile';

export const StartingLocation = ({ showcase }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [toolTip, setTooltip] = useState(false);
    const [photoHovered, setPhotoHovered] = useState(false);
    // const []

    const onSubmit = () => {
        if (showcase) {
            dispatch(showLoaderAction());
            let currentLocation = null;
            let screenshotFile = null;
            showcase.Camera.getPose()
                .then(res => {
                    currentLocation = res;
                    const resolution = {
                        width: 1968,
                        height: 688,
                    };
                    showcase.Camera.takeScreenShot(resolution)
                        .then(res => {
                            screenshotFile = res;
                            const formData = new FormData();
                            formData.set('file', dataURLtoFile(screenshotFile, 'screenshot'));
                            formData.append('label', '');
                            formData.append('zoom', '1');
                            formData.append('viewMode', 'photo2D');
                            formData.append('position', JSON.stringify(currentLocation.position));
                            formData.append('rotation', JSON.stringify(currentLocation.rotation));
                            formData.append('isStarting', true);
                            setPhotoAndLocation(location.pathname.split('/')[3], formData)
                                .then(() => {
                                    dispatch(hideLoaderAction());
                                })
                        })
                })
        }
    };

    return (
        <div className='starting-location-tab'>
            <div
                className='starting-location-tab__photo-wrapper'
                onMouseOver={() => setPhotoHovered(true)}
                onMouseLeave={() => setPhotoHovered(false)}
            >
                <ImageComponent src={`admin/spaces/${location.pathname.split('/')[3]}/preview?mode=prev`} />

                {photoHovered && (
                    <>
                        <div className='starting-location-tab__photo-background' />
                        <div className='starting-location-tab__photo-eye'>
                            <Eye fill='#A3D164' />
                        </div>
                        <div className='starting-location-tab__photo-text'>Click to preview</div>
                    </>
                )}
            </div>

            <div className='starting-location-tab__button-wrapper'>
                <div className='starting-location-tab__set-location-button'>
                    <div className={`starting-location-tab__tooltip ${toolTip ? 'starting-location-tab__tooltip_active' : ''}`}>
                        Set current location as <br />
                        starting location
                    </div>

                    <CustomButton
                        name="Set Starting Location"
                        onMouseOver={() => setTooltip(true)}
                        onMouseLeave={() => setTooltip(false)}
                        onClick={onSubmit}
                        disabled={!showcase}
                    />
                </div>
            </div>
        </div>
    )
};
