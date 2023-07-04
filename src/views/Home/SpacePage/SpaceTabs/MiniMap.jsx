import React, { useState, useEffect } from 'react'
import { CustomSwitcher } from '../../../../components/CustomSwitcher/CustomSwitcher'
import { CustomDropdown } from '../../../../components/CustomDropdown/CustomDropdown'
import { CustomButton } from '../../../../components/CustomButton/CustomButton'
import ModalOrderPlan from '../../Modals/ModalOrderPlan/ModalOrderPlan'
import {useDropzone} from 'react-dropzone';
import { useDispatch } from 'react-redux'
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../redux/actions'
import {ReactComponent as Upload} from '../../../../assets/icons/cloud-upload.svg'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  deleteImageForMinimap,
  getImageForMinimap,
  getMiniMap,
  updateMiniMap,
  uploadMinimapPhoto
} from '../../../../crud/spaces/spaces'
import CustomSlider from '../../../../components/CustomSlider/CustomSlider'

const switchers = [
  {
    title: <></>,
    text: 'Show Map',
    fieldName: 'showMap',
  }
];


const MiniMap = ({spaceData,closeModule, setEditModalCansel, showcase, setEdited,edited,setUpdateMiniMap}) => {
  const [formData, setFormData] = useState([]);
  const [floor, setFloor] = useState({ name: '', value: '' });
  const [options, setOptions] = useState([])
  const [isModal, setIsModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState(0)
  const [isDeleteImg, setIsDeleteImg] = useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/png': [],
      'image/jpeg':[],
      'image/jpg':[],
      'image/svg':[]
    },
    maxSize:5242880,
    maxFiles:1,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      setIsDeleteImg(false)
      setEdited(true)
    },
    onDropRejected : (file) =>{
      let message = file[0].errors[0].message
      let title = file[0].errors[0].code
      if(title === "file-too-large"){
        title = 'Error'
        message = 'File is larger than 5MB'
      } else if (title === "file-invalid-type"){
        title = "Error"
        message = 'File type must be jpeg, png, jpg, svg'
      }
      dispatch(showSimpleModalAction({title:title ,text:message}))
    }
  });
  const handleSwitch = (e) =>{
    let value = e.target.checked;
    setEdited(true)
    setFloor(prev=> ({...prev,state:value}))
  }
  const handleChangeFloor = value => {
    setEdited(false)
    setFloor(value);
    if(showcase){
      showcase?.Floor.moveTo(value?.value - 1).then(res=>{
      })
    }
    getImg(value?.info?.minimapId);
  };
  const getFllors = (miniMap) => {
    let arr = [];
    if (miniMap.length) {
      for (let i = 0; i < miniMap.length; i++) {
        arr.push({ name: miniMap[i]?.floor,
          value: miniMap[i]?.floor,
          info: miniMap[i] ,
          state:miniMap[i].state
        })
      }
    }
    return arr;
  };
  const loadData = (initial) =>{
    dispatch(showLoaderAction())
    getMiniMap(spaceData.id).then(res=>{
      let miniMap = res.data
      setFormData(miniMap)
      let options = getFllors(miniMap);
      setOptions(options)
      if(initial === 'initial' && (options?.length > 0)){
        setFloor(options[0])
        let idForImg = options[0].info?.minimapId
        getImg(idForImg)
        if(showcase){
          showcase?.Floor.moveTo(options[0].value - 1).then(res=>{
          })
        }
      }
    }).catch(err=>{
      const errors = err?.response?.data;
      const {error,message,statusCode} = errors;
      dispatch(showSimpleModalAction({title:error,text:message}))
    }).finally(()=>{
      dispatch(hideLoaderAction())
    })
  }
  const submitForm = () =>{
    let update = {
      ...floor?.info,
      state:floor?.state
    }
    dispatch(showLoaderAction())
    updateMiniMap(spaceData?.id,floor?.info?.floor,update)
      .then(res=>{
        setUpdateMiniMap(true)
        setTimeout(()=>{
          loadData()
        },1000)
        if(!files[0]?.type){
          edited ? dispatch(showSimpleModalAction({title:'Changes saved'})) : null
          setEdited(false)
        }else if(!(files.length === 0) && isDeleteImg){
          edited ? dispatch(showSimpleModalAction({title:'Changes saved'})) : null
          setEdited(false)
           //dispatch(showSimpleModalAction({title:'Changes saved'}))
        }
       }).catch((err)=>{
      const errors = err?.response?.data
      const {error,message,statusCode} = errors;
      dispatch(showSimpleModalAction({title:error,text:message}))
      })
      .finally(()=>{
        dispatch(hideLoaderAction())
    })
    if(files[0]?.type){
      uploadImg()
    }
    if((files.length === 0) && isDeleteImg) {
      let id = floor?.info?.id
      deleteImg(id)
    }
  }
  const getImg = (id) =>{
    if(!id) {
      setFiles([])
      return
    }
    dispatch(showLoaderAction())
    getImageForMinimap(id).then(res=>{
      if(res.data?.size === 0){
        setFiles([])
        return
      }
      const reader = new window.FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = function () {
        let result = {preview:reader.result};
        setFiles([result])
      }
    }).catch(err=>{
      const errors = err?.response?.data;
      const {error,message,statusCode} = errors;
      dispatch(showSimpleModalAction({title:error,text:message}))
    }).finally(
      dispatch(hideLoaderAction())
    )
  }
  const deleteImg = (id) =>{
    if(!id) return
    dispatch(showLoaderAction())
    deleteImageForMinimap(id).then(res=>{
      dispatch(showSimpleModalAction({title:'Changes saved',text:'Minimap delete successfully'}))
    }).catch(err=>{
      const errors = err?.response?.data;
      const {error,message,statusCode} = errors;
      dispatch(showSimpleModalAction({title:error,text:message}))
    }).finally(
      dispatch(hideLoaderAction())
    )
  }
  const uploadImg = () =>{
    const formData = new FormData();
    formData.append("file",files[0]);
    dispatch(showLoaderAction())
    uploadMinimapPhoto(spaceData?.id,floor?.value,formData)
      .then(res=>{
        dispatch(showSimpleModalAction({title:'Changes saved',text:'Minimap uploaded successfully'}))
      })
      .catch(err=>{
      const errors = err?.response?.data;
      const {error,message,statusCode} = errors;
      dispatch(showSimpleModalAction({title:error,text:message}))
    }).finally(
      dispatch(hideLoaderAction())
    )
  }
  const getScale = (value) =>{
    switch (value){
      case 0 :
        return 0
      case 20 :
        return 0.5
      case 40 :
        return 1
      case 60 :
        return 1.5
      case 80 :
        return 2
      case 100 :
        return 2.5
    }
  }
  useEffect(()=>{
    loadData('initial')
  },[])
  return (
    <>

      {isModal && <ModalOrderPlan
        floor={floor}
        setIsModal={setIsModal}
        spaceData={spaceData}
      />}
      <div className='mini-map'>
        <h2 className='space-tab__title'>{`${spaceData?.name || 'Space'} - Tile Menu`}</h2>
        {switchers.map((elem, index) => {
          return (
            <div className="space-tab__switcher-container" key={index}>
              <div className='space-tab__switcher-text-block'>
                <div className='space-tab__switcher-title'>{elem.title}</div>
                <div className='space-tab__switcher-text'>{elem.text}</div>
              </div>
              <div className='space-tab__switcher'>
                <CustomSwitcher
                  checked={floor?.state}
                  onChange={handleSwitch}
                />
              </div>
            </div>
          )
        })}
        <div className='mini-map__setting'>
          <div className="mini-map__floors">
            <span>Choose Floor</span>
            <CustomDropdown
              placeholder='Floor'
              variant='grey'
              value={floor?.name}
              onChange={handleChangeFloor}
              options={options}
              serch={false}
            />
          </div>
          <CustomButton
            name='Order 2D Floorplan'
            onClick={()=>setIsModal(!isModal)}
          />
        </div>
        {!files?.length ?
         <div {...getRootProps({className: 'dropzone'})}>
          <Upload className='dropzone__svg'/>
          <input {...getInputProps()} />
          <p className='dropzone__title'>Choose files to Upload</p>
          <p className='dropzone__subtitle'>or use drag&drop</p>
        </div>
          :
        <div className='zoom'>
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
                  <div className='tools__back'>
                    <button className='tools__button'
                            onClick={() => {
                              resetTransform()
                              setSettings(0)
                            }}>Initial</button>
                    <button className='tools__button'
                            onClick={()=>{
                              setEdited(true)
                              setFiles([])}}>Remove minimap</button>
                    <button className='tools__button'
                            onClick={()=>{
                              setFiles([])
                              setIsDeleteImg(true)
                              setEdited(true)
                            }}>Delete minimap</button>
                  </div>
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
                  <img className='img' src={files[0].preview} alt="test" />
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>}
        <div className='space-tab__buttons'>
          <div className="space-tab__cancel-btn">
            <CustomButton
              name="Cancel"
              variant="grey"
              onClick={(e) => {
                e.preventDefault();
                if(edited){
                  setEditModalCansel(prev=>!prev)
                }else{
                  closeModule()
                }

              }}
            />
          </div>
          <div className="space-tab__submit-btn">
            <CustomButton
              variant="green"
              name="Save"
              onClick={(e) => {
                e.preventDefault();
                submitForm();
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default MiniMap