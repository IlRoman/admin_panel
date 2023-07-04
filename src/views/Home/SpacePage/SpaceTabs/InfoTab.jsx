import React, { useState } from 'react';
import './space-tabs.scss';
import { ContactTab } from './InfoTabs/ContactTab';
import { TitleAndAddressTab } from './InfoTabs/TitleAndAddressTab';

export const InfoTab = ({ spaceData, setSpaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
    const [tab, setTab] = useState('Title and Address');

    return (
        <div className='space-tab info-tab'>
            <h2 className='space-tab__title'>{`Edit ${spaceData?.name || 'space'}`}</h2>

            <div className='info-tab__tabs'>
                <div
                    className={`info-tab__tab ${tab === 'Title and Address' ? 'info-tab__tab_active' : ''}`}
                    onClick={() => setTab('Title and Address')}
                >Title and Address</div>
                <div
                    className={`info-tab__tab ${tab === 'Contact' ? 'info-tab__tab_active' : ''}`}
                    onClick={() => setTab('Contact')}
                >Contact</div>
            </div>

            {tab === 'Title and Address'
                ? <TitleAndAddressTab
                    spaceData={spaceData}
                    edited={edited}
                    setEdited={setEdited}
                    handleCancelModal={handleCancelModal}
                    closeModule={closeModule}
                    handleSuccessModal={handleSuccessModal}
                />
                : <ContactTab
                    spaceData={spaceData}
                    edited={edited}
                    setEdited={setEdited}
                    handleCancelModal={handleCancelModal}
                    closeModule={closeModule}
                    handleSuccessModal={handleSuccessModal}
                />
            }
        </div>
    )
};
