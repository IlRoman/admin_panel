import React, { useEffect, useRef, useState } from 'react'
import { CustomButton } from '../CustomButton/CustomButton'
import Chrome from 'react-color/lib/components/chrome/Chrome'
import './CustomIcon.scss'
import { useClickOutside } from '../../hooks/useClickOutside'
import rgbHex from "rgb-hex";
import { onInputChange } from '../../helpers/formUtils'



const CustomIcon = ({
   showcase,
   poiEdit,
   setPoiEdit,
   setDeleteMedia,
   setIsResizeIcon,
   isResizeIcon,
   setEdited
  }) => {
  const [color,setColor] = useState(poiEdit?.backgroundColor?.value || '#76CEDC');
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [image,setImage] = useState(null);
  const [imgError,setImgError] = useState(null);
  const canvas = useRef(null);
  const colorPicker = useRef(null);
  const file = useRef(null);
  const isFirstRender = useRef(null)


  const handleChange = (color,event)=>{
    setEdited(true)
    setColor("#" + rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a));
    let col = "#" + rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a)
    // Need cover rgb from 0 to 1, sdk represent color in this scale
    let r = color.rgb.r / 255;
    let g = color.rgb.g /255;
    let b = color.rgb.b /255;
    onInputChange('backgroundColor', col, setPoiEdit, poiEdit);
    if(image){
      changePhotoColor(color.rgb.r,color.rgb.g,color.rgb.b)
    }else if (poiEdit?.icon?.value && !image){
      changePhotoColor(color.rgb.r,color.rgb.g,color.rgb.b)
    }
    showcase?.Mattertag?.editColor(poiEdit?.matterPortId?.value, {
      r: r,
      g: g,
      b: b,
    }).then(color=>{

    })
  };
  useClickOutside(colorPicker,()=>setOpenColorPicker(prev=>!prev));

  const changePhotoColor = (r,g,b)=>{
      let context = canvas?.current.getContext('2d');
      const imgData = context.getImageData(0, 0, canvas.current.width, canvas.current.height)
      for (let i = 0; i < imgData.data.length; i += 4) {
        //imgData.data[i] = 255;
        imgData.data[i] = r;      // the red color channel - we have decreased its value
        imgData.data[i + 1] = g;  // the green color channel - we have decreased its value
        imgData.data[i + 2] = b;
      }
      context.putImageData(imgData, 0, 0);
      // Create file from canvas
      canvas.current.toBlob((blob) => {
        let file = new File([blob], "fileName.png", { type: "image/png" })
        onInputChange('icon', file, setPoiEdit, poiEdit);
      }, 'image/png');
  }

  const handleOpenPicker = (e)=>{
    e.stopPropagation()
    setOpenColorPicker(prev=>!prev)
  }
  const handleUpload = (e) =>{
    const MAX_SIZE = 5_242_00;
    let canSvgEditor = false;
    let allowedExtension = ['png','svg','svg+xml'];
    const image = e.target.files[0];
    const getSizeImg = image?.size;

    const getTypeImg = image?.type?.split('/').pop();
    if(getSizeImg > MAX_SIZE ) {
      setImgError('Max size allow 500kb')
      return
    }
    if(!allowedExtension.includes(getTypeImg)){
      setImgError('Type allow PNG SVG')
      return
    }
    setImgError(null)
    let imgToBlog = URL.createObjectURL(image);
    let fileReader = new FileReader();
    setEdited(true)
    fileReader.readAsDataURL(image)
    fileReader.addEventListener('load', (e)=>{
      const img =  new Image();
      img.src = e.target.result;
      img.addEventListener('load', () => {
        drawImage(img)
      })
    })
    onInputChange('icon', image, setPoiEdit, poiEdit);
    setImage(image)
  }
  const cacheImageData = () => {
    let context = canvas?.current.getContext('2d');
    let ORIGINAL_IMAGE_DATA
    const original = context.getImageData(0, 0, canvas.current.width, canvas.current.height).data
    ORIGINAL_IMAGE_DATA = new Uint8ClampedArray(original.length)
    for (let i = 0; i < original.length; i += 1) {
      ORIGINAL_IMAGE_DATA[i] = original[i]
    }
  };
  const drawImage = img => {
    let context = canvas?.current.getContext('2d');
    canvas.current.height = 64
    canvas.current.width = 64
    context.drawImage(img, 0, 0, 64, 64)
    cacheImageData()
  }
  useEffect(()=>{
    // When we have icon src
    if(poiEdit?.icon?.value && !image && !isResizeIcon){
      const img =  new Image();
      img.src = poiEdit?.icon?.value;
      img.crossOrigin = "Anonymous";
      img.addEventListener('load', () => {
        drawImage(img)
      })
    }
  },[poiEdit])

  const handleDeleteIcon = async () =>{
    let context = canvas?.current.getContext('2d');
    if(image && !(poiEdit?.icon?.value instanceof File)){
      if(poiEdit?.icon?.value.includes('dev.api.akrotonx')){
        setDeleteMedia(prev=>({...prev,icon:true}))
      }
      setImage(null)
      context.clearRect(0, 0, canvas.current.width, canvas.current.height);
    } else {
      setImage(null)
      setDeleteMedia(prev=>({...prev,icon:true}))
      let context = canvas?.current.getContext('2d');
      context.clearRect(0, 0, canvas.current.width, canvas.current.height);
    }
    setEdited(true)
    onInputChange('icon', null, setPoiEdit, poiEdit);
  }
  useEffect(()=>{
    if(poiEdit?.icon?.value){
      if(!isFirstRender.current){
        isFirstRender.current = true;
        return
      }
      if(poiEdit?.icon?.value instanceof File){
        let fileReader = new FileReader();
        fileReader.readAsDataURL(poiEdit?.icon?.value)
        fileReader.addEventListener('load', (e)=>{
          const img =  new Image();
          img.src = e.target.result;
          img.addEventListener('load', () => {
            let context = canvas?.current.getContext('2d');
            let value = +poiEdit?.size?.value * 0.015 + 0.25;
            let widthImg = 64 * value;
            let heightImg = 64 * value;
            canvas.current.height = 64;
            canvas.current.width = 64;
            context.drawImage(img, 0, 0, widthImg, heightImg)
          })
        })
        canvas.current.toBlob((blob) => {
          let file = new File([blob], "fileName.png", { type: "image/png" })
          setIsResizeIcon(file)
        }, 'image/png');
      } else{
        const img =  new Image();
        img.src = poiEdit?.icon?.value;
        img.crossOrigin = "Anonymous";
        img.addEventListener('load', () => {
          let context = canvas?.current.getContext('2d');
          let value = +poiEdit?.size?.value * 0.015 + 0.25;
          let widthImg = 64 * value;
          let heightImg = 64 * value;
          canvas.current.height = 64;
          canvas.current.width = 64;
          context.drawImage(img, 0, 0, widthImg, heightImg);
        })
        canvas.current.toBlob((blob) => {
          let file = new File([blob], "fileName.png", { type: "image/png" })
          setIsResizeIcon(file)
        }, 'image/png');
      }
    }
  },[poiEdit?.size?.value])

  return (
    <div className='custom-icon'>
      <div className='custom-icon__button'>
        <CustomButton
          typeSize={'sizeSmall'}
          name='Upload'
          onClick={()=>file.current?.click()}
        />
        <input
          ref={file}
          className='file-upload'
          accept="image/*"
          type="file"
          onChange={handleUpload}
          style={{display:'none'}}/>
      </div>
      <div className='custom-icon__hex'>
        {color || '#76CEDC'}
      </div>
      <div onClick={handleOpenPicker}
           className='custom-icon__color'
           style={{backgroundColor:`${color}`}}>
      </div>
      {openColorPicker &&
      <div
        ref={colorPicker}
        className='custom-icon__picker'>
        <Chrome
          disableAlpha={false}
          color={color}
          onChange={handleChange}
        />
      </div>}
      <div className='custom-icon__preload'>
        <canvas ref={canvas} width="64px" height="64px"/>
      </div>
      {(image || (!!poiEdit?.icon?.value)) &&
      <div className='custom-icon__remove'
           onClick={handleDeleteIcon}>
        Remove
      </div>}
      <div className='custom-icon__error'>
        {imgError}
      </div>
    </div>
  )
}

export default CustomIcon