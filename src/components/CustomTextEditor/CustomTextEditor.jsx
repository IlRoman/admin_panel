import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState,convertToRaw, ContentState } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './CustomTextEditor.scss';
import { onInputChange } from '../../helpers/formUtils'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { useDispatch } from 'react-redux'
import { showSimpleModalAction } from '../../redux/actions'
import { uploadPoiMedia, uploadTileMedia } from '../../crud/spaces/spaces'

const CustomTextEditor = ({setPoiEdit,poiEdit,setEdited,withValid = false,maxSize,isAwait,formName='description',isTile=false}) => {
  const dispatch = useDispatch();
  const [awaitData, setAwaitData] = useState(true)
  const getStateInitial = () =>{
    if(poiEdit?.description?.value){
      let blocksFromHtml = htmlToDraft(poiEdit?.description?.value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      return EditorState.createWithContent(contentState)
    }
    else {
      return EditorState.createEmpty()
    }
  }
  const [editorState, setEditorState] = useState(
    ()=>getStateInitial(),
    );
  useEffect(()=>{
    if(poiEdit?.[formName]?.value && isAwait && awaitData){
      let blocksFromHtml = htmlToDraft(poiEdit?.[formName]?.value);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState))
      setAwaitData(false)
    }
  },[poiEdit?.[formName]?.value])
  const handleEditorChange = (state) => {
    if(withValid && maxSize){
      const contentState = state.getCurrentContent();
      let length = contentState.getPlainText().length;
      if(length > maxSize){
        return
      }
    }
    setEditorState(state);
    convertContentToHTML();
    setEdited(true)
  }
  const convertContentToHTML = () => {
    let currentContentAsHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    onInputChange(formName, currentContentAsHTML, setPoiEdit, poiEdit)
  }
  const uploadCallback = (file) =>{
    return new Promise(
      (resolve, reject) => {
        const MAX_SIZE = 5_242_880;
        let allowedExtension = ['jpeg', 'jpg','png','gif'];
        const getSizeImg = file?.size;
        const getTypeImg = file?.type?.split('/').pop();
        let getCloseBtn = document.getElementsByClassName('rdw-image-modal-btn')
        if(getSizeImg > MAX_SIZE ) {
          getCloseBtn[1].click()
          setTimeout(()=>{
            dispatch(showSimpleModalAction({title:'Error',text:'Max size allow 5mb'}))
          })
          reject('error')
          return
        }
        if(!allowedExtension.includes(getTypeImg)){
          getCloseBtn[1].click()
          setTimeout(()=>{
            dispatch(showSimpleModalAction({title:'Error',text:'Wrong file type, available JPG, JPEG, GIF, PNG'}))
          })
          reject('error')
          return
        }
        const formData = new FormData();
        let poi = poiEdit?.id?.value
        formData.append('image', file);
        uploadPoiMedia(poiEdit?.id?.value,formData)
          .then((res)=>{
            let imageSrc = res?.data?.image;
            resolve({ data: { link: imageSrc } })
          })
          .catch((err)=>{
            const errors = err?.response?.data
            const {error,message,statusCode} = errors;
            dispatch(showSimpleModalAction({title:'Error',text:message}))
            reject('error')
          })
      }
    )
  }
  const uploadCallbackTile = (file) =>{
    return new Promise(
      (resolve, reject) => {
        const MAX_SIZE = 5_242_880;
        let allowedExtension = ['jpeg', 'jpg','png','gif'];
        const getSizeImg = file?.size;
        const getTypeImg = file?.type?.split('/').pop();
        let getCloseBtn = document.getElementsByClassName('rdw-image-modal-btn')
        if(getSizeImg > MAX_SIZE ) {
          getCloseBtn[1].click()
          setTimeout(()=>{
            dispatch(showSimpleModalAction({title:'Error',text:'Max size allow 5mb'}))
          })
          reject('error')
          return
        }
        if(!allowedExtension.includes(getTypeImg)){
          getCloseBtn[1].click()
          setTimeout(()=>{
            dispatch(showSimpleModalAction({title:'Error',text:'Wrong file type, available JPG, JPEG, GIF, PNG'}))
          })
          reject('error')
          return
        }
        const formData = new FormData();
        formData.append('image', file);
        uploadTileMedia(formData)
          .then((res)=>{
            let imageSrc = res?.data;
            debugger
            resolve({ data: { link: imageSrc } })
          })
          .catch((err)=>{
            const errors = err?.response?.data
            const {error,message,statusCode} = errors;
            dispatch(showSimpleModalAction({title:'Error',text:message}))
            reject('error')
          })
      }
    )
  }
  function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }
  const embedCallback = (embeddedLink) =>{
    if (embeddedLink.indexOf("youtube") >= 0){
      let id = '//www.youtube.com/embed/' + getId(embeddedLink) ;
      return id
    }
    return embeddedLink
  }
  const isValid = () =>{
    if(withValid && poiEdit?.[formName]?.error ){
      return 'custom-editor--errors'
    }else{
      return ''
    }
  }
  return (
    <div className={`custom-editor ${isValid()}`}>
      {withValid &&
        <div className='custom-editor__topright-err'>
          {poiEdit?.[formName]?.error}
        </div>}
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbarClassName="custom-editor__toolbar"
        wrapperClassName="custom-editor__wrapper"
        editorClassName="custom-editor__editor"
        toolbar={{
          options: ['inline', 'blockType', 'list', 'history','emoji','image','embedded'],
          inline: {
            options: ["bold", "italic", "underline"]
          },
          list: { inDropdown: true },
          link: { inDropdown: true },
          emoji:{inDropdown: true},
          image: {
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: false,
            uploadCallback:isTile ? uploadCallbackTile :  uploadCallback,
            previewImage: true,
            alt: { present: false, mandatory: false },
            defaultSize: {
              height: 'auto',
              width: (isTile ? '100%' :poiEdit?.modalSize?.value?.width) || 'auto',
            },
          },
          embedded:{
            embedCallback:embedCallback,
          },
        }}
      />
    </div>
  )
}

export default CustomTextEditor