import React from 'react'
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { SimpleInput } from '../../../../components/CustomInput/SimpleInput';
import './MediaModal.scss';
import { onInputChange } from '../../../../helpers/formUtils'

export const MediaModal = ({title,submitBtn,submit,close,poiEdit,setPoiEdit}) => {
  const handleSetUrl = (e,type) =>{
    debugger
    onInputChange('mediaUrl', e?.target.value, setPoiEdit, poiEdit);
    onInputChange('mediaType', type, setPoiEdit, poiEdit);
  }
  return (
    <div className='media-modal'>
      <CustomModal
        title={title}
        submitBtn={submitBtn}
        submit={submit}
        isCancelBtn={false}
        close={close}
      >
        <div className='media-modal__container'>
          <div>
            <div className='media-modal__label'>Image</div>
            <SimpleInput placeholder='add link'
                         value={ (poiEdit?.mediaType?.value == 'photo') && poiEdit?.mediaUrl?.value}
                         onChange={(e)=>handleSetUrl(e,'photo')}/>
          </div>
          <div className='media-modal__item'>
            <div className='media-modal__label'>Video</div>
            <SimpleInput placeholder='add link'
                         value={ (poiEdit?.mediaType?.value == 'video') && poiEdit?.mediaUrl?.value}
                         onChange={(e)=>handleSetUrl(e,'video')}/>
          </div>
        </div>
      </CustomModal>
    </div>
  )
}
