import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction } from '../../../../../redux/actions';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';
import { CustomSwitcher } from '../../../../../components/CustomSwitcher/CustomSwitcher';
import { patchVisibility } from '../../../../../crud/spaces/spaces';
import { showSimpleModalAction } from '../../../../../redux/actions';
import { useLocation } from 'react-router-dom'
import { RouterPagination } from '../../../../../components/RouterPagination/RouterPagination'
import { CustomCheckbox } from '../../../../../components/CustomCheckbox/CustomCheckbox'




export const Panos = ({ handleCheck,image }) => {

  return (
    <>
      <div className='download-tab__image'>
        {image?.length ? image?.map((img,index)=>(
          <div key={index} className={`download-tab__image-item ${!img?.checked ? 'download-tab__image-item--hide' : ''}`}  >
            <img className='download-tab__image-img'  src={img?.photo}/>
            <CustomCheckbox onChange={(e)=>handleCheck(e,img)} checked={img?.checked}/>
          </div>
        )) : <p className='download-tab__centered'>No data</p>}
      </div>
    </>
  )
};
