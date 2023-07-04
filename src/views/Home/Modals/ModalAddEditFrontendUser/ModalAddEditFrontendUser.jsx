import React, { useEffect, useReducer, useState } from 'react'
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { CustomInput } from '../../../../components/CustomInput/CustomInput';
import {
  onInputChange,
  onFocusOut,
  formsReducer,
  fillFormAction,
  validateForm,
  updateFormAction
} from '../../../../helpers/formUtils';
import { reduceFormData } from '../../../../helpers/reduceFormData';
import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction, showSimpleModalAction } from '../../../../redux/actions'
import './modal.scss';
import {
  createFrontendUser,
  getCategories,
  sendResetPassword,
  updateFrontendUser
} from '../../../../crud/spaces/spaces'
import { CustomDropdownCheckmark } from '../../../../components/CustomDropdown/CustomDropdownCheckmark'
import CustomChip from '../../../../components/CustomChip/CustomChip'
import { CustomButton } from '../../../../components/CustomButton/CustomButton'
import Tooltip from '@mui/material/Tooltip'
import {ReactComponent as Tools} from '../../../../assets/icons/question.svg'

const initialState = {
  fullname: { value: "", touched: false, hasError: true, error: "" },
  username: { value: "", touched: false, hasError: true, error: "" },
  email: { value: "", touched: false, hasError: true, error: "" },
  category: { value: [], touched: false, hasError: true, error: "" },
  isFormValid: false,
};

export const ModalAddEditFrontendUser = ({ closeModal, current, loadData, spaceData, setConfirmAdd, setEmail }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useReducer(formsReducer, initialState);
  const [options, setOptions] = useState([])
  const [isGet, setIsGet] = useState(false)
  const sendPassword = (e) =>{
    e.preventDefault();
    let spaceId = spaceData?.id;
    let userIs = current?.id
    sendResetPassword(spaceId,userIs,{}).then(res=>{
      dispatch(showSimpleModalAction({title:'Success',text:'Link to create a new password sent'}))
    }).catch(err=>{
      const errors = err?.response?.data
      const {error,message,statusCode} = errors;
      dispatch(showSimpleModalAction({title:error,text:message}))
    })
  }
  useEffect(() => {
    if (current) {
      let mutateCategory = []
      if(Array.isArray(current?.categories) && (current?.categories?.length > 0)){
        mutateCategory = current?.categories.map(item=>({...item,check:true,name:item?.title}))
      }
      setFormData(
        fillFormAction({
          fullname: { value: current?.fullname, touched: false, hasError: true, error: "" },
          username: { value: current?.username, touched: false, hasError: true, error: "" },
          email: { value: current?.email, touched: false, hasError: true, error: "" },
          category: { value: mutateCategory, touched: false, hasError: true, error: "" },
          changePassword: { value: '', touched: false, hasError: true, error: "" },
          isFormValid: false,
        })
      )
    }
  }, [current]);

  useEffect(()=>{
    getOptions()
  },[])

  useEffect(()=>{
    if(current && isGet){
      let selectedCategories = formData?.category?.value
      let updateOptions = options.map(option =>{
        selectedCategories.map(categories=>{
          categories.title === option.title ? option.check = true : null
        })
        return option
      })
      setOptions(updateOptions)
    }
  },[isGet])

  const handleAddUser = () => {
    if (validateForm(formData, setFormData)) {
      dispatch(showLoaderAction());
      const data = reduceFormData(formData);
      if(formData?.category?.value?.length){
        let categories = formData?.category?.value?.map(category =>category.id)
        data.categories = categories
      } else{
        data.categories = []
      }
      createFrontendUser(spaceData?.id,data)
        .then(() => {
          dispatch(hideLoaderAction());
          closeModal();
          loadData();
        })
        .catch(err => {
          const errors = err?.response?.data
          const {error,message,statusCode} = errors;
          if(message === 'User with that email already exists, do you want to invite him to space?'){
            setEmail(formData?.email?.value)
            setConfirmAdd(prev=>!prev)
          } else{
            dispatch(showSimpleModalAction({title:error,text:message}))
          }
          /*if (err?.response?.data?.message === 'email already in use') {
            setFormData(updateFormAction({
              name: 'email',
              value: formData.email.value,
              hasError: true,
              error: 'email already in use',
              touched: true,
              isFormValid: false,
            }))
          }*/
        }).finally(()=>{
          dispatch(hideLoaderAction())
      })
    }
  };

  const onUpdateUser = () => {
    if (validateForm(formData, setFormData)) {
      dispatch(showLoaderAction());
      const data = reduceFormData(formData);
      if(data?.changePassword){
        data.password = data?.changePassword;
        delete data.changePassword
      }else{
      }
      if(formData?.category?.value?.length){
        let categories = formData?.category?.value?.map(category =>category.id)
        data.categories = categories
      } else{
        data.categories = []
      }
      updateFrontendUser(spaceData.id,current?.id, data)
        .then(() => {
          dispatch(hideLoaderAction());
          closeModal();
          loadData();
        })
        .catch(err => {
          const errors = err?.response?.data
          const {error,message,statusCode} = errors;
          dispatch(showSimpleModalAction({title:error,text:message}))
          /*if (err?.response?.data?.message === 'email already in use') {
            setFormData(updateFormAction({
              name: 'email',
              value: formData.email.value,
              hasError: true,
              error: 'email already in use',
              touched: true,
              isFormValid: false,
            }))
          }*/
        })
    }
  };

  const getOptions = () =>{
    dispatch(showLoaderAction())
    getCategories(spaceData?.id).then(res=>{
      let options = res?.data?.list?.map(option=>({...option, check : false, name:option?.title}));
      setTimeout(()=>{
        current ? setIsGet(true) : null
      },500)
      setOptions(options)
    }).catch((err)=>{
      debugger
    }).finally(()=>{
      dispatch(hideLoaderAction())
    })
  };

  const handleCheck = (item) =>{
    current ? setIsGet(false) : null
    let mutateOption = options.map(option => {
      if(option.id === item.id){
        option.check = !option.check
        return option
      } else{
        return option
      }
    })
    setOptions(mutateOption)
    let selectOption = formData?.category?.value;
    let findOption = selectOption?.find(option => option.id === item.id)
    let filterOption;
    if(findOption){
      filterOption = selectOption?.filter(seletOption => seletOption?.id !== item.id);
    } else{
      filterOption = [...selectOption,item]
    }
    onInputChange('category',filterOption,setFormData, formData)
  }

  const chipDelete = (e,item) =>{
    e.preventDefault();
    let selectOption = formData?.category?.value;
    let filterOption = selectOption?.filter(seletOption => seletOption?.id !== item.id);
    let mutateOption = options.map(option => {
      if(option.id === item.id){
        option.check = !option.check
        return option
      } else{
        return option
      }
    })
    setOptions(mutateOption)
    onInputChange('category',filterOption,setFormData, formData)
  }

  return (
    <div className="add-edit-userFR-modal ">
      <CustomModal
        title={`${current ? 'Edit' : "Add"} User`}
        close={closeModal}
        submit={current ? onUpdateUser : handleAddUser}
        submitBtn={current ? 'Save' : 'Add'}
      >
        <div className="add-edit-userFR-modal__input-container">
          <div className="add-edit-userFR-modal__input-name">Full Name</div>
          <CustomInput
            formData={formData.fullname}
            onChange={e => onInputChange('fullname', e.target.value, setFormData, formData)}
            onBlur={e => onFocusOut('fullname', e.target.value, setFormData, formData)}
            variantError="topright"
          />
        </div>
        <div className="add-edit-userFR-modal__input-container">
          <div className="add-edit-userFR-modal__input-name">Username</div>
          <CustomInput
            formData={formData.username}
            onChange={e => onInputChange('username', e.target.value, setFormData, formData)}
            onBlur={e => onFocusOut('username', e.target.value, setFormData, formData)}
            variantError="topright"
          />
        </div>
        <div className="add-edit-userFR-modal__input-container">
          <div className="add-edit-userFR-modal__input-name">Email</div>
          <CustomInput
            formData={formData.email}
            onChange={e => onInputChange('email', e.target.value, setFormData, formData)}
            onBlur={e => onFocusOut('email', e.target.value, setFormData, formData)}
            variantError="topright"
            maxLength={100}
            disabled={current?.status?.name === 'ACTIVE'}
          />
        </div>
        {current && <div className="add-edit-userFR-modal__input-container">
          <div className='add-edit-userFR-modal__icon-wrapper'>
            <div className="add-edit-userFR-modal__input-name">Password</div>
            <Tooltip
              placement="right-end"
              title="Password must contain 6 - 32 characters and should include at least 1 lowercase, 1 uppercase, 1 special symbol, 1 number"
            >
              <div className='add-edit-userFR-modal__input-tool'>
                <Tools/>
              </div>
            </Tooltip>
          </div>
          <CustomInput
            formData={formData.changePassword}
            onChange={e => onInputChange('changePassword', e.target.value, setFormData, formData)}
            onBlur={e => onFocusOut('changePassword', e.target.value, setFormData, formData)}
            variantError="topright"
            maxLength={32}
          />
        </div>}
        <div className="add-edit-userFR-modal__input-container">
          <div className="add-edit-userFR-modal__input-name">Category</div>
          <CustomDropdownCheckmark
            onChange={handleCheck}
            options={options}
            variant="grey"
            multiSelect={true}
          />
          <div>
            <CustomChip
              deleteChip = {chipDelete}
              chips={formData?.category?.value}/>
          </div>
        </div>
        {current && <div className="add-edit-userFR-modal__input-container">
          <CustomButton
            name="Reset Password"
            variant="green"
            onClick={sendPassword}
          />
        </div>}
      </CustomModal >
    </div>
  )
};
