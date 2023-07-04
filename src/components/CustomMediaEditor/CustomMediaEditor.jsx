import React, { useRef, useState, useEffect } from 'react'
import {ReactComponent as UploadIcon} from '../../assets/icons/images.svg'
import {ReactComponent as LinkIcon} from '../../assets/icons/link.svg'
import './CustomMediaEditor.scss';
import { onInputChange } from '../../helpers/formUtils'
import CustomTextEditor from '../CustomTextEditor/CustomTextEditor'

const CustomMediaEditor = ({
  setMediaModal,
  poiEdit,
  setPoiEdit,
  errImg,
  setErrImg,
  setDeleteMedia
  }) => {
  const [image,setImage] = useState(null);
  const [imgError,setImgError] = useState(null);
  const file = useRef(null);
  // when post photo set the err
  useEffect(()=>{
    if(errImg){
      setImgError(errImg)
    }
  },[errImg])
  const handleUpload = (e) =>{
    const MAX_SIZE = 5_242_880;
    let allowedExtension = ['jpeg', 'jpg','png','gif'];
    const image = e.target.files[0];
    const getSizeImg = image?.size;
    const getTypeImg = image?.type?.split('/').pop();
    if(getSizeImg > MAX_SIZE ) {
      setImgError('Max size allow 5mb')
      return
    }

    if(!allowedExtension.includes(getTypeImg)){
      setImgError('Wrong file type, available JPG, JPEG, GIF, PNG')
      return
    }
    setImgError(null)
    let imgToBlog = URL.createObjectURL(image);
    setImgError(null)
    onInputChange("image", {...poiEdit?.image?.value,blob:imgToBlog,image}, setPoiEdit, poiEdit);
    //debugger
    setImage(imgToBlog)
  }
  const handleToDelete = () =>{
    setDeleteMedia(prev=>({...prev,media:true}))
    setImage(null)
    onInputChange("image", null, setPoiEdit, poiEdit);
  }

  return (
    <div className='custom-media_editor'>
      <div className='custom-media_editor__toolbar'>
        <button
          className='custom-media_editor__icon'
          onClick={()=>file.current?.click()}>
          <UploadIcon/>
        </button>
        <button className='custom-media_editor__icon'
                onClick={()=>setMediaModal(true)}>
          <LinkIcon/>
        </button>
        <input
          ref={file}
          className='file-upload'
          accept="image/*"
          type="file"
          onChange={handleUpload}
          className='custom-media_editor__upload'/>
      </div>
      <div className='custom-media_editor__contain'>
        {(poiEdit?.image?.value?.origin || poiEdit?.image?.value?.blob) &&
          <div className='custom-media_editor__preload'>
            <img className='custom-media_editor__img-show'
                    src={poiEdit?.image?.value?.blob || poiEdit?.image?.value?.origin}/>
            {<div
              onClick={handleToDelete}
              className='custom-media_editor__close'>
              &#x2716;
            </div>}
          </div>}
      </div>
      <div className='custom-media_editor__err'>
        {imgError}
      </div>
    </div>
  )
}

export default CustomMediaEditor