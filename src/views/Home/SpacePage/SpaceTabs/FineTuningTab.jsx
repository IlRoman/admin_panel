import React, { useState } from 'react';
import './space-tabs.scss';
import { Launching } from './FineTuningTabs/Launching';
import { Visibility } from './FineTuningTabs/Visibility.jsx';
import { UserInterface } from './FineTuningTabs/UserInterface';
import { GuidedTours } from './FineTuningTabs/GuidedTours';

export const FineTuningTab = ({ spaceData, setSpaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const [tab, setTab] = useState('Launching');

    const renderTab = () => {
        switch (tab) {
            case 'Launching':
                return (
                    <Launching
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        edited={edited}
                        setEdited={setEdited}
                        handleCancelModal={handleCancelModal}
                        closeModule={closeModule}
                        handleSuccessModal={handleSuccessModal}
                    />
                )
            case 'Visibility':
                return (
                    <Visibility
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        edited={edited}
                        setEdited={setEdited}
                        handleCancelModal={handleCancelModal}
                        closeModule={closeModule}
                        handleSuccessModal={handleSuccessModal}
                    />
                )
            case 'User Interface':
                return (
                    <UserInterface
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        edited={edited}
                        setEdited={setEdited}
                        handleCancelModal={handleCancelModal}
                        closeModule={closeModule}
                        handleSuccessModal={handleSuccessModal}
                    />
                )
            case 'Guided Tours':
                return (
                    <GuidedTours
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        edited={edited}
                        setEdited={setEdited}
                        handleCancelModal={handleCancelModal}
                        closeModule={closeModule}
                        handleSuccessModal={handleSuccessModal}
                    />
                )
        }
    };

    return (
        <div className='space-tab tuning-tab'>
            <h2 className='space-tab__title'>{`${spaceData?.name || 'Space'} - Fine Tuning`}</h2>

            <div className='tuning-tab__tabs'>
                <div
                    className={`tuning-tab__tab ${tab === 'Launching' ? 'tuning-tab__tab_active' : ''}`}
                    onClick={() => setTab('Launching')}
                >Launching</div>
                <div
                    className={`tuning-tab__tab ${tab === 'Visibility' ? 'tuning-tab__tab_active' : ''}`}
                    onClick={() => setTab('Visibility')}
                >Visibility</div>
                <div
                    className={`tuning-tab__tab ${tab === 'User Interface' ? 'tuning-tab__tab_active' : ''}`}
                    onClick={() => setTab('User Interface')}
                >User Interface</div>
                <div
                    className={`tuning-tab__tab ${tab === 'Guided Tours' ? 'tuning-tab__tab_active' : ''}`}
                    onClick={() => setTab('Guided Tours')}
                >Guided Tours</div>
            </div>

            {renderTab()}
        </div>
    )
};
