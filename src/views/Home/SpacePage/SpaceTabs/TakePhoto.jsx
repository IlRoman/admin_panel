import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { hideLoaderAction, showLoaderAction ,showSimpleModalAction} from '../../../../redux/actions';
import { dataURLtoFile } from '../../../../helpers/base64ToFile';
import { CustomSwitcher } from '../../../../components/CustomSwitcher/CustomSwitcher'
import CustomSlider from '../../../../components/CustomSlider/CustomSlider'
import {ReactComponent as Plus} from '../../../../assets/icons/plus.svg'
import {ReactComponent as Expand} from '../../../../assets/icons/expand.svg'
import {ReactComponent as Pictures} from '../../../../assets/icons/image.svg'
import {ReactComponent as Setting} from '../../../../assets/icons/cog.svg'
import {ReactComponent as Compress} from '../../../../assets/icons/compress-alt.svg'
import {ReactComponent as Minus} from '../../../../assets/icons/minus-svgrepo-com.svg'
import {ReactComponent as Camera} from '../../../../assets/icons/camera-solid.svg'
import {
  getPhotoSetting,
  updatePhotoSetting,
  createSpacePhoto
} from '../../../../crud/spaces/spaces'
import { setPhotoAndLocation } from '../../../../crud/spaces/spaces'
import moment from 'moment'
import Tooltip from '@mui/material/Tooltip'


export const TakePhoto = ({ showcase,spaceData }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [toolTip, setTooltip] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [settings, setSettings] = useState({
    zoom:0,
    photo:true,
    grid:false,
    measurements:false
  });
  const [visibleNav, setVisibleNav] = useState(true)
  const [rotate,setRotate] = useState(null)

  useEffect(()=>{
    dispatch(showLoaderAction())
    getPhotoSetting(spaceData.id).then(res =>{
      let getOptions = res?.data
        setSettings(prev=>({...prev,
          grid:getOptions?.grid,
          measurements:getOptions?.measurements
        }))
    }).finally(()=>{
      dispatch(hideLoaderAction())
    })
  },[])
  // const []
  const toolTipOpen = () =>{
    setTooltip(prev=>!prev)
  }
  const handleSwitchPhotoType = (e,type) =>{
    if(type === 'first'){
      settings.photo ? null : setSettings(prev=>({...prev,photo:true}))
    } else {
      !settings.photo ? null : setSettings(prev=>({...prev,photo:false}))
    }
  }
  const handleSettingModal = () =>{
    setSettingsModal(prev=>!prev)
  }
  const handleSlider = (object,value)=>{
    let zoomNumb = (2.3 * value) / 100;
    let delta = (zoomNumb + 0.7).toFixed(1)
    showcase?.Camera.zoomTo(delta).then(updateZoom=>{
      let delta = updateZoom - 0.7
      let procent = (100*delta)/2.3;
      let procentToFixed = procent?.toFixed(1)
      setSettings(prev=>({...prev,zoom: procentToFixed}))
    });

  }
  const addMoreZoom = () =>{
    let getSliderValue = settings.zoom;
    showcase?.Camera.zoomBy(0.23).then(updateZoom=>{
      let delta = updateZoom - 0.7
      let procent = (100*delta)/2.3;
      let procentToFixed = procent?.toFixed(1)
      setSettings(prev=>({...prev,zoom: procentToFixed}))
    });
  };

  const resetMoreZoom = () =>{
    let getSliderValue = settings.zoom;
    let dec = 5;
    let mutateValue = getSliderValue - dec;
    showcase?.Camera.zoomBy(-0.23).then(updateZoom=>{
      let delta = updateZoom - 0.7
      let procent = (100*delta)/2.3;
      let procentToFixed = procent?.toFixed(1)
      setSettings(prev=>({...prev,zoom: procentToFixed}))
    })
  };

  const resetZoom = () =>{
    showcase?.Camera?.zoomReset().then(res=>{
      debugger
    })
  }

  const handleVertical = () =>{
   const mode = showcase?.Mode.Mode.INSIDE;
   const rotation = {x: 0, y: rotate?.y};
   const transition = showcase?.Mode.TransitionType.FLY;
   const zoom = 1;
   showcase.Mode.moveTo(mode, {
     transition: transition,
     rotation:rotation,
     zoom,
   })
     .then(function(nextMode){
       let zoomNumb = (2.3 * settings?.zoom) / 100;
       let delta = (zoomNumb + 0.7).toFixed(1)
       showcase?.Camera.zoomTo(delta).then(updateZoom=>{
         let delta = updateZoom - 0.7
         let procent = (100*delta)/2.3;
         let procentToFixed = procent?.toFixed(1)
         setSettings(prev=>({...prev,zoom: procentToFixed}))
       });
     })
     .catch(function(error){
       // Error with moveTo command
     });
  }

  const handleSetting = (e,type) =>{
    let value = e?.target?.checked;
    dispatch(showLoaderAction())
    if(type === 'grid'){
      setSettings(prev=>({...prev,grid:value}));
      updatePhotoSetting(spaceData.id,
      { measurements: settings.measurements, grid:value }).then(res=>{
      }
    ).finally(()=>{
        dispatch(hideLoaderAction())
      })
    }else{
      setSettings(prev=>({...prev,measurements:value}));
      updatePhotoSetting(spaceData.id,
      { measurements: value, grid:settings.grid }).then(res=>{
      }
    ).finally(()=>{
        dispatch(hideLoaderAction())
      })
    }

  }

  const onSubmit = () => {
    if (showcase) {
      dispatch(showLoaderAction());
      let currentLocation = null;
      let screenshotFile = null;
      showcase.Camera.getPose()
        .then(res => {
          currentLocation = res;
          const resolution = {
            width: 1968,
            height: 688,
          };
          const visibility = {
            mattertags:settings?.measurements || false,
            measurements: settings?.measurements || true,
          };
          if(!settings.photo && visibleNav){
            showcase.Renderer.takeEquirectangular()
              .then(function (screenShotUri) {
                screenshotFile = screenShotUri;
                const formData = new FormData();
                formData.set('download', dataURLtoFile(screenshotFile, 'screenshot.jpg'));
                formData.append('type', 'landscape');
                formData.append('label', '');
                createSpacePhoto(spaceData.id,formData).then(res=>{
                  setTooltip(true)
                  setTimeout(()=>{
                    setTooltip(false)
                  },2000)
                }).finally(_ =>{
                  dispatch(hideLoaderAction())
                })
              }).catch(err=>{
              debugger
            });
          } else{
            showcase.Camera.takeScreenShot(resolution,visibility)
              .then(res => {
                screenshotFile = res;
                const formData = new FormData();
                let date = moment(new Date()).format('DD.MM')
                formData.set('download', dataURLtoFile(screenshotFile, 'screenshot.jpg'));
                formData.append('type', 'portrait');
                formData.append('label', `screenshot-${date}.jpg`);
                createSpacePhoto(spaceData.id,formData).then(res=>{
                  setTooltip(true)
                  setTimeout(()=>{
                    setTooltip(false)
                  },2000)
                }).finally(_ =>{
                 dispatch(hideLoaderAction())
                })
               /* var el = document.createElement("a");
                dispatch(hideLoaderAction())
                el.setAttribute("href",  res);
                el.setAttribute("download", 'image.jpg');
                document.body.appendChild(el);
                el.click();
                el.remove();*/
                /*setPhotoAndLocation(location.pathname.split('/')[3], formData)
                  .then(() => {
                    dispatch(hideLoaderAction());
                  })*/
              })
          }
        })
    }
  };


  useEffect(()=>{
    if(!showcase) {
      setVisibleNav(false)
      return
    }
    showcase?.Camera.pose.subscribe(function (pose) {
      setRotate(pose.rotation)
      if(pose.mode === "mode.inside"){
        setVisibleNav(true)
      } else{
        setVisibleNav(false)
        setSettingsModal(false)
      }
    });
    showcase?.Camera.zoom.subscribe(function (zoom) {
      let zoomTo = zoom.level?.toFixed(1);
      let delta = zoomTo - 0.7
      let procent = (100*delta)/2.3;
      let procentToFixed = procent?.toFixed(1)
      setSettings(prev=>({...prev,zoom: procentToFixed}))
    });

  },[showcase])

  return (
    <div className='take_photo-tab'>
      {settings?.grid && settings?.photo && <>
        <div className='take_photo-tab__vert'></div>
        <div className='take_photo-tab__goriz'></div>
      </>}
      {visibleNav && <div className='take_photo-tab__nav'>
        <div className='take_photo-tab__mode'>
          <Tooltip title="Photos">
            <div onClick={(e)=>handleSwitchPhotoType(e,'first')}
                 className={`take_photo-tab__mode_item 
            ${settings.photo ? 'take_photo-tab__mode_item--active' : ''}`}>
              <Pictures className='take_photo-tab__normal'/>
            </div>
          </Tooltip>
          <Tooltip title="Panos">
            <div onClick={(e)=>handleSwitchPhotoType(e,'second')}
                 className={`take_photo-tab__mode_item 
            ${!settings.photo ? 'take_photo-tab__mode_item--active' : ''}`}>
              <Pictures className='take_photo-tab__normal'/>
            </div>
          </Tooltip>
        </div>
        <Tooltip title="Settings">
          <div onClick={handleSettingModal}
               className={`take_photo-tab__icon ${settingsModal ? 'take_photo-tab__icon--active' : ''}`}>
            <Setting/>
          </div>
        </Tooltip>
        <Tooltip title="Vertical alignment">
          <div onClick={handleVertical}
               className='take_photo-tab__icon'>
            <Expand/>
          </div>
        </Tooltip>
        <div className='take_photo-tab__mode'>
          <Tooltip title="Zoom down">
            <div onClick={resetMoreZoom}
                 className='take_photo-tab__mode_btn'>
              <Minus className = 'take_photo-tab__small'/>
            </div>
          </Tooltip>
          <div className='take_photo-tab__mode_slider'>
            <CustomSlider
              min={0}
              max={100}
              value = {settings?.zoom}
              onChange={handleSlider}
            />
          </div>
          <Tooltip title="Zoom in">
            <div onClick={addMoreZoom}
                 className='take_photo-tab__mode_btn'>
              <Plus className = 'take_photo-tab__small'/>
            </div>
          </Tooltip>
        </div>
        <Tooltip title="Reset Zoom">
          <div onClick={resetZoom}
               className='take_photo-tab__icon'>
            <Compress/>
          </div>
        </Tooltip>
      </div>}
      {settingsModal && (<div className='take_photo-tab__setting'>
        <div className='take_photo-tab__switch'>
          <p>Includes measurements, labels, and Mattertags in Photo. (2D photos only)</p>
          <CustomSwitcher
              disabled={!settings.photo}
              checked={settings?.measurements}
              onChange={(e)=>handleSetting(e,'measurements')} />
        </div>
        <div className='take_photo-tab__switch'>
          <p>Show grid (2D photos only)</p>
          <CustomSwitcher
            disabled={!settings.photo}
            checked={settings?.grid}
            onChange={(e)=>handleSetting(e,'grid')} />
        </div>
      </div>)}
      {toolTip && <div className='take_photo-tab__modal'>Picture has been saved &#x2713;</div>}
      <button onClick={onSubmit}
        className='take_photo-tab__btn'>
        <Camera style={{width:23,fill:'#8DC63F'}}/>
      </button>
    </div>
  )
};
