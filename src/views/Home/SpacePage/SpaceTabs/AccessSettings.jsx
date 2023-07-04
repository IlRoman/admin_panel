import React, { useState } from 'react';
import './space-tabs.scss';
import { Categories } from './AccessSettings/Categories';
import FrontendUsers from './AccessSettings/FrontendUsers';
import {ReactComponent as Plus} from '../../../../assets/icons/plus.svg'

const AccessSettings = ({ spaceData, setSpaceData, edited, setEdited, handleCancelModal, closeModule, handleSuccessModal }) => {
  const [tab, setTab] = useState('User');
  const [addNew, setAddNew] = useState('');

  const handleCreate = (e) =>{
    e.preventDefault();
    if(tab ==='User'){
      setAddNew('User')
    }else{
      setAddNew('Category')
    }
  }

  return (
    <div className='space-tab info-tab'>
      <h2 className='space-tab__title'>{`Edit ${spaceData?.name || 'space'}`}</h2>

      <div className='info-tab__tabs access-settings__tabs'>
        <div className='access-settings__tab'>
          <div
            className={`info-tab__tab ${tab === 'User' ? 'info-tab__tab_active' : ''}`}
            onClick={() => setTab('User')}
          >Frontend Users</div>
          <div
            className={`info-tab__tab ${tab === 'Category' ? 'info-tab__tab_active' : ''}`}
            onClick={() => setTab('Category')}
          >Categories</div>
        </div>
        <div className='access-settings__button'>
          <span> Add {tab}</span>
          <button
            onClick={handleCreate}
            className='access-settings__btn'>
            <Plus/>
          </button>
        </div>
        </div>


      {tab === 'User'
        ? <FrontendUsers
          spaceData={spaceData}
          addNew={addNew}
          setAddNew={setAddNew}
        />
        : <Categories
          spaceData={spaceData}
          addNew={addNew}
          setAddNew={setAddNew}
        />
      }
    </div>
  )
};

 export default AccessSettings
