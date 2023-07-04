import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch } from 'react-redux';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { CustomInput } from '../../../../components/CustomInput/CustomInput';
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../redux/actions'
import './modal.scss';
import {
  onInputChange,
  onFocusOut,
  formsReducer,
  validateForm,
  fillFormAction,
  updateFormAction,
} from '../../../../helpers/formUtils'
import { useIsMount } from '../../../../hooks/useIsMount'
import { createSpace } from '../../../../crud/spaces/spaces'
import { reduceFormData } from '../../../../helpers/reduceFormData'

const initialState = {
  name: { value: '', touched: false, hasError: true, error: '' },
  address: { value: '', touched: false, hasError: true, error: '' },
  matterportUrl:{ value: '', touched: false, hasError: true, error: '' },
  passwordSpace: { value: '', touched: false, hasError: true, error: '' },
  isFormValid: false,
};

export const ModalSpaceAdd = ({ closeModal, loadData, thisFolder }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useReducer(formsReducer, initialState);
  const [urlMatch, setUrlMatch] = useState(false)
  const isFirstRender = useIsMount()


  const submit = () => {
    if (validateForm(formData, setFormData)) {
      dispatch(showLoaderAction());
        let parent = thisFolder?.id ? thisFolder.id : 1;
        let reducerData = reduceFormData(formData);
        let newSpace = {
          address: reducerData?.address,
          name: reducerData.name,
          url: reducerData.matterportUrl,
          parent: parent
        }
        if(reducerData?.passwordSpace) newSpace.password = reducerData.passwordSpace
        createSpace(newSpace)
          .then((res) => {
            loadData();
            dispatch(hideLoaderAction());
            closeModal();
          })
          .catch(err => {
            if (err?.response?.data?.message) {
              dispatch(hideLoaderAction());
              let messageType = err?.response?.data?.error
              let messageCode = err?.response?.data?.statusCode
              let messageError = err?.response?.data?.message
              let messageUrl = 'space name or url already in use'
              let invalidUrl = 'invalid url'
              if(messageType === "Conflict" && (messageError === messageUrl)){
                setFormData(updateFormAction({
                ...formData.matterportUrl,
                name: 'matterportUrl',
                touched: true,
                hasError: true,
                error: err.response.data.message,
                isFormValid: false,
              }));
              } else if(messageType === "Bad Request" && (messageError === invalidUrl)){
                setFormData(updateFormAction({
                  ...formData.matterportUrl,
                  name: 'matterportUrl',
                  touched: true,
                  hasError: true,
                  error: err.response.data.message,
                  isFormValid: false,
                }));
              }
              else{
                  dispatch(showSimpleModalAction({title:messageType,text:messageError}))
              }
            }
          })
    }
  };
  useEffect(()=>{
    if(isFirstRender){
      return
    }
    else if(formData?.matterportUrl?.hasError){
      if(urlMatch) setUrlMatch(!urlMatch)
      return
    }
    else{
      setUrlMatch(true)
    }
  },[formData?.matterportUrl])
  return (
    <div className="create-space-modal">
      <CustomModal
        title='Add Space'
        close={closeModal}
        submit={submit}
        submitBtn='Add'
        cancelBtn="Cancel"
      >
        <div className={`create-space-modal__input ${urlMatch ? 'create-space-modal__input--check' : ''}`}>
          <div className='create-space-modal__input-label'>Matterport URL</div>
          <CustomInput
            formData={formData.matterportUrl}
            onChange={e => onInputChange('matterportUrl', e.target.value, setFormData, formData)}
            onBlur={e => onFocusOut('matterportUrl', e.target.value, setFormData, formData)}
            variantError='topright'
          />
        </div>
        <div className='create-space-modal__input'>
          <div className='create-space-modal__input-label'>Title</div>
          <CustomInput
            formData={formData.name}
            onChange={e => onInputChange('name', e.target.value, setFormData, formData)}
            onBlur={e => onFocusOut('name', e.target.value, setFormData, formData)}
            variantError='topright'
          />
        </div>
        <div className='create-space-modal__input'>
          <div className='create-space-modal__input-label'>Address</div>
          <CustomInput
            formData={formData.address}
            onChange={e => onInputChange('address', e.target.value, setFormData, formData)}
            onBlur={e => onFocusOut('address', e.target.value, setFormData, formData)}
            variantError='topright'
          />
        </div>
        <div className='create-space-modal__input'>
          <div className='create-space-modal__input-label'>Password *</div>
          <CustomInput
            formData={formData.passwordSpace}
            onChange={e => onInputChange('passwordSpace', e.target.value, setFormData, formData)}
            onBlur={e => onFocusOut('passwordSpace', e.target.value, setFormData, formData)}
            variantError='topright'
          />
        </div>
        <div className='create-space-modal__info'>
          *only if Space is protected in Matterport
        </div>
      </CustomModal>
    </div>
  )
};
