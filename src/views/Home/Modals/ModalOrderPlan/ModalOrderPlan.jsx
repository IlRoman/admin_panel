import React, { useState } from 'react'
import { CustomModal } from '../../../../components/CustomModal/CustomModal'
import './ModalOrderPlan.scss'
import { CustomCheckbox } from '../../../../components/CustomCheckbox/CustomCheckbox'
import { onInputChange } from '../../../../helpers/formUtils'
import { CustomRadio } from '../../../../components/CustomRadio/CustomRadio'
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../redux/actions'
import { addCategories, createOrderPlan } from '../../../../crud/spaces/spaces'
import { useDispatch } from 'react-redux'

const ModalOrderPlan = ({setIsModal, floor, spaceData}) => {
  const [formData, setFormData] = useState({
    option: { name: 'Regular (< 62 hours)', value: 'regular' },
    room:false,
    gross:false,
    showcase:false,
    custom:false,
  });
  const dispatch = useDispatch()
  const price = () =>{
    if(formData?.option?.value === 'regular'){
      return 'Regular: CHF 20'
    }else if (formData?.option?.value === 'fast'){
      return 'Fast: CHF 25'
    }else{
      return 'Express: CHF 35'
    }
  }
  const handleCheck = (e,type) =>{
    let value = !formData[type];
    setFormData(prev=>({...prev,
      [type]:value}))
  }
  const submit = () =>{
    let objectTo = {
      id:spaceData?.id,
      hideRoomDimensions:formData?.room,
      hideGrossInternalArea:formData?.gross,
      useShowcaseOrientation:formData?.showcase,
      useShowcaseLabels:formData?.custom,
      floor:floor?.value,
      plan:formData?.option?.value
    }
    dispatch(showLoaderAction())
    createOrderPlan(objectTo).then(res=>{
      dispatch(showSimpleModalAction({title:'You have successfully ordered a plan',text:'Check your mail'}))
    }).catch((err)=>{
        const errors = err?.response?.data
        const {error,message,statusCode} = errors;
        dispatch(showSimpleModalAction({title:error,text:message}))

      }).finally(()=>{
      dispatch(hideLoaderAction())
      setIsModal(false)
      })
  }

  return (
    <div className='modal-order'>
      <CustomModal
        title="Minimap - Order 2D Floorplan"
        close={()=>setIsModal(false)}
        type="submit"
        cancelBtn="Cancel"
        submitBtn="Place Order"
        submit={submit}
      >
        <div className='modal-order__wrapper'>
          <h4 className='modal-order__title'>Order Delivery Time Frame</h4>
          <CustomRadio
          data={[
            { name: 'Regular (< 62 hours)', value: 'regular' },
            { name: 'Fast (< 48 hours)', value: 'fast' },
            { name: 'Express (< 24 hours)', value: 'express' }
          ]}
          onChange={value => {
            setFormData(prev=>({...prev,option:value }))
          }}
          value={formData?.option}
        />
        </div>
        <div className='modal-order__text'>
          (Excludes weekends and holidays, Fast and Express not supported for spaces bigger than 930m2)
        </div>
        <div className='modal-order__options'>
          <h4 className='modal-order__title'>Options</h4>
          <div className='modal-order__options-item'>
            <CustomCheckbox
              checked={formData.room}
              onChange={(e)=>{
                handleCheck(e,'room')
              }}
              label='Hide room dimensions (removes dimensions from all rooms)'/>
          </div>
          <div className='modal-order__options-item'>
            <CustomCheckbox
              checked={formData.gross}
              onChange={(e)=>{
                handleCheck(e,'gross')
              }}
              label='Hide gross internal area (removes the total area from the bottom of the plan)'/>
          </div>
          <div className='modal-order__options-item'>
            <CustomCheckbox
              checked={formData.showcase}
              onChange={(e)=>{
                handleCheck(e,'showcase')
              }}
              label='Use Showcase Orientation (use the orientation you see in Showcase (floor plan view))'/>
          </div>
          <div className='modal-order__options-item'>
            <CustomCheckbox
              checked={formData.custom}
              onChange={(e)=>{
                handleCheck(e,'custom')
              }}
              label='Use Custom Showcase Labels (uses the room labels you created in Workshop)'/>
          </div>
        </div>
        <div>
          <span className='modal-order__price'>Price </span>
          <span>&nbsp;&nbsp;{price()}</span>
        </div>
      </CustomModal>
    </div>
  )
}

export default ModalOrderPlan