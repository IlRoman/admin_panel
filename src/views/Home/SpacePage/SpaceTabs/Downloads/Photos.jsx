import React from 'react';
import { CustomCheckbox } from '../../../../../components/CustomCheckbox/CustomCheckbox'

export const Photos = ({ handleCheck,image }) => {

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
