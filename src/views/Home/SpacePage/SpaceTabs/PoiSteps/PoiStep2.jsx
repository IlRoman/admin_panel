import React, { useEffect, useState } from 'react'
import { CustomInput } from '../../../../../components/CustomInput/CustomInput'
import { fillFormAction, onFocusOut, onInputChange, toNull, validateForm } from '../../../../../helpers/formUtils'
import { CustomDropdown } from '../../../../../components/CustomDropdown/CustomDropdown'
import CustomSlider from '../../../../../components/CustomSlider/CustomSlider'
import CustomChip from '../../../../../components/CustomChip/CustomChip'
import CustomIcon from '../../../../../components/CustomIconPicker/CustomIcon'
import CustomTextEditor from '../../../../../components/CustomTextEditor/CustomTextEditor'
import CustomMediaEditor from '../../../../../components/CustomMediaEditor/CustomMediaEditor'
import { CustomButton } from '../../../../../components/CustomButton/CustomButton'
import {
  updatePoi,
  getCategories,
  uploadPoiMedia,
  uploadPoiIcon,
  deletePoiIcon,
  deletePoiMedia
  } from '../../../../../crud/spaces/spaces'
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../../redux/actions'
import { useDispatch } from 'react-redux'

export const PoiStep2 = ({
    spaceData,
    setSpaceData,
    edited,
    setEdited,
    handleCancelModal,
    closeModule,
    handleSuccessModal,
    setStep,
    current,
    setMediaModal,
    poiEdit,
    setPoiEdit,
    showcase,
    handleConfirmModal,
    setHideAdd,
    setSuccessModal,
    setPoiListOrigin,
    poiListOriginal
}) => {
    const dispatch = useDispatch();
    const [optionCategory,setOptionCategory] = useState([]);
    const [deleteMedia, setDeleteMedia] = useState({icon:false,media:false})
    const [isResizeIcon , setIsResizeIcon] = useState(null)

  const toInitialMediaState = () =>{
      setDeleteMedia({icon:false,media:false})
  }
    const deleteIcon = (id,matterPort)=>{
      dispatch(showLoaderAction())
      deletePoiIcon(id).then(res=>{
         showcase?.Mattertag.resetIcon(matterPort);
      }).finally(()=>{
        dispatch(hideLoaderAction())
      })
    }
    const deleteImage = (id)=>{
      dispatch(showLoaderAction())
      deletePoiMedia(id).then(res=>{
      }).finally(()=>{
        dispatch(hideLoaderAction())
      })
    }
    const handleCheckToDelete = (id,matterPort) =>{
      if(deleteMedia?.icon || deleteMedia?.media){
        deleteMedia?.icon ? deleteIcon(id,matterPort) : null;
        deleteMedia?.media ? deleteImage(id) : null;
        toInitialMediaState()
      }else{
        return
      }
  }
    //Remove state when close tabs
    useEffect(()=>{
      setHideAdd(false)
      getCategories(spaceData?.id).then(res=>{
        let options = res?.data?.list;
        let mutate = options?.reduce((arr,category)=>{
          let item = {
              name:category?.title,
              value: category?.id
          }
          arr.push(item)
          return arr
        },[])
        setOptionCategory(mutate)
      }).catch((err)=>{
        debugger
      })
      return ()=>{
        setPoiEdit(toNull(
          null))
        setHideAdd(true)
      }
    },[])
    const getValue = () =>{
      let valueTo = poiEdit?.mouseAction?.value
      if(poiEdit?.mouseAction?.value?.name){
        return
      } else {
        let typeOption = valueTo ? { name: 'Hover', value: true } : { name: 'On click', value: false };
        onInputChange('mouseAction', typeOption, setPoiEdit, poiEdit);
      }
    }
    const changeSlider = (e,targetValue,type) =>{
      setEdited(true)
      if(targetValue < 10){
        return
      } else {
        let opacity = parseInt(targetValue) / 100;
        onInputChange(type, targetValue, setPoiEdit, poiEdit);
        //showcase?.Mattertag.editOpacity(poiEdit?.matterPortId?.value,opacity  )
      }
    }

    const changeSliderModal = (e,targetValue,type) =>{
      setEdited(true)
      if(type =='width'){
        let getHeight = poiEdit?.modalSize?.value?.height
        onInputChange('modalSize', {width:targetValue.toString() + 'px',height:getHeight}, setPoiEdit, poiEdit);
      }else{
        let getWidth = poiEdit?.modalSize?.value?.width
        onInputChange('modalSize', {width:getWidth,height:targetValue.toString() + 'px'}, setPoiEdit, poiEdit);
      }
  }

    const getDefaultValue = (value,type) =>{
      let maxWidth = 800;
      let minWidth = 100;
      let maxHeight = 600;
      let minHeight = 100;
      let toNumber = parseInt(value)
      if (type === 'width'){
          if(toNumber > maxWidth){
            toNumber = maxWidth
          } else{
            toNumber < 100 ? toNumber = minWidth : toNumber
          }
      } else {
        if(toNumber > maxHeight){
          toNumber = maxWidth
        } else{
          toNumber < 100 ? toNumber = minHeight : toNumber
        }
      }
      return toNumber
    }


    const changeIconSize = (e,targetValue,type) =>{
      e.stopPropagation()
      setEdited(true)
      onInputChange(type, targetValue, setPoiEdit, poiEdit);
  }
    const handleChange = (e) =>{
      let hasItem = false;
      setEdited(true)
      let copyArray = poiEdit?.categories?.value;
      let newArray = [...copyArray,e]
      let find = copyArray.forEach(cat => {
        if(cat?.name === e?.name){
          hasItem = true
        }
      })
      if(hasItem) return
      onInputChange("categories", newArray, setPoiEdit, poiEdit);
    }
    const submitChanges = (e) =>{
      e.preventDefault();
      if (validateForm(poiEdit, setPoiEdit)) {
        dispatch(showLoaderAction())
        let mutate = poiEdit?.categories?.value?.reduce((arr,category)=>{
          let item = `${category?.value}`;
          arr.push(item)
          return arr
        },[])
        const data = {
          matterPortId: poiEdit?.matterPortId?.value,
          name: poiEdit?.name?.value,
          description: poiEdit?.description?.value,
          backgroundColor: poiEdit?.backgroundColor?.value,
          opacity: poiEdit?.opacity?.value,
          size: poiEdit?.size?.value,
          mediaType: poiEdit?.mediaType?.value,
          //mediaUrl: poiEdit?.mediaUrl?.value,
          floor: poiEdit?.floor?.value,
          enabled: poiEdit?.enabled?.value,
          mouseAction: poiEdit?.mouseAction?.value?.value,
          x: poiEdit?.x?.value,
          y: poiEdit?.y?.value,
          z: poiEdit?.z?.value,
          createdAt: poiEdit?.createdAt?.value,
          categories: mutate,
          modalSize:poiEdit?.modalSize?.value
        }
        if(poiEdit?.mediaUrl?.value){
          data.mediaUrl = poiEdit?.mediaUrl?.value;
        }
        handleCheckToDelete(poiEdit?.id?.value,poiEdit?.matterPortId?.value)
        updatePoi(spaceData.id, poiEdit?.id?.value, data)
          .then(res => {
              dispatch(hideLoaderAction());
              let update = res.data
              let originPoi =  poiListOriginal;
              let updateOriginalPoi = originPoi.map(poi=>{
                if(poi?.id === poiEdit?.id?.value){
                  return {
                    ...update,
                    matterPortId:poi?.matterPortId
                  }
                }else{
                  return poi
                }
              })
              setPoiListOrigin(updateOriginalPoi)
              if(poiEdit?.icon?.value || isResizeIcon){
                handleUpload(isResizeIcon)
              }else {
                setSuccessModal(prev=>!prev)
              }
            }).catch((err)=>{
              const errors = err?.response?.data
              const {error,message,statusCode} = errors;
              dispatch(showSimpleModalAction({title:error,text:message}))
        })
      }
      setEdited(false)
    }
    const changeDropdown = (e,name) =>{
      onInputChange(name, e, setPoiEdit, poiEdit);
  }
    const handleUpload = (file) =>{
      const formData = new FormData();
      formData.append("file",file ? isResizeIcon : poiEdit?.icon?.value);
      if(!file && !(poiEdit?.icon?.value instanceof File)){
        setSuccessModal(prev=>!prev)
        return
      }
      uploadPoiIcon(poiEdit?.id?.value,formData).then(res=>{
        let imgSrc = res?.data?.icon;
        let math = Math.random()?.toFixed(3);
        setPoiEdit(fillFormAction({
          icon: { value: imgSrc, touched: false, hasError: true, error: '' }
        }))
        let updateList = poiListOriginal?.map(list =>{
          if(list?.id === poiEdit?.id?.value){
            list.icon = imgSrc;
            return list
          }else{
            return list
          }
        })
        setPoiListOrigin(updateList)
        setSuccessModal(prev=>!prev)
        showcase?.Mattertag.registerIcon(`${poiEdit?.matterPortId.value}-${math}`,imgSrc).then(res=>{
          showcase.Mattertag.editIcon(poiEdit?.matterPortId?.value, `${poiEdit?.matterPortId.value}-${math}`)
        })
      }).catch((err)=>{
        const errors = err?.response?.data
        const {error,message,statusCode} = errors;
        dispatch(showSimpleModalAction({title:error,text:message}))
      })
    }
    const chipDelete = (e,chip) =>{
      let deleteItemFromArr = poiEdit?.categories?.value?.filter(poi => poi?.value !== chip?.value)
      onInputChange('categories', deleteItemFromArr, setPoiEdit, poiEdit);
    }


    return (
        <>
            <h2 className='poi-tab__title'>{`Edit ${current?.name || poiEdit?.name?.value}`}</h2>
            <div className='poi-tab__font'>
              <div className="space-tab__input-name">Title</div>
              <CustomInput
                name="name"
                formData={poiEdit?.name}
                 onChange={e => {
                     onInputChange("name", e.target.value, setPoiEdit, poiEdit);
                     setEdited(true)
                 }}
                onBlur={e => {
                    onFocusOut("name", e.target.value, setPoiEdit, poiEdit)
                }}
                placeholder='Inszenierung Casa Bonita'
                variantError="topright"
              />
            </div>
            <div className='space-tab__sliders_container'>
              <div className="space-tab__input-name">Text</div>
              <CustomTextEditor
                poiEdit={poiEdit}
                setPoiEdit = {setPoiEdit}
                setEdited={setEdited}
                //onChange={handleCha}

              />
            </div>
            {/*<div className='space-tab__sliders_container'>
              <div className="space-tab__input-name">Media / Other Content</div>
              <CustomMediaEditor
                setMediaModal={setMediaModal}
                poiEdit={poiEdit}
                setPoiEdit={setPoiEdit}
                errImg={errImg}
                setErrImg = {setErrImg}
                setDeleteMedia={setDeleteMedia}
              />
            </div>*/}
            <div className='space-tab__switcher-text' style={{ marginTop: '20px' }}>Category</div>
            <CustomDropdown
              variant="grey"
              placeholder='Categories'
              //value={formData.layoutColumns.value}
              onChange={handleChange}
              options={optionCategory}
            />
            <div>
                <CustomChip deleteChip = {chipDelete} chips={poiEdit?.categories?.value}/>
            </div>
          <div className='space-tab__sliders_container'>
            <div className="space-tab__input-name">Width</div>
            <CustomSlider
              min={100}
              max={800}
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              step={2}
              spanMax={800}
              spanMin={100}
              name='width'
              onChange={changeSliderModal}
              value={getDefaultValue(poiEdit?.modalSize?.value?.width,'width')}
            />
          </div>
          <div className='space-tab__sliders_container'>
            <div className="space-tab__input-name">Height</div>
            <CustomSlider
              min={100}
              max={600}
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              step={2}
              spanMax={600}
              spanMin={100}
              name='height'
              onChange={changeSliderModal}
              value={getDefaultValue(poiEdit?.modalSize?.value?.height,'height')}
            />
          </div>
            <div className='space-tab__sliders_container'>
                <div className="space-tab__input-name">Opacity</div>
                <CustomSlider
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  aria-label="pretto slider"
                  defaultValue={10}
                  step={2}
                  spanMax={100}
                  spanMin={10}
                  name='opacity'
                  onChange={changeSlider}
                  value={poiEdit?.opacity?.value}
                />
            </div>
            <div className='space-tab__sliders_container'>
              <div className="space-tab__input-name">Icon</div>
              <CustomIcon
                poiEdit={poiEdit}
                setPoiEdit={setPoiEdit}
                showcase={showcase}
                setDeleteMedia={setDeleteMedia}
                setIsResizeIcon={setIsResizeIcon}
                isResizeIcon={isResizeIcon}
                setEdited={setEdited}
              />
            </div>
          {/* <div className='space-tab__sliders_container'>
            <div className="space-tab__input-name">Icon Opacity</div>
            <CustomSlider
              min={0}
              max={100}
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={10}
              step={2}
              spanMax={100}
              spanMin={10}
              name='opacity'
              onChange={changeSlider}
              value={poiEdit?.opacity?.value}
            />
          </div>*/}
          <div className='space-tab__sliders_container'>
            <div className="space-tab__input-name">Icon Size</div>
            <CustomSlider
              min={0}
              name='size'
              max={100}
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={0}
              step={2}
              spanMax={100}
              spanMin={10}
              onChange={changeIconSize}
              value={poiEdit?.size?.value}
              disabled={poiEdit?.icon?.value === null}
            />
          </div>
          <div>
            <div className='space-tab__switcher-text' style={{ marginTop: '20px' }}>Mouse Action</div>
            <CustomDropdown
              variant="grey"
              placeholder='Mouse Action'
              serch={false}
              value={poiEdit?.mouseAction?.value?.name || getValue()}
              onChange={(e)=>{
                setEdited(true)
                changeDropdown(e,'mouseAction')}
              }
              options={[
                { name: 'On click', value: false },
                { name: 'Hover', value: true },
              ]}
            />
          </div>
          <div className='space-tab__buttons'>
            <div className="space-tab__cancel-btn">
              <CustomButton
                name="Cancel"
                variant="grey"
                onClick={(e) => {
                  e.preventDefault();
                  handleConfirmModal()
                }}
              />
            </div>
            <div className="space-tab__submit-btn">
              <CustomButton
                variant="green"
                name="Save"
                onClick={submitChanges}
              />
            </div>
          </div>
        </>
    )
};
