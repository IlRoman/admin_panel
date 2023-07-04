import React, { useState, useRef, useEffect } from 'react';
import { ImageComponent } from '../../../components/ImageComponent/ImageComponent';
import { useLocation } from 'react-router-dom';
import play from '../../../assets/icons/play.svg';
import plus from '../../../assets/icons/plus.svg';
import { ReactComponent as Trash } from '../../../assets/icons/trash.svg';
import { ReactComponent as Edit } from '../../../assets/icons/edit.svg';
import './space.scss';
import ModalPoint from '../../../components/ModalPoint/ModalPoint'
import { useDispatch } from 'react-redux'
import { createPoi, getImageForMinimap, getMiniMap } from '../../../crud/spaces/spaces'
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../redux/actions'
import { fillFormAction, toNull } from '../../../helpers/formUtils'
import hexRgb from 'hex-rgb';
import { Downloads } from './SpaceTabs/Downloads'
import ModalTile from '../Modals/ModaTile/ModalTile'
import MiniMapModal from '../Modals/MiniMapModal/MiniMapModal'

const REACT_APP_MATTERPORT_SDK_KEY = process.env.REACT_APP_MATTERPORT_SDK_KEY;

// need fix
const sdkVersion = "3.5";

let intervalHandler = null;

export const Space = ({
  module,
  playSpace,
  setPlaySpace,
  showcase,
  setShowCase,
  poiEdit,
  hideAdd,
  poiList,
  setPoiList,
  spaceData,
  poiPage,
  setPoiEdit,
  openDeleteModal,
  downloadPage,
  setUpdateIsEdit,
  updateIsEdit,
  setSpaceData,
  updateMiniMap,
  setUpdateMiniMap,
  isMinimap
}) => {
  const ref = useRef();
  const location = useLocation();
  const [toolTip, setToolTip] = useState(false);
  const [active, setActive] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [coords, setCoords] = useState(null);
  const [newTags, setNewTags] = useState([]);
  const [load, setLoad] = useState(false);
  const [floor, setFloor] = useState([])
  const [miniMap, setMiniMap] = useState([])
  const [files, setFiles] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (updateIsEdit) {
      setIsEdit(prev => !prev)
      setUpdateIsEdit(false)
    }
  }, [updateIsEdit])
  const addPoi = (data, id) => {
    createPoi(spaceData.id, data)
      .then(res => {
        //setPoiList(res.data.list);
        let poiCreate = res.data;
        let mutate
        /*let mutate = options?.reduce((arr,category)=>{
          let item = {
            name:category?.title,
            value: category?.id
          }
          arr.push(item)
          return arr
        },[])*/
        setPoiEdit(fillFormAction({
          name: { value: poiCreate?.name, touched: false, hasError: true, error: '' },
          description: { value: poiCreate?.description, touched: false, hasError: true, error: '' },
          backgroundColor: { value: poiCreate?.backgroundColor, touched: false, hasError: true, error: '' },
          opacity: { value: poiCreate?.opacity, touched: false, hasError: true, error: '' },
          size: { value: poiCreate?.size, touched: false, hasError: true, error: '' },
          categories: { value: mutate || [], touched: false, hasError: true, error: '' },
          mediaType: { value: poiCreate?.mediaType, touched: false, hasError: true, error: '' },
          mediaUrl: { value: poiCreate?.mediaUrl, touched: false, hasError: true, error: '' },
          mouseAction: { value: poiCreate?.mouseAction, touched: false, hasError: true, error: '' },
          matterPortId: { value: poiCreate?.matterPortId || id, touched: false, hasError: true, error: '' },
          id: { value: poiCreate?.id, touched: false, hasError: true, error: '' },
          isFormValid: false,
          x: { value: poiCreate?.x, touched: false, hasError: true, error: '' },
          y: { value: poiCreate?.y, touched: false, hasError: true, error: '' },
          z: { value: poiCreate?.z, touched: false, hasError: true, error: '' },
          floor: { value: poiCreate?.floor, touched: false, hasError: true, error: '' },
          createdAt: { value: poiCreate?.createdAt, touched: false, hasError: true, error: '' },
          enabled: { value: poiCreate?.enabled, touched: false, hasError: true, error: '' },
          image: { value: { origin: poiCreate?.image }, touched: false, hasError: true, error: '' },
          icon: { value: poiCreate?.icon, touched: false, hasError: true, error: '' },
          modalSize: { value: poiCreate?.modalSize, touched: false, hasError: true, error: '' },
        }));
        showcase?.Mattertag.preventAction(id, {
          opening: true,
        })
        showcase?.Mattertag?.navigateToTag(id,
          showcase.Mattertag.Transition.FLY)
          .then((res) => {

          }).catch((err) => {
            console.log(err)
          })
        poiCreate.matterPortId = id;
        setPoiList(prev => [...prev, poiCreate])
        poiPage('step2')
        setNewTags([])
      }).finally(() => {
        dispatch(hideLoaderAction());
      })
  }

  // Find item
  const findTag = (id) => {
    let curPoi = poiList?.find(poi => poi.matterPortId === id);
    return curPoi
  }
  useEffect(() => {
    if (ref && playSpace) {

      async function onshowcaseConnect(mpSdk) {
        setShowCase(mpSdk);
        try {
          const modelData = await mpSdk.Model.getData();
          console.log('Model sid:' + modelData.sid);
          setLoad(true);
        } catch (e) {
          console.error(e);
        }
      };

      const handlePlaySpace = async () => {
        const iframe = document.getElementById('showcase-iframe');
        try {
          const mpSdk = await window.MP_SDK.connect(
            iframe,
            '', // key
            '' // Unused but needs to be a valid string
          );
          onshowcaseConnect(mpSdk);
        } catch (e) {
          console.error('handlePlaySpace', e);
        }
      };

      handlePlaySpace();
    }
  }, [playSpace, ref]);
  const loadMiniMap = async (type) => {
    dispatch(showLoaderAction());
    getMiniMap(spaceData.id).then(res => {
      let miniMap = res.data
      setMiniMap(miniMap)
      if (type == 'rel') {
        let currFloor = res.data?.find(map => map.floor === floor.floor)
        setFloor(currFloor)
      }
    }).catch(err => {
      const errors = err?.response?.data;
      const { error, message, statusCode } = errors;
      dispatch(showSimpleModalAction({ title: error, text: message }))
    }).finally(() => {
      dispatch(hideLoaderAction())
    })
  }
  useEffect(() => {
    if (spaceData?.id) {
      loadMiniMap()
    }
  }, [spaceData?.id])

  useEffect(() => {
    if (showcase) {
      showcase?.Floor.current.subscribe(function (currentFloor) {
        // Change to the current floor has occurred.
        if (currentFloor.sequence === -1) {
          console.log('Currently viewing all floors');
        } else if (currentFloor.sequence === undefined) {
          if (currentFloor.id === undefined) {
            console.log('Current viewing an unplaced unaligned sweep');
          } else {
            console.log('Currently transitioning between floors');
          }
        } else {
          let currFloor = parseInt(currentFloor.id) + 1;
          let findMiniMap = miniMap?.find(map => map.floor === currFloor)
          setFloor(findMiniMap)
          console.log('Currently on floor', currentFloor.id);
          console.log('Current floor\'s sequence index', currentFloor.sequence);
          console.log('Current floor\'s name', currentFloor.name)
        }
      });
    }
  }, [load, showcase])
  const getImg = (id) => {
    if (!id) {
      setFiles([])
      return
    }
    dispatch(showLoaderAction())
    getImageForMinimap(id).then(res => {
      if (res.data?.size === 0) {
        setFiles([])
        return
      }
      const reader = new window.FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = function () {
        let result = { preview: reader.result };
        setFiles(result)
      }
    }).catch(err => {
      setFiles([])
    }).finally(
      dispatch(hideLoaderAction())
    )
  }
  useEffect(() => {
    if (floor?.id && floor?.state) {
      getImg(floor.minimapId)
    } else if (!floor?.state) {
      setFiles(null)
    }
  }, [floor])

  useEffect(() => {
    if (updateMiniMap) {
      loadMiniMap('rel')
      setUpdateMiniMap(false)
    }
  }, [updateMiniMap])


  useEffect(() => {
    if (showcase && module === 'Point of Interests (POIs)' && active) {

      // detect focus on iframe and deactivate button
      window.focus();
      const handler = () => {
        setTimeout(() => {
          if (document.activeElement.tagName === "IFRAME") {
            setActive(false);
            setIsEdit(false);
          }
        });
      };
      window.addEventListener("blur", handler, { once: true });

      // connect to SDK
      const button = document.getElementById('iframe-button');
      const iframe = document.getElementById('showcase-iframe');

      window.MP_SDK.connect(iframe, REACT_APP_MATTERPORT_SDK_KEY, sdkVersion)
        .then(async function (theSdk) {
          var sdk = theSdk;
          var poseCache;
          sdk.Camera.pose.subscribe(function (pose) {
            poseCache = pose;
          });

          var intersectionCache;
          sdk.Pointer.intersection.subscribe(function (intersection) {
            intersectionCache = intersection;
            intersectionCache.time = new Date().getTime();
            button.style.display = 'none';
            buttonDisplayed = false;
          });
          var delayBeforeShow = 100;
          var buttonDisplayed = false;

          intervalHandler = setInterval(() => {
            if (!intersectionCache || !poseCache) {
              return;
            };
            if (newTags.length) {
              // console.log('getDiscPosition(newTags[0].tagId)', showcase.Mattertag.getDiscPosition(newTags[0].tagId));
              // console.log(intersectionCache?.position?.x, showcase.Mattertag.getDiscPosition(newTags[0].tagId)?.position?.x);
            }
            const nextShow = intersectionCache.time + delayBeforeShow;
            if (new Date().getTime() > nextShow) {
              if (buttonDisplayed) {
                return;
              };
              var size = {
                w: iframe.clientWidth,
                h: iframe.clientHeight,
              };
              var coord = sdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
              button.style.left = `${coord.x + 596}px`;
              button.style.top = `${coord.y + 80}px`;
              button.style.display = 'block';
              buttonDisplayed = true;
            };
          }, 16);

          button.addEventListener('click', function () {
            setCoords(intersectionCache);
          });
        });

      return () => {
        window.removeEventListener("blur", handler);
        clearInterval(intervalHandler);
        intervalHandler = null;
      };
    }
  }, [showcase, module, active]);

  useEffect(() => {
    if (newTags.length) {
      const poi = {
        matterPortId: null,
        name: "",
        description: "",
        backgroundColor: "#03687d",
        opacity: 100,
        size: 50,
        mediaType: "photo",
        floor: 2,
        enabled: true,
        mouseAction: false,
        x: 0,
        y: 0,
        z: 0,
        createdAt: new Date(),
        categories: []
      }
      showcase?.Mattertag.getData(newTags[0].tagId)
        .then(res => {
          let copy = [...res];
          let lastElement = copy.pop();
          poi.x = lastElement?.anchorPosition?.x;
          poi.z = lastElement?.anchorPosition?.z;
          poi.y = lastElement?.anchorPosition?.y;
          poi.floor = lastElement?.floorIndex;
          poi.stemVector = newTags[0].stemVector
          addPoi(poi, newTags[0].tagId)
        })

    }
  }, [newTags]);


  const addTag = () => {
    // example
    const tag = {
      label: "Example label",
      description: "Example description",
      anchorPosition: { x: coords.position.x, y: coords.position.y, z: coords.position.z },
      stemVector: { x: coords.normal.x, y: coords.normal.y, z: coords.normal.z },
      color: { r: 0, g: 1, b: 0 },
    };

    showcase.Mattertag.add([tag])
      .then(sid => {
        setIsEdit(false);
        setActive(false);
        setNewTags(prev => ([
          ...prev,
          { tagId: sid[0], ...tag }
        ]));
      })
      .catch((e) => {
        console.error(e);
      })
  };

  const handlePlaySpace = () => {
    setPlaySpace(true);
  };

  const isFormBlock =
    module !== 'Set Starting Location' &&
    module !== 'Take Photos';
  const isDownloads = module === 'Downloads'
  //Render poi when space is ready
  async function renderPoi() {
    await new Promise(resolve => setTimeout(resolve), 2000);
    // If space has POI and we delete from ourList need to delete forSpace
    showcase?.Mattertag.getData().then(function (mattertags) {
      let getList = poiList
      mattertags?.forEach(origMatt => {
        if (getList?.find(list => list?.matterPortId === origMatt?.sid)) {
        } else {
          showcase?.Mattertag.remove(origMatt.sid)
        }
      })
    })
    let poiRender = poiList?.map(poi => {
      if (poi?.matterPortId) {
        showcase?.Mattertag.preventAction(poi?.matterPortId, {
          opening: true,
        })
        let colorToRgb = hexRgb(poi?.backgroundColor);
        let r = colorToRgb.red / 255;
        let g = colorToRgb.green / 255;
        let b = colorToRgb.blue / 255;
        showcase?.Mattertag.editColor(poi?.matterPortId, {
          r,
          g,
          b
        });
        if (poi?.icon) {
          let math = Math.random()?.toFixed(3);
          showcase?.Mattertag.registerIcon(`${poi?.matterPortId}-${math}`, poi?.icon).then(res => {
            showcase.Mattertag.editIcon(poi?.matterPortId, `${poi?.matterPortId}-${math}`)
          })
        } else {

        }
        if (poi?.enabled) {
          //let opacity = poi?.opacity / 100
          //showcase.Mattertag.editOpacity(poi?.matterPortId, opacity)
        } else {
          showcase.Mattertag.editOpacity(poi?.matterPortId, 0)
        }
        return poi
      }
      else {
        let colorToRgb = hexRgb(poi?.backgroundColor);
        let r = colorToRgb.red / 255;
        let g = colorToRgb.green / 255;
        let b = colorToRgb.blue / 255;
        const tag = {
          label: "",
          description: "",
          anchorPosition: { x: poi.x, y: poi.y, z: poi.z },
          stemVector: poi?.stemVector || { x: 0, y: 0, z: 0 },
          color: { r, g, b },
        };
        showcase.Mattertag.add([tag])
          .then(sid => {
            /*showcase?.Mattertag.preventAction(sid[0], {
              opening: true,
            })*/
            if (poi?.icon) {
              let math = Math.random()?.toFixed(3);
              showcase?.Mattertag.registerIcon(`${sid[0]}-${math}`, poi?.icon).then(res => {
                showcase.Mattertag.editIcon(sid[0], `${sid[0]}-${math}`)
              })
            } else {

            }
            if (poi?.enabled) {
             // let opacity = poi?.opacity / 100
             // showcase.Mattertag.editOpacity(sid[0], opacity)
            } else {
              showcase.Mattertag.editOpacity(sid[0], 0)
            }

            poi.matterPortId = sid[0];
          })
        return poi
      }
    });
    await poiRender
  };
  // function for click metateg
  function editShow(tagSid, reverse) {
    if (reverse) {

    } else {
      setIsEdit(prev => !prev);
    }
    showcase?.Mattertag?.navigateToTag(tagSid,
      showcase.Mattertag.Transition.FLY)
    showcase?.Mattertag.preventAction(tagSid, {
      opening: true,
    })
    let modalDate = findTag(tagSid);
    if (!modalDate?.mouseAction) {
      let mutate = modalDate?.categories?.reduce((arr, category) => {
        let item = {
          name: category?.title,
          value: category?.id
        }
        arr.push(item)
        return arr
      }, []);
      setPoiEdit(fillFormAction({
        name: { value: modalDate?.name, touched: false, hasError: true, error: '' },
        description: { value: modalDate?.description, touched: false, hasError: true, error: '' },
        backgroundColor: { value: modalDate?.backgroundColor, touched: false, hasError: true, error: '' },
        opacity: { value: modalDate?.opacity, touched: false, hasError: true, error: '' },
        size: { value: modalDate?.size, touched: false, hasError: true, error: '' },
        categories: { value: mutate || [], touched: false, hasError: true, error: '' },
        mediaType: { value: modalDate?.mediaType, touched: false, hasError: true, error: '' },
        mediaUrl: { value: modalDate?.mediaUrl, touched: false, hasError: true, error: '' },
        mouseAction: { value: modalDate?.mouseAction, touched: false, hasError: true, error: '' },
        matterPortId: { value: modalDate?.matterPortId, touched: false, hasError: true, error: '' },
        id: { value: modalDate?.id, touched: false, hasError: true, error: '' },
        isFormValid: false,
        x: { value: modalDate?.x, touched: false, hasError: true, error: '' },
        y: { value: modalDate?.y, touched: false, hasError: true, error: '' },
        z: { value: modalDate?.z, touched: false, hasError: true, error: '' },
        floor: { value: modalDate?.floor, touched: false, hasError: true, error: '' },
        createdAt: { value: modalDate?.createdAt, touched: false, hasError: true, error: '' },
        enabled: { value: modalDate?.enabled, touched: false, hasError: true, error: '' },
        image: { value: { origin: modalDate?.image }, touched: false, hasError: true, error: '' },
        icon: { value: modalDate?.icon, touched: false, hasError: true, error: '' },
        modalSize: { value: modalDate?.modalSize, touched: false, hasError: true, error: '' },
      }))
    }
  }
  function hoverShow(tagSid, hovering) {
    console.log('Begin Hovering on', tagSid);
    showcase?.Mattertag.preventAction(tagSid, {
      opening: true,
    })
    let modalDate = findTag(tagSid);
    if (hovering && modalDate?.mouseAction) {
      showcase?.Mattertag?.navigateToTag(tagSid,
        showcase.Mattertag.Transition.FLY)
      let mutate = modalDate?.categories?.reduce((arr, category) => {
        let item = {
          name: category?.title,
          value: category?.id
        }
        arr.push(item)
        return arr
      }, [])
      setPoiEdit(fillFormAction({
        name: { value: modalDate?.name, touched: false, hasError: true, error: '' },
        description: { value: modalDate?.description, touched: false, hasError: true, error: '' },
        backgroundColor: { value: modalDate?.backgroundColor, touched: false, hasError: true, error: '' },
        opacity: { value: modalDate?.opacity, touched: false, hasError: true, error: '' },
        size: { value: modalDate?.size, touched: false, hasError: true, error: '' },
        categories: { value: mutate || [], touched: false, hasError: true, error: '' },
        mediaType: { value: modalDate?.mediaType, touched: false, hasError: true, error: '' },
        mediaUrl: { value: modalDate?.mediaUrl, touched: false, hasError: true, error: '' },
        mouseAction: { value: modalDate?.mouseAction, touched: false, hasError: true, error: '' },
        matterPortId: { value: modalDate?.matterPortId, touched: false, hasError: true, error: '' },
        id: { value: modalDate?.id, touched: false, hasError: true, error: '' },
        isFormValid: false,
        x: { value: modalDate?.x, touched: false, hasError: true, error: '' },
        y: { value: modalDate?.y, touched: false, hasError: true, error: '' },
        z: { value: modalDate?.z, touched: false, hasError: true, error: '' },
        floor: { value: modalDate?.floor, touched: false, hasError: true, error: '' },
        createdAt: { value: modalDate?.createdAt, touched: false, hasError: true, error: '' },
        enabled: { value: modalDate?.enabled, touched: false, hasError: true, error: '' },
        image: { value: { origin: modalDate?.image }, touched: false, hasError: true, error: '' },
        icon: { value: modalDate?.icon, touched: false, hasError: true, error: '' },
        modalSize: { value: modalDate?.modalSize, touched: false, hasError: true, error: '' },
      }))
    }
  }
  // When space is ready
  useEffect(() => {
    if (load && showcase) {
      showcase.on(showcase.Mattertag.Event.CLICK, editShow);
      showcase.on(showcase.Mattertag.Event.HOVER, hoverShow);
      renderPoi()
    }
    return () => {
      showcase?.off(showcase.Mattertag.Event.CLICK, () => { });
      showcase?.off(showcase.Mattertag.Event.HOVER, () => { });
    }
  }, [load, showcase])
  useEffect(() => {
    if (load && showcase) {
      showcase.on(showcase.Mattertag.Event.CLICK, (tagId) => editShow(tagId, 'reverse'));
      showcase.on(showcase.Mattertag.Event.HOVER, hoverShow);
    }
    return () => {
      showcase?.off(showcase.Mattertag.Event.CLICK, () => { });
      showcase?.off(showcase.Mattertag.Event.HOVER, () => { });
    }
  }, [poiList])

  const widthOfFrame = () => {
    if (module && (module === 'Access Settings')) {
      return 'calc(100vw - 795px)'
    } else if (module && isFormBlock) {
      return 'calc(100vw - 634px)'
    } else {
      return '100%'
    }
  }
  const widthOfContainer = () => {
    if (module && (module === 'Access Settings')) {
      return 'calc(100vw - 795px)'
    } else if (module && isFormBlock && !isDownloads) {
      return 'calc(100vw - 634px)'
    } else {
      return 'calc(100% - 50px)'
    }
  }

  return (
    <>
      {module === 'Point of Interests (POIs)' && active && (
        <div id="iframe-button" onClick={addTag} />
      )}

      {playSpace
        ? (
          <div
            className='space__iframe-container' ref={ref}
            style={{ width: widthOfContainer() }}
          >
            {module === 'Point of Interests (POIs)' && hideAdd && (
              <div className="poi-tab__button">
                <div className={`poi-tab__tooltip ${toolTip ? 'poi-tab__tooltip_active' : ''}`}>
                  Click the + button to add a <br />
                  Mattertag
                </div>

                {isEdit && (
                  <div
                    className='poi-tab__button-item'
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!poiEdit) {
                        setIsEdit(prev => !prev)
                        return
                      }
                      poiPage('step2');
                    }}
                  >
                    <Edit alt="edit" fill="#fff" />
                  </div>
                )}

                <div
                  className='poi-tab__button-elem'
                  onMouseOver={() => {
                    !isEdit && setToolTip(true)
                  }}
                  onMouseLeave={() => setToolTip(false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEdit(false)
                    setActive(prev => !prev);
                    setToolTip(false);
                  }}
                >
                  <img
                    alt="plus"
                    src={plus}
                    className={`poi-tab__plus ${active ? 'poi-tab__plus_active' : ''}`}
                  />
                </div>

                {isEdit && (
                  <div
                    className='poi-tab__button-item'
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!poiEdit) {
                        setIsEdit(prev => !prev)
                        return
                      }
                      let elem = {
                        ...poiEdit,
                        id: poiEdit?.id?.value,
                        matterPortId: poiEdit?.matterPortId?.value
                      }
                      openDeleteModal(elem)
                    }}
                  >
                    <Trash alt="delete" fill="#fff" />
                  </div>
                )}
              </div>
            )}
            {/*module === 'Point of Interests (POIs)' &&*/ (poiEdit && !(module === "Downloads") && !(module === "Tile Menu")) && (
              <ModalPoint
                module={module}
                poiEdit={poiEdit}
                setPoiEdit={setPoiEdit}
                hideAdd={hideAdd}
              />
            )
            }
            {files !== null && isMinimap && (
              <MiniMapModal
                src={files}
              />
            )
            }
            {module === "Tile Menu" && (
              <ModalTile
                showcase={showcase}
                spaceData={spaceData}
                setSpaceData={setSpaceData}
              />
            )}
            <iframe
              style={{
                width: widthOfFrame(),
                height: 'calc(100vh - 120px)',
                backgroundColor: 'grey',
                marginLeft: module && isFormBlock ? '' : '50px',
                cursor: 'pointer',
                display: `${module === 'Downloads' ? 'none' : 'block'}`
              }}
              src={`https://my.matterport.com/show${location.search}&play=1&&search=0title=0&applicationKey=${REACT_APP_MATTERPORT_SDK_KEY}`}
              frameBorder="0"
              allow="xr-spatial-tracking;"
              id="showcase-iframe">
            </iframe>
            {module === 'Downloads' && <Downloads spaceData={spaceData}>

            </Downloads>}
          </div>
        )
        : (
          <div
            style={{
              width: module && isFormBlock ? 'calc(100vw - 634px)' : 'calc(100% - 50px)',
              marginLeft: module && isFormBlock ? '' : '50px',
            }}
            className="space__preview-container"
          >
            <ImageComponent src={`admin/spaces/${location.pathname.split('/')[3]}/preview?mode=origin`} />
            <div
              className='space__preview-play-btn'
              onClick={handlePlaySpace}
            >
              <img src={play} />
            </div>
          </div>
        )}
    </>
  )
};
