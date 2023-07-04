import React, { useEffect } from 'react'
import './ModalPoint.scss'
import { onInputChange, toNull } from '../../helpers/formUtils'
import {ReactComponent as Default} from '../../assets/icons/icon.svg'

const ModalPoint = ({poiEdit,module, setPoiEdit, hideAdd}) => {

  const sanitizedData = () => ({
    __html: poiEdit?.description?.value
  })

  const handleClose = () =>{
    setPoiEdit(toNull(null))
  }
  const check = (module) =>{
    if(!module){
      return false
    } else if (module === "Take Photos"){
      return false
    } else {
      return true
    }
  };

  const getWidth = () =>{
    if(poiEdit?.modalSize?.value?.width){
      return poiEdit?.modalSize?.value?.width
    }
    return '314px'
  }
  const getHeight = () =>{
    if(poiEdit?.modalSize?.value?.height){
      return poiEdit?.modalSize?.value?.height
    }
    return 'auto'
  }
  const getOpacity = () =>{
    if(poiEdit?.opacity?.value){
      return (+poiEdit?.opacity?.value / 100)
    }
    return '1'
  }
  return (
    <div style={{width:getWidth(),height:getHeight(),opacity:getOpacity()}}
         className={`point ${check(module) ? '' : 'point--position'} ${module ==='Access Settings' ? 'point--more_right' : ''}`}>
      <div className='point--resible'>
        {hideAdd && <button onClick={handleClose}
                            className='point__close'>&#x2716;</button>}
        <div className='point__head'>
          {poiEdit?.icon?.value ?
            <img className='point__icon' src={poiEdit?.icon?.value}/>
            :<Default className='point__default-icon' style={{fill:poiEdit?.backgroundColor?.value}}/>
          }
          <h3 className='point__title'>{poiEdit?.name?.value}</h3>
        </div>
        <div className='point__main'
             dangerouslySetInnerHTML={sanitizedData()}
        >
        </div>
      </div>
    </div>
  )
}

export default ModalPoint