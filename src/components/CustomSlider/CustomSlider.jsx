import React from 'react'
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import './CustomStile.scss'

const PrettoSlider = styled(Slider)({
  height: 2,
  '& .MuiSlider-rail' : {
    backgroundColor:'#2E2B2B'
  },
  '& .MuiSlider-track': {
    border: 'none',
    backgroundColor:'#2E2B2B',
    opacity:0.18
  },
  '& .MuiSlider-thumb': {
    height: 9,
    width: 9,
    backgroundColor: '#8DC63F',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .Mui-active' : {
    backgroundColor: '#8DC63F',
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 9,
    background: 'unset',
    padding: 0,
    width: 20,
    height: 20,
    color:'#2E2B2B',
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#8DC63F',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const CustomSlider = ({spanMin,spanMax,name,onChange,...props}) => {
  return (
    <div className='custom-slider'>
      <PrettoSlider
        onChange = {(e,type)=>{onChange(e,type,name)}}
        {...props}
      >

      </PrettoSlider>
      <span className='custom-slider__step custom-slider__step--left'>{spanMin}</span>
      <span className='custom-slider__step custom-slider__step--right'>{spanMax}</span>
    </div>
  )
}

export default CustomSlider