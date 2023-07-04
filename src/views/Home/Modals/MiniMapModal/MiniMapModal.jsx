import React, { useState } from 'react'
import './MiniMap.scss';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import CustomSlider from '../../../../components/CustomSlider/CustomSlider'

const MiniMapModal = ({src}) => {
  const [settings, setSettings] = useState(0)
  return (
    <div className='mini-map-modal'>
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          doubleClick={{ disabled: true }}
          wheel={{disabled:true}}
        >
          {({ state,zoomIn, zoomOut, resetTransform, ...rest }) => (
            <React.Fragment>
              <div className="tools">
                <div className='tools__size'>
                  <button className='tools__btn' onClick={(e,type) => {
                    zoomOut()
                    if(settings <= 0){
                      return
                    }
                    setSettings(prev=>prev-20)
                  }}>-</button>
                  <CustomSlider
                    min={0}
                    max={100}
                    name='size'
                    aria-label="Small steps"
                    step={20}
                    marks
                    onChangeCommitted = {(e,value,type)=>{
                      let prev = settings;
                      if(prev < value){
                        let dis = value - prev;
                        let scale = getScale(dis);
                        zoomIn(scale)
                      } else{
                        let dis = prev - value;
                        let scale = getScale(dis);
                        zoomOut(scale)
                      }
                      setSettings(value)
                    }}
                    onChange={()=>{}}
                    value={settings}
                  />
                  <button className='tools__btn' onClick={() => {
                    zoomIn()
                    if(settings >= 100){
                      return
                    }
                    setSettings(prev=>prev+20)
                  }}>+</button>
                </div>
              </div>
              <TransformComponent
                contentClass='zooms'
                wrapperClass='wrapper__zooms'
              >
                <img className='img' src={src?.preview} alt="minimap" />
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
    </div>
  )
}

export default MiniMapModal