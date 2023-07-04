import React, { useState } from 'react'
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { SimpleInput } from '../../../../components/CustomInput/SimpleInput';
import './category.scss';

export const CategoryModal = ({title,submitBtn,submit,close,cancelBt,categoryError}) => {
  const [category, setCategory] = useState('');
  const handleSubmit = () =>{
    submit(category)
  }
  return (
    <div className={`category-modal ${categoryError?.categoryError ? 'category-modal--error' : ''}`}>
      <CustomModal
        title={title}
        submitBtn={submitBtn}
        submit={handleSubmit}
        cancelBtn={cancelBt}
        close={close}
      >
        <div className='category-modal__container'>
          <div>
            <div className='category-modal__label'>Category</div>
            <SimpleInput
                         value={category}
                         onChange={(e)=>{
                           setCategory(e.target.value)
                           categoryError?.setCategoryError(null)
                         }}/>
            <p className='text-err'>{categoryError?.categoryError}</p>
          </div>
        </div>
      </CustomModal>
    </div>
  )
}
