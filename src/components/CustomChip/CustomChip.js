import React from 'react';
import './CustomChip.scss';

const CustomChip = ({deleteChip,chips,...props}) => {
  return (
    <div className='custom-chip'>
      {chips?.map((chip,index) => (<div key={index} className='custom-chip__item'>
        <span
          onClick={(e)=>deleteChip(e,chip)}
          className='custom-chip__close'>&#10005;</span>
        <span className='custom-chip__text'>{chip.name}</span>
        </div>)
        )}
    </div>
  )
}

export default CustomChip