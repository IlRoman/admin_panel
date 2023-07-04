import React, { useEffect, useReducer, useRef, useState } from 'react'
import { CustomModal } from '../../../../components/CustomModal/CustomModal'
import { CustomDropdown } from '../../../../components/CustomDropdown/CustomDropdown'
import CustomSlider from '../../../../components/CustomSlider/CustomSlider'
import Chrome from 'react-color/lib/components/chrome/Chrome'
import { useClickOutside } from '../../../../hooks/useClickOutside'
import rgbHex from 'rgb-hex'
import CustomTextEditor from '../../../../components/CustomTextEditor/CustomTextEditor'
import {
  fillFormAction,
  formsReducer,
  onFocusOut,
  onInputChange,
  toNull,
  validateForm
} from '../../../../helpers/formUtils'
import { ReactComponent as Plus } from '../../../../assets/icons/plus.svg'
import ReactPlayer from 'react-player'
import { CustomInput } from '../../../../components/CustomInput/CustomInput'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/src/styles.scss';
import { CustomSwitcher } from '../../../../components/CustomSwitcher/CustomSwitcher'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { reduceFormData } from '../../../../helpers/reduceFormData'
import { useDispatch } from 'react-redux'
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../redux/actions'
import { createHeroTile, createSimpleTile, updateSimpleTile, uploadMediaTile } from '../../../../crud/spaces/spaces'

let optionHero = [
  { name: 'Text', value: 'text' },
  { name: 'Image', value: 'image' },
  { name: 'Music', value: 'music' },
  { name: 'Video', value: 'video' },
  { name: 'Iframe', value: 'iframe' },
];
let optionTile = [
  { name: 'Text', value: 'text' },
  { name: 'Image', value: 'image' },
  { name: 'Music', value: 'music' },
  { name: 'Video', value: 'video' },
  { name: 'Iframe', value: 'iframe' },
  { name: 'External Link - New Tab', value: 'newTab' },
  { name: 'Matterport Flyover', value: 'mpFlyover' },
  { name: 'Matterport Deeplink', value: 'mpDeeplink' },
];

const ModalTileType = ({
  close,
  typeTile,
  typeLink,
  current,
  setTileLinktype,
  spaceData,
  updateDate,
  currId,
  isCurrent,
  urlMedia,
  showcase
}) => {
  const colorPicker = useRef(null);
  const file = useRef(null);
  const dispatch = useDispatch();
  useClickOutside(colorPicker,()=>setOpenColorPicker(false));
  const [openColorPicker,setOpenColorPicker] = useState(false);
  const [files,setFiles] = useState(null)
  const [data, setData] = useReducer(formsReducer, {});
  const [isEdit, setIsEdit] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [isNotSave, setIsNotSave] = useState(false);
  const [changeLink, setChangeLink] = useState({isChange:false,event:null})
  const handleChange = (color,event)=>{
    onInputChange('background', "#" + rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a), setData, data);
    setIsEdit(true)
  }
  const handleUpload = (e) =>{
    const MAX_SIZE = 5_171_051;
    let allowedExtension = ['png','svg','svg+xml','jpeg'];
    const image = e.target.files[0];
    const getSizeImg = image?.size;
    const getTypeImg = image?.type?.split('/').pop();
    if(getSizeImg > MAX_SIZE ) {
     //error
      dispatch(showSimpleModalAction({titel:'Error',text:'Max size allow 5mb'}))
      return
    }
    if(!allowedExtension.includes(getTypeImg)){
      //error
      dispatch(showSimpleModalAction({title:'Error',text:'Wrong file type, available JPG, JPEG, GIF, PNG'}))
      return
    }
    setFiles(image)
    let imgToBlog = URL.createObjectURL(image);
    setIsEdit(true)
    setIsDownload(true)
    onInputChange('image', imgToBlog, setData, data);
  }
  const handleUploadVideo = (e) =>{
    let allowedExtension = ['mp4','m4v','webm','ogv','wmv','flv'];
    const video = e.target.files[0];
    const getSizeVideo = video?.size;
    const MAX_SIZE = 10_245_102;
    const getTypeVideo = video?.type?.split('/').pop();
    if(getSizeVideo > MAX_SIZE ) {
      //error
      dispatch(showSimpleModalAction({title:'Error',text:'Max size allow 10mb'}))
      return
    }
    if(!allowedExtension.includes(getTypeVideo)){
      //error
      dispatch(showSimpleModalAction({title:'Error',text:'Wrong file type, available mp4, m4v, webm, ogv, wmv, flv'}))
      return
    }
    setFiles(video)
    let videoToBlog = URL.createObjectURL(video);
    setIsEdit(true)
    setIsDownload(true)
    onInputChange('video', videoToBlog, setData, data);
  }
  const handleUploadAudio = (e) =>{
    let allowedExtension = ['mp3','wav','aac','flac','mpeg'];
    const audio = e.target.files[0];
    const getSizeAudio = audio?.size;
    const MAX_SIZE = 8_245_102;
    const getTypeAudio = audio?.type?.split('/').pop();
    if(getSizeAudio > MAX_SIZE ) {
      //error
      dispatch(showSimpleModalAction({title:'Error',text:'Max size allow 8mb'}))
      return
    }
    if(!allowedExtension.includes(getTypeAudio)){
      //error
      dispatch(showSimpleModalAction({title:'Error',text:'Wrong file type, available mp3, wav, aac, flac, mpeg'}))
      return
    }
    setFiles(audio)
    let audioToBlog = URL.createObjectURL(audio);
    setIsEdit(true)
    setIsDownload(true)
    onInputChange('audio', audioToBlog, setData, data);
  }
  const renderType = () =>{
    let type = typeLink?.value
    switch (type){
      case 'text':
        return (
          <>
            <div className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Text</div>
              <CustomTextEditor
                poiEdit = {data}
                setPoiEdit = {setData}
                setEdited = {setIsEdit}
                maxSize={500}
                withValid={true}
                isAwait={true}
                formName='descriptions'
                isTile={true}
              />
            </div>
            {typeTile === 'hero' ? (<>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Height</div>
              <CustomSlider
                min={150}
                max={400}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                step={2}
                spanMax={400}
                spanMin={150}
                name='height'
                onChange={changeSlider}
                value={data?.height?.value || 150}
              />
            </div></>) : null}
            <div className='tile-modal__field'>
              <div className='tile-modal--subtitle tile-modal--mb'>Background Color</div>
              <div className='tile-modal__bg'>
                <div className='tile-modal__hex'>
                  {data?.background?.value || '#1DAEEF' }
                </div>
                <div onClick={(e)=>{
                  e.stopPropagation()
                  setOpenColorPicker(true)
                }}
                     className='custom-icon__color'
                  style={{backgroundColor:`${data?.background?.value || '#1DAEEF'}`}}
                >
                </div>
                {openColorPicker &&
                <div
                  ref={colorPicker}
                  className='custom-icon__picker tile-modal__picker'>
                  <Chrome
                    disableAlpha={false}
                    color={data?.background?.value || '#1DAEEF'}
                    onChange={handleChange}
                  />
                </div>}
              </div>
            </div>
          </>
        )
      case 'image':
        return (
          <>
            <div className='tile-modal__field tile-modal__field--size'>
              <button
                onClick={(e)=>{
                  e.preventDefault()
                  file.current.click()
                }}
                className='tile-modal__btn'
              >
                <Plus/>
              </button>
              <input
                ref={file}
                className='file-upload'
                accept="image/*"
                type="file"
                onChange={handleUpload}
                style={{display:'none'}}/>
              {data?.image?.value && <div className='tile-modal__upload-img'>
                <img src={data?.image?.value} className='tile-modal__upload-image'/>
              </div>}
            </div>
            {typeTile === 'hero' ? <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Height</div>
              <CustomSlider
                min={150}
                max={400}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                step={2}
                spanMax={400}
                spanMin={150}
                name='height'
                onChange={changeSlider}
                value={data?.height?.value || 150}
              />
            </div> : null}
          </>
        )
      case 'video':
        return (
          <>
            <div className='tile-modal__field tile-modal__field--size'>
              <button
                onClick={(e)=>{
                  e.preventDefault()
                  file.current.click()}}
                className='tile-modal__btn'
              >
                <Plus/>
              </button>
              <input
                ref={file}
                className='file-upload'
                accept="video/mp4,video/x-m4v,video/*"
                type="file"
                onChange={handleUploadVideo}
                style={{display:'none'}}/>
              {data?.video?.value && <div className='tile-modal__upload-img'>
                <ReactPlayer
                  width='100%'
                  height='100%'
                  url={data?.video?.value}
                  controls={true}
                />
              </div>}
            </div>
            {typeTile === 'hero' ? <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Height</div>
              <CustomSlider
                min={150}
                max={400}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                step={2}
                spanMax={400}
                spanMin={150}
                name='height'
                onChange={changeSlider}
                value={data?.height?.value || 150}
              />
            </div> : null}
          </>
        )
      case 'iframe':
        return (
          <>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Title</div>
              <CustomInput
                name="text"
                formData={data?.text}
                onChange={e => {
                  onInputChange("text", e.target.value, setData, data);
                  setIsEdit(true)
                }}
                onBlur={e => {
                  onFocusOut("text", e.target.value, setData, data)
                  setIsEdit(true)
                }}
                placeholder="Title"
                maxLength={250}
                variantError="topright"
              />
            </div>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>URL</div>
              <CustomInput
                name="url"
                formData={data?.url}
                onChange={e => {
                  onInputChange("url", e.target.value, setData, data);
                  setIsEdit(true)
                }}
                onBlur={e => {
                  onFocusOut("url", e.target.value, setData, data)
                  setIsEdit(true)
                }}
                variantError="topright"
              />
            </div>
            {data?.url?.value &&
            <iframe
              title="Iframe akrotonx"
              className='tile-modal-type__iframe'
              referrerPolicy='no-referrer'
              src={data?.url?.value}
            />}
            {typeTile === 'hero' ? <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Height</div>
              <CustomSlider
                min={150}
                max={400}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                step={2}
                spanMax={400}
                spanMin={150}
                name='height'
                onChange={changeSlider}
                value={data?.height?.value || 150}
              />
            </div> : null}
            <div className='tile-modal__field'>
              <div className='tile-modal--subtitle tile-modal--mb'>Background Color</div>
              <div className='tile-modal__bg'>
                <div className='tile-modal__hex'>
                  #76CEDC
                </div>
                <div onClick={(e)=>{
                  e.stopPropagation()
                  setOpenColorPicker(true)
                }}
                     className='custom-icon__color'
                     style={{backgroundColor:`${data?.background?.value || '#1DAEEF'}`}}
                >
                </div>
                {openColorPicker &&
                <div
                  ref={colorPicker}
                  className='custom-icon__picker tile-modal__picker'>
                  <Chrome
                    disableAlpha={false}
                    color={data?.background?.value || '#1DAEEF'}
                    onChange={handleChange}
                  />
                </div>}
              </div>
            </div>
          </>
        )
      case 'music':
        return (
          <>
            <div className='tile-modal__field tile-modal__field--size'>
              <button
                onClick={(e)=>{
                  e.preventDefault()
                  file.current.click()}}
                className='tile-modal__btn'
              >
                <Plus/>
              </button>
              <input
                ref={file}
                className='file-upload'
                accept=".mp3,audio/*"
                type="file"
                onChange={handleUploadAudio}
                style={{display:'none'}}/>
              {data?.audio?.value && <div className='tile-modal__upload-audio'>
                <AudioPlayer
                  autoPlay={data?.autoplay?.value}
                  src={data?.audio?.value}
                  onPlay={e => console.log("onPlay")}
                  onPlayError={(err)=>{
                    debugger
                  }}
                  // other props here
                  header={`Now playing:`}
                  showSkipControls={false}
                  showJumpControls={false}
                  className='tile-modal__audio'
                  customControlsSection={['MAIN_CONTROLS','VOLUME_CONTROLS']}
                />
              </div>}
            </div>
            <div className='tile-modal__field'>
              <div className='tile-modal__checkbox'>
                <span className='tile-modal--subtitle'>Autoplay</span>
                <CustomSwitcher
                  checked={data?.autoplay?.value}
                  onChange={(e)=>{
                    setIsEdit(true)
                    let value = e.target.checked;
                    onInputChange('autoplay', value, setData, data);
                  }}
                />
              </div>
            </div>
            {typeTile === 'hero' ? <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Height</div>
              <CustomSlider
                min={150}
                max={400}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                step={2}
                spanMax={400}
                spanMin={150}
                name='height'
                onChange={changeSlider}
                value={data?.height?.value || 150}
              />
            </div> : null}
            <div className='tile-modal__field'>
              <div className='tile-modal--subtitle tile-modal--mb'>Background Color</div>
              <div className='tile-modal__bg'>
                <div className='tile-modal__hex'>
                  #76CEDC
                </div>
                <div onClick={(e)=>{
                  e.stopPropagation()
                  setOpenColorPicker(true)
                }}
                     className='custom-icon__color'
                     style={{backgroundColor:`${data?.background?.value || '#1DAEEF'}`}}
                >
                </div>
                {openColorPicker &&
                <div
                  ref={colorPicker}
                  className='custom-icon__picker tile-modal__picker'>
                  <Chrome
                    disableAlpha={false}
                    color={data?.background?.value || '#1DAEEF'}
                    onChange={handleChange}
                  />
                </div>}
              </div>
            </div>
          </>
        )
      case 'newTab':
        return (
          <>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Text</div>
              <CustomInput
                name="text"
                formData={data?.text}
                onChange={e => {
                  onInputChange("text", e.target.value, setData, data);
                  setIsEdit(true)
                }}
                onBlur={e => {
                  onFocusOut("text", e.target.value, setData, data)
                  setIsEdit(true)
                }}
                variantError="topright"
                maxLength={500}
              />
            </div>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>URL</div>
              <CustomInput
                name="url"
                formData={data?.url}
                onChange={e => {
                  onInputChange("url", e.target.value, setData, data);
                  setIsEdit(true)
                }}
                onBlur={e => {
                  onFocusOut("url", e.target.value, setData, data)
                  setIsEdit(true)
                }}
                variantError="topright"
              />
            </div>
            <div className='tile-modal__field'>
              <div className='tile-modal--subtitle tile-modal--mb'>Background Color</div>
              <div className='tile-modal__bg'>
                <div className='tile-modal__hex'>
                  #76CEDC
                </div>
                <div onClick={(e)=>{
                  e.stopPropagation()
                  setOpenColorPicker(true)
                }}
                     className='custom-icon__color'
                     style={{backgroundColor:`${data?.background?.value || '#1DAEEF'}`}}
                >
                </div>
                {openColorPicker &&
                <div
                  ref={colorPicker}
                  className='custom-icon__picker tile-modal__picker'>
                  <Chrome
                    disableAlpha={false}
                    color={data?.background?.value || '#1DAEEF'}
                    onChange={handleChange}
                  />
                </div>}
              </div>
            </div>
          </>
        )
      case 'mpFlyover':
        return (
          <>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Text</div>
              <CustomInput
                name="text"
                formData={data?.text}
                onChange={e => {
                  onInputChange("text", e.target.value, setData, data);
                  setIsEdit(true)
                }}
                onBlur={e => {
                  onFocusOut("text", e.target.value, setData, data)
                  setIsEdit(true)
                }}
                maxLength={500}
                variantError="topright"
              />
            </div>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>URL</div>
              <CustomInput
                name="url"
                formData={data?.url}
                onChange={e => {
                  onInputChange("url", e.target.value, setData, data);
                  setIsEdit(true)
                }}
                onBlur={e => {
                  onFocusOut("url", e.target.value, setData, data)
                  setIsEdit(true)
                }}
                variantError="topright"
              />
            </div>
            <div className='tile-modal__field'>
              <div className='tile-modal--subtitle tile-modal--mb'>Background Color</div>
              <div className='tile-modal__bg'>
                <div className='tile-modal__hex'>
                  #76CEDC
                </div>
                <div onClick={(e)=>{
                  e.stopPropagation()
                  setOpenColorPicker(true)
                }}
                     className='custom-icon__color'
                     style={{backgroundColor:`${data?.background?.value || '#1DAEEF'}`}}
                >
                </div>
                {openColorPicker &&
                <div
                  ref={colorPicker}
                  className='custom-icon__picker tile-modal__picker'>
                  <Chrome
                    disableAlpha={false}
                    color={data?.background?.value || '#1DAEEF'}
                    onChange={handleChange}
                  />
                </div>}
              </div>
            </div>
          </>
        )
      case 'mpDeeplink':
        return (
          <>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>Text</div>
              <CustomInput
                name="text"
                formData={data?.text}
                onChange={e => {
                  onInputChange("text", e.target.value, setData, data);
                  setIsEdit(true)
                }}
                onBlur={e => {
                  onFocusOut("text", e.target.value, setData, data)
                  setIsEdit(true)
                }}
                variantError="topright"
                maxLength={500}
              />
            </div>
            <div className='tile-modal__field'>
              <button
                onClick={(e)=>{
                  e.preventDefault()
                  showcase.Camera.getPose()
                    .then(function(pose){
                      const createSaveLink = window.location.origin + `/${pose.position.x}/${pose.rotation.x}/${pose.rotation.y}/${pose.mode}`
                      onInputChange("url", createSaveLink, setData, data);
                      setIsEdit(true)
                    });
                  }}
                className='tile-modal__btn'
              >
                <Plus/>
              </button>
            </div>
            <div  className='tile-modal__field' >
              <div className='tile-modal--subtitle'>URL</div>
              <CustomInput
                name="url"
                formData={data?.url}
                disabled={true}
                onChange={e => {
                  onInputChange("url", e.target.value, setData, data);
                  setIsEdit(true)
                }}
                onBlur={e => {
                  onFocusOut("url", e.target.value, setData, data)
                  setIsEdit(true)
                }}
                variantError="topright"
              />
            </div>
            <div className='tile-modal__field'>
              <div className='tile-modal--subtitle tile-modal--mb'>Background Color</div>
              <div className='tile-modal__bg'>
                <div className='tile-modal__hex'>
                  #76CEDC
                </div>
                <div onClick={(e)=>{
                  e.stopPropagation()
                  setOpenColorPicker(true)
                }}
                     className='custom-icon__color'
                     style={{backgroundColor:`${data?.background?.value || '#1DAEEF'}`}}
                >
                </div>
                {openColorPicker &&
                <div
                  ref={colorPicker}
                  className='custom-icon__picker tile-modal__picker'>
                  <Chrome
                    disableAlpha={false}
                    color={data?.background?.value || '#1DAEEF'}
                    onChange={handleChange}
                  />
                </div>}
              </div>
            </div>
          </>
        )
      default :
        return <div></div>
    }
  }
  const changeSlider = (e,value) =>{
    onInputChange('height', value, setData, data);
    setIsEdit(true)
  }
  const isCanClose = () =>{
    if(isEdit){
      setIsNotSave(true)
    }else{
      close()
    }
  }
  const addHeroField = (obj,reduced) =>{
    if(obj.hero){
      obj.hero.sizeUnits = 'percentage';
      obj.hero.height = reduced?.height || 0
    }else{
      obj.hero ={
        sizeUnits : 'percentage',
        height : reduced?.height || 0
      }
    }
  }
  const addEmptyField = (obj) =>{
   obj.payload = {
   }
  }
  const changeType = (e) =>{
    setChangeLink({isChange:true,event:e})
    setIsNotSave(true)
  }
  const typePatch = (typeLink,type,current) =>{
    let isHero = type === 'hero';
    let isCurrent = !!current;
    let reduced = reduceFormData(data);
    switch (typeLink){
      case 'text':
        let prepare = {
          [`${type}Linktype`]: "text",
          [`${type==='hero' ? 'hero' : 'payload'}`]: {
            text: reduced?.descriptions,
            backgroundColor: reduced?.background
          }
        }
        isHero ? addHeroField(prepare,reduced) : null;
        return {
          main:prepare,
          isUpload:false,
          isHero: isHero,
        }
      case 'image':
        let prepareImg = {
          [`${type}Linktype`]: "image",
        }
        isHero ? addHeroField(prepareImg,reduced) : addEmptyField(prepareImg);
        return {
          main:prepareImg,
          isUpload:true,
          isHero: isHero,
        }
      case 'iframe':
        let prepareIfram = {
          [`${type}Linktype`]: "iframe",
          [`${type==='hero' ? 'hero' : 'payload'}`]:{
            title: reduced?.text,
            url: reduced?.url,
            backgroundColor: reduced?.background,
          }
        }
        isHero ? addHeroField(prepareIfram,reduced) : null;
        return {
          main:prepareIfram,
          isUpload:false,
          isHero: isHero,
        }
      case 'music':
        let prepareMusic = {
          [`${type}Linktype`]: "music",
          [`${type==='hero' ? 'hero' : 'payload'}`]:{
            autoplay:data?.autoplay?.value,
            backgroundColor: reduced?.background,
          }
        }
        isHero ? addHeroField(prepareMusic,reduced) : null;
        return {
          main:prepareMusic,
          isUpload:true,
          isHero: isHero,
        }
      case 'video':
        let prepareVideo = {
          [`${type}Linktype`]: "video",
        }
        isHero ? addHeroField(prepareVideo,reduced) : addEmptyField(prepareVideo);
        return {
          main:prepareVideo,
          isUpload:true,
          isHero: isHero,
        }
      case 'newTab':
        return {
           main:{
             tileLinktype: "newTab",
             payload: {
               text: reduced?.text,
               url: reduced?.url,
               backgroundColor: reduced?.background,
             }
           },
          isUpload:false,
          isHero: false,

        }
      case 'mpFlyover':
        return {
           main:{
             tileLinktype: "mpFlyover",
             payload: {
               text: reduced?.text,
               url: reduced?.url,
               backgroundColor: reduced?.background,
             }
           },
          isUpload:false,
          isHero: false,
        }
      case 'mpDeeplink':
        return {
           main:{
             tileLinktype: "mpDeeplink",
             payload: {
               text: reduced?.text,
               url: reduced?.url,
               backgroundColor: reduced?.background,
             }
           },
          isUpload:false,
          isHero: false,
        }
      default :
        return
    }
  }
  const checkIsUpdate = () =>{
    let result = false;
    if(current || isCurrent){
      return result
    }else{
      result = true
      return result
    }
  }
  const createTile =  (data) =>{
    if(!isEdit){
      dispatch(showSimpleModalAction({title:'Error',text:'The form must not be empty or you need to change the values'}))
      return
    }
    dispatch(showLoaderAction())
    let isCreate = checkIsUpdate()
    isCreate ? createSimpleTile(spaceData.id,data)
      .then(res=>{
        dispatch(showSimpleModalAction({title:'Success',text:'You have successfully create/edit hero tile'}))
        setIsEdit(false)
        updateDate()
        close()
      })
      .catch(err=>{
        const errors = err?.response?.data
        const {error,message,statusCode} = errors;
        dispatch(showSimpleModalAction({title:'Error',text:message}))
      })
      .finally(()=>{
        dispatch(hideLoaderAction())
      }) :
      updateSimpleTile(spaceData.id,currId,data)
        .then(res=>{
          dispatch(showSimpleModalAction({title:'Success',text:'You have successfully create/edit hero tile'}))
          setIsEdit(false)
          updateDate()
          close()
        })
        .catch(err=>{
          const errors = err?.response?.data
          const {error,message,statusCode} = errors;
          dispatch(showSimpleModalAction({title:'Error',text:message}))
    })
        .finally(()=>{
          dispatch(hideLoaderAction())
    })
  }
  const createHerosTile =  (data) =>{
    if(!isEdit){
      dispatch(showSimpleModalAction({title:'Error',text:'The form must not be empty or you need to change the values'}))
      return
    }
    dispatch(showLoaderAction())
    createHeroTile(spaceData.id,data)
      .then(res=>{
        dispatch(showSimpleModalAction({title:'Success',text:'You have successfully create/edit hero tile'}))
        setIsEdit(false)
        updateDate()
        close()
      })
      .catch(err=>{
        const errors = err?.response?.data
        const {error,message,statusCode} = errors;
        let mess = message
        if(message?.length){
          mess = message[0]?.constraints?.maxLength
        }
        dispatch(showSimpleModalAction({title:'Error',text:mess}))
      })
      .finally(()=>{
        dispatch(hideLoaderAction())
      })
  }
  const uploadNewFile = (typeUpload) =>{
    let type = typeUpload.isHero
    let uploadPayload = typeUpload.main;
    let getMedia = typeUpload.main[`${type ? 'hero' : 'tile'}Linktype`]
    if(files){
      const formData = new FormData();
      formData.append("file",files);
      formData.append("mediaType",getMedia);
      formData.append("mediaDestination",type ? 'hero' : 'tile');
      dispatch(showLoaderAction())
      uploadMediaTile(spaceData.id,formData)
        .then((res)=>{
          typeUpload.main.id = res.data?.fileUrl;
          typeUpload.isHero ? createHerosTile(typeUpload.main)  : createTile(typeUpload.main)
          })
        .catch(err=>{
          const errors = err?.response?.data
          const {error,message,statusCode} = errors;
          dispatch(showSimpleModalAction({title:'Error',text:message}))
          dispatch(hideLoaderAction())
        })
        .finally(()=>{
        })
    }else{
      type ? createHerosTile(uploadPayload)  : createTile(uploadPayload)
    }
  }
  const sumbitType = async () =>{
    if(validateForm(data,setData)){
       let createNew =  typePatch(typeLink.value,typeTile);
        if(createNew.isUpload) {
          uploadNewFile(createNew)
        } else{
          createNew.isHero ? createHerosTile(createNew.main)  : createTile(createNew.main)
        }
    }else{
      return
    }
  }
  useEffect(()=>{
    if(typeLink?.value && typeTile){
      switch (typeLink?.value){
        case 'text':
          if(typeTile ==='hero'){
            setData(fillFormAction({
              descriptions: { value: current?.text || '', touched: false, hasError: true, error: '' },
              background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
              height: { value: current?.height || 0, touched: false, hasError: true, error: '' },
            }));
          }else{
            setData(fillFormAction({
              descriptions: { value: current?.text || '', touched: false, hasError: true, error: '' },
              background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
            }));
          }
          break;
        case 'image':
          if(typeTile ==='hero'){
            setData(fillFormAction({
              image: { value: urlMedia || '', touched: false, hasError: true, error: '' },
              height: { value: current?.height, touched: false, hasError: true, error: '' },
            }));
          }else{
            setData(fillFormAction({
              image: { value: urlMedia || '', touched: false, hasError: true, error: '' },
            }));
          }
          break;
        case 'video':
          if(typeTile ==='hero'){
            setData(fillFormAction({
              video: { value: urlMedia || '', touched: false, hasError: true, error: '' },
              height: { value: current?.height, touched: false, hasError: true, error: '' },
            }));
          }else{
            setData(fillFormAction({
              video: { value: urlMedia || '', touched: false, hasError: true, error: '' },
            }));
          }
          break;
        case 'iframe':
          if(typeTile ==='hero'){
            setData(fillFormAction({
              url: { value: current?.url, touched: false, hasError: true, error: '' },
              text: { value: current?.title, touched: false, hasError: true, error: '' },
              height: { value: current?.height, touched: false, hasError: true, error: '' },
              background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
            }));
          }else{
            setData(fillFormAction({
              url: { value: current?.url, touched: false, hasError: true, error: '' },
              text: { value: current?.title, touched: false, hasError: true, error: '' },
              background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
            }));
          }
          break;
        case 'music':
          if(typeTile ==='hero'){
            setData(fillFormAction({
              audio: { value: urlMedia || '', touched: false, hasError: true, error: '' },
              height: { value: current?.height, touched: false, hasError: true, error: '' },
              background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
              autoplay: { value: current?.autoplay || false, touched: false, hasError: true, error: '' },
            }));
          }else{
            setData(fillFormAction({
              audio: { value: urlMedia || '', touched: false, hasError: true, error: '' },
              background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
              autoplay: { value: current?.autoplay || false, touched: false, hasError: true, error: '' },
            }));
          }
          break;
        case 'newTab':
          setData(fillFormAction({
            url: { value: current?.url, touched: false, hasError: true, error: '' },
            text: { value: current?.text, touched: false, hasError: true, error: '' },
            background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
            }));
          break;
        case 'mpFlyover':
          setData(fillFormAction({
            url: { value: current?.url, touched: false, hasError: true, error: '' },
            text: { value: current?.text, touched: false, hasError: true, error: '' },
            background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
          }));
          break;
        case 'mpDeeplink':
          setData(fillFormAction({
            url: { value: current?.url, touched: false, hasError: true, error: '' },
            text: { value: current?.text, touched: false, hasError: true, error: '' },
            background: { value: current?.backgroundColor || '#0080ff', touched: false, hasError: true, error: '' },
          }));
          break;
        default :
          return <div></div>
      }
    }else{

    }
  },[current,typeLink,typeTile])
  return (
    <>
      <div className='tile-modal-type'>
        {isNotSave && <ConfirmModal
          title="Changes not saved"
          cancelBtn="No"
          submitBtn="Yes"
          submit={()=>{
            setIsNotSave(false)
            if(changeLink.isChange){
              setTileLinktype(changeLink.event)
              setData(toNull(null))
              setFiles(null)
              setIsEdit(false)
              setChangeLink({isChange:false,event:null})
            } else{
              close()
            }
          }}
          close={()=>setIsNotSave(false)}
          text="Are you sure you want to leave without saving changes?"
        />}
        <CustomModal
          title="Tile Menu - Tile"
          close={isCanClose}
          closeWithoutHide={true}
          cancelBtn="Cancel"
          submitBtn="Save"
          submit={sumbitType}
        >
        <div className='type-modal-type--content'>
          <div className='tile-modal__field'>
            <div className='tile-modal--subtitle'>Linktype</div>
            <CustomDropdown
              variant='grey'
              onChange={changeType}
              value={typeLink?.name}
              placeholder='Choose Linktype'
              options={typeTile === 'tile' ? optionTile : optionHero }
              variant='grey'
              serch={false}
            />
          </div>
          {renderType()}

        </div>
        </CustomModal>
      </div>
    </>
  )
}

export default ModalTileType