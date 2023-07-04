import React, { useEffect, useState } from 'react'
import './modal.scss'
import ModalTileCreate from './ModalTileCreate'
import ModalTileType from './ModalTileType'
import {ReactComponent as Edit} from '../../../../assets/icons/editPen.svg'
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../redux/actions'
import { useDispatch } from 'react-redux'
import { deleteSimpleTile, fetchTile, patchTileMenu } from '../../../../crud/spaces/spaces'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { toNull } from '../../../../helpers/formUtils'
import { CustomSwitcher } from '../../../../components/CustomSwitcher/CustomSwitcher'

const ModalTile = ({spaceData,setSpaceData,showcase}) => {
  const [modalCreate, setModalCreate] = useState(false);
  const [modalTile, setModalTile] = useState(false);
  const [tileInfo, setTileInfo] = useState(null);
  const [typeTile, setTypeTile] = useState('');
  const [tileLinktype, setTileLinktype] = useState('');
  const [current, setCurrent] = useState(null)
  const [isNotSave ,setIsNotSave] = useState(false)
  const [idForUpdate,setIdFotUpdate] = useState(undefined)
  const [tileSetting, setTileSetting] = useState(null)
  const [isRemoveCurrent,setIsRemoveCurrent] = useState(false)
  const [urlMedia, setUrlMedia] = useState(null)
  const dispatch = useDispatch()

  const fetchTiles = () =>{
    dispatch(showLoaderAction())
    fetchTile(spaceData?.id)
      .then(res=>{
        let data = res?.data
        setTileInfo(data)
        setTileSetting(data?.tileSettings)
      })
      .catch((err)=>{
      const errors = err?.response?.data
      const {error,message,statusCode} = errors;
      dispatch(showSimpleModalAction({title:error,text:message}))
    })
      .finally(()=>{
        dispatch(hideLoaderAction())
        setIsRemoveCurrent(false)
        setUrlMedia(null)
    })
  }
  useEffect(()=>{
    fetchTiles()
  },[])

  const changeSwitch = (e) => {
    dispatch(showLoaderAction());
    let event = e.target.checked
    setTileSetting(prev=>({...prev,help:event}))
    let sender = {...tileSetting,help:event}
    patchTileMenu(
      location.pathname.split('/')[3],
      sender
    )
      .then(res => {
        dispatch(hideLoaderAction());
        setSpaceData(prev => ({
          ...prev,
          tileSettings: { ...res.data },
        }));
      })
  };
  const onChangeCreateModalDropdown = (e) =>{
    if(!e) return
    setTileLinktype(e)
    setCurrent(null)
    setModalCreate(false)
    setModalTile(true)
  }

  const onChangeModalDropdown = (e) =>{
    if(!e) return
    setTileLinktype(e)
    setModalCreate(false)
    setCurrent(null)
    setIsRemoveCurrent(true)
    setUrlMedia(null)
  }
  const getBg = (tile) =>{
    if(tile?.payload?.backgroundColor || tile?.url){
      return tile?.payload?.backgroundColor || `center / cover no-repeat url(${tile?.url})`
    } else{
      return
    }
  }
  const getBgHero = (tile) =>{
    if(tile?.hero?.backgroundColor || tile?.heroUrl){
      return tile?.hero?.backgroundColor || `center / cover no-repeat url(${tile?.heroUrl})`
    } else{
      return
    }
  }
  const getHeightHero = (tile) =>{
    if(tile?.hero?.height){
      return tile?.hero?.height+'px'
    } else{
      return '150px'
    }
  }
  const getTemplate = () =>{
    let getColum = spaceData?.tileSettings?.layoutColumns;
    if(Number.isInteger(getColum)){
     return `repeat(${getColum},1fr)`
    }else {
      return 'repeat(3,1fr)'
    }
  }
  const getHeighForItem = () =>{
    let getColum = spaceData?.tileSettings?.layoutColumns;
    if(Number.isInteger(getColum)){
      switch (getColum){
        case 1 :
          return '120px'
        case 2 :
          return '90px'
        case 3 :
          return '60px'
        case 4 :
          return '60px'
        case 5 :
          return '60px'
        default:
          return '60px'
      }
    }else {
      return '60px'
    }
  }
  return (
    <>
      {isNotSave && <ConfirmModal
        title="Delete tile"
        cancelBtn="No"
        submitBtn="Yes"
        submit={()=>{
          if(current){
            dispatch(showLoaderAction())
            deleteSimpleTile(spaceData.id,current)
              .then((res)=>{
                debugger
                fetchTiles()
              })
              .catch((err)=>{
                const errors = err?.response?.data
                const {error,message,statusCode} = errors;
                dispatch(showSimpleModalAction({title:error,text:message}))
              })
              .finally(()=>{
                setCurrent(null)
                setIsNotSave(false)
                dispatch(hideLoaderAction())
            })
          }
        }}
        close={()=>{
          setIsNotSave(false)
          setCurrent(null)
        }}
        text="Do you really want to remove this tile"
      />}
      {modalCreate &&
        <ModalTileCreate
          close={()=>{
            setCurrent(null)
            setModalCreate(false)
            setTypeTile('')
            setTileLinktype('')
          }}
          onChange={onChangeCreateModalDropdown}
          typeTile={typeTile}
        />
      }
      {
        modalTile && <ModalTileType
          spaceData={spaceData}
          showcase={showcase}
          close={()=>{
            setCurrent(null)
            setModalTile(false)
            setTypeTile('')
            setTileLinktype('')
            setIdFotUpdate(undefined)
            setIsRemoveCurrent(false)
            setUrlMedia(null)
          }}
          isCurrent={isRemoveCurrent}
          current={current}
          typeTile={typeTile}
          typeLink={tileLinktype}
          setTileLinktype={onChangeModalDropdown}
          updateDate={fetchTiles}
          currId = {idForUpdate}
          urlMedia={urlMedia}
        />
      }
      <div className='tile-modal'>
        <div
          style={{background:getBgHero(tileInfo),height:getHeightHero(tileInfo)}}
          className='tile-modal__hero'>
          {/*<div className='tile-modal__delete'>✖</div>*/}
          <button
            onClick={(e)=>{
              e.preventDefault();
              setTypeTile('hero')
              if(tileInfo?.heroLinktype == null){
                setModalCreate(true)
                setTileLinktype('')
              } else{
                setTileLinktype({
                  name: `${tileInfo?.heroLinktype.charAt(0).toUpperCase() + tileInfo?.heroLinktype.slice(1)}`,
                  value: tileInfo?.heroLinktype})
                setModalTile(true)
                setCurrent(tileInfo?.hero)
                setUrlMedia(tileInfo?.heroUrl)
              }
            }}
            className='tile-modal__btn tile-modal__hero__btn'>
            <Edit/>
          </button>
        </div>
        <div className='tile-modal__tile' style={{gridTemplateColumns:getTemplate()}}>
          {tileInfo?.tiles?.map((tile,index)=>{
           return(
              <div
                 key={index}
                onClick={(e)=>{
                  e.stopPropagation()
                  setTileLinktype({
                    name: `${tile?.linktype.charAt(0).toUpperCase() + tile.linktype.slice(1)}`,
                    value: tile.linktype})
                  setModalTile(true)
                  setCurrent(tile?.payload)
                  setUrlMedia(tile?.url)
                  setTypeTile('tile')
                  setIdFotUpdate(tile.id)
                }}
                 style={{background:getBg(tile),height:getHeighForItem()}}
                className='tile-modal__item_tile'>
              <div className='tile-modal__delete'
                onClick={(e)=>{
                  e.stopPropagation()
                  setIsNotSave(true)
                  setCurrent(tile?.id)
                }}
                >✖</div>
              </div>
          )
          })}
          <div onClick={(e)=>{
            e.preventDefault();
            setTypeTile('tile')
            setTileLinktype('')
            setModalCreate(true)
          }}
               style={{height:getHeighForItem()}}
               className='tile-modal__item-create'
          >+ Add</div>
        </div>
        <div className='tile-modal__help'>
          <div className='tile-modal__switcher-text'>Help</div>
            <div className='tile-modal__switcher'>
              <CustomSwitcher
                checked={tileSetting?.help}
                onChange={changeSwitch}
              />
            </div>
        </div>
      </div>
    </>
  )
}

export default ModalTile