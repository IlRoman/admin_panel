import React, { useState, useEffect, useRef, useReducer } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { ReactComponent as Exit } from '../../../assets/icons/exit.svg';
import { ReactComponent as Arrow } from '../../../assets/icons/arrow.svg';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { getPoiList, getSpace } from '../../../crud/spaces/spaces'
import { InfoTab } from './SpaceTabs/InfoTab';
import { hideLoaderAction, showLoaderAction } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import { ConfirmModal } from '../Modals/ConfirmModal/ConfirmModal';
import { SuccessModal } from '../Modals/SuccessModal/SuccessModal';
import { MediaModal } from '../Modals/MediaModal/MediaModal';
import { StartingLocation } from './SpaceTabs/StartingLocation';
import { FineTuningTab } from './SpaceTabs/FineTuningTab';
import { TakePhoto } from './SpaceTabs/TakePhoto'
import { sideBar } from './sidebar';
import { TileMenu } from './SpaceTabs/TileMenu';
import { PointsOfInterest } from './SpaceTabs/PointsOfInterest';
import { Space } from './Space';
import { formsReducer, toNull } from '../../../helpers/formUtils'
import { deletePoi as DelPoi } from '../../../crud/spaces/spaces'
import AccessSettings from './SpaceTabs/AccessSettings'
import MiniMap from './SpaceTabs/MiniMap'
import './space.scss';

export const SpacePage = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const sidebarRef = useRef();
    const [sidebarOpened, setSidebarOpened] = useState(false);
    const [module, setModule] = useState(null);
    const [hovered, setHovered] = useState('');
    const [spaceData, setSpaceData] = useState(null);
    const [edited, setEdited] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [showcase, setShowCase] = useState(null);
    const [playSpace, setPlaySpace] = useState(false);
    const [mediaModal, setMediaModal] = useState(false);
    const [editModalCansel, setEditModalCansel] = useState(false)
    // state for edit POI step 2
    const initialState = null;
    const [poiEdit, setPoiEdit] = useReducer(formsReducer, initialState);
    const [deletePoi, setDeletePoi] = useState(null);
    const [deletePoiModal, setDeletePoiModal] = useState(false);
    const [updateStep1, setUpdateStep1] = useState(null);
    const [hideAdd, setHideAdd] = useState(true)
    const [isChangeTab, setIsChangeTab] = useState(false)
    // state for allPOI
    const [poiList, setPoiList] = useState([]);
    // state for update poiSTEP from space page
    const [poiPage, setPoiPage] = useState('')
    const [title, setTitle] = useState('')
    const [updateIsEdit, setUpdateIsEdit] = useState()
    const [updateMiniMap, setUpdateMiniMap] = useState(false);
    const [isMinimap, setIsMinimap] = useState(true);

    useClickOutside(sidebarRef, () => {
        if (sidebarOpened) setSidebarOpened(false);
    });

    useEffect(() => {
        if (module === 'Downloads') {
            setIsMinimap(false);
        } else {
            setIsMinimap(true);
        }

        if (module === 'Set Starting Location' || module === 'Take Photos' || module === 'Downloads') {
            setPlaySpace(true);
        }
    }, [module]);

    useEffect(() => {
        setPlaySpace(true);
    }, []);

    useEffect(() => {
        dispatch(showLoaderAction());
        getSpace(location.pathname.split('/')[3])
            .then(res => {
                dispatch(hideLoaderAction());
                setSpaceData(res.data);
                getPoiList(location.pathname.split('/')[3])
                    .then(res => {
                        setPoiList(res.data);
                    }).finally(() => {
                        dispatch(hideLoaderAction());
                    })
            })
    }, []);

    const handleSideBar = () => {
        setSidebarOpened(prev => !prev);
    };

    const getSidebarTitleClass = (title) => {
        let arr = ['space-sidebar__item-title'];
        if (title === module) arr.push('space-sidebar__item-title_active');
        if (title === hovered) arr.push('space-sidebar__item-title_hovered');
        if (sidebarOpened) arr.push('space-sidebar__item-title_opened')
        return arr.join(' ');
    };

    const handleOpenModule = title => {
        setTitle(title)
        if (edited) {
            setIsChangeTab(prev => !prev)
        } else {
            setEdited(false)
            setSidebarOpened(false);
            setModule(title);
        }
    };

    const handleMouseOver = title => {
        if (!sidebarOpened) {
            setHovered(title);
        }
    };

    const handleCancelModal = () => {
        setCancelModal(prev => !prev);
    };
    const handleCancelEditModalCansel = () => {
        setEditModalCansel(prev => !prev)
    };
    const handleConfirmModal = () => {
        if (module === "Point of Interests (POIs)") {
            edited ? setEditModalCansel(prev => !prev) : setPoiPage('step1')
        } else {
            setEditModalCansel(prev => !prev)
        }
    }

    const renderTab = () => {
        switch (module) {
            case 'Info':
                return (
                    <InfoTab
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        edited={edited}
                        setEdited={setEdited}
                        handleCancelModal={handleCancelModal}
                        closeModule={closeModule}
                        handleSuccessModal={handleSuccessModal}
                    />
                )
            case 'Set Starting Location':
                return <StartingLocation showcase={showcase} />
            case 'Fine Tuning':
                return (
                    <FineTuningTab
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        edited={edited}
                        setEdited={setEdited}
                        handleCancelModal={handleCancelModal}
                        closeModule={closeModule}
                        handleSuccessModal={handleSuccessModal}
                    />
                )
            case 'Tile Menu':
                return (
                    <TileMenu
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        edited={edited}
                        setEdited={setEdited}
                        handleCancelModal={handleCancelModal}
                        closeModule={closeModule}
                        handleSuccessModal={handleSuccessModal}
                    />
                )
            case 'Mini Map':
                return (
                    <MiniMap
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        closeModule={closeModule}
                        setEditModalCansel={setEditModalCansel}
                        showcase={showcase}
                        setEdited={setEdited}
                        edited={edited}
                        setUpdateMiniMap={setUpdateMiniMap}
                    />
                )
            case 'Point of Interests (POIs)':
                return (
                    <PointsOfInterest
                        spaceData={spaceData}
                        setSpaceData={setSpaceData}
                        showcase={showcase}
                        edited={edited}
                        setEdited={setEdited}
                        handleCancelModal={handleCancelModal}
                        closeModule={closeModule}
                        handleSuccessModal={handleSuccessModal}
                        setMediaModal={setMediaModal}
                        poiEdit={poiEdit}
                        setPoiEdit={setPoiEdit}
                        handleConfirmModal={handleConfirmModal}
                        openDeletePoiModal={openDeletePoiModal}
                        updateStep1={updateStep1}
                        setUpdateStep1={setUpdateStep1}
                        setHideAdd={setHideAdd}
                        poiPage={poiPage}
                        setPoiPage={setPoiPage}
                        poiList={poiList}
                        setPoiList={setPoiList}
                        setSuccessModal={setSuccessModal}
                    />
                )
            case 'Take Photos':
                return <TakePhoto
                    spaceData={spaceData}
                    showcase={showcase} />
            case 'Access Settings':
                return <AccessSettings
                    spaceData={spaceData}
                    showcase={showcase}
                />
            default:
                return;
        }
    };

    const closeModule = () => {
        setEdited(false)
        setModule(null);
    };

    const leaveWithoutSavingChanges = () => {
        if (module === "Point of Interests (POIs)") {
            setPoiPage('step1')
            setEdited(false)
            setCancelModal(prev => !prev)
        } else {
            setModule(null);
            setEdited(false)
            setCancelModal(prev => !prev)
        }
    };

    const leaveWithoutSavingChangesEdit = () => {
        setEditModalCansel(prev => !prev)
        if (module === "Point of Interests (POIs)") {
            setPoiPage('step1')
        } else {
            setEdited(false)
            setModule(null);
        }
    }

    const handleSuccessModal = () => {
        setSuccessModal(prev => !prev);
    };

    const closeMediaModal = () => {
        setMediaModal(false);
    };

    //Delete POI modal function
    const openDeletePoiModal = (elem) => {
        if (elem) setDeletePoi(elem)
        else setDeletePoi(null)
        setDeletePoiModal(prev => !prev)
    }

    const confirmationDeletePoi = () => {
        DelPoi(spaceData.id, deletePoi?.id).then(res => {
            let updateList = poiList.filter(poi => poi?.id !== deletePoi?.id)
            setPoiList(updateList);
            setUpdateIsEdit(true)
            showcase?.Mattertag.remove(deletePoi?.matterPortId).then(ok => {
            }).catch(err => {
                debugger
            })
            setPoiEdit(toNull(null))
        }).catch(err => {
            debugger
        }).finally(() => {
            setDeletePoi(null);
            setDeletePoiModal(prev => !prev)
            setUpdateStep1('update')
        })
    }

    const isFormBlock =
        module !== 'Set Starting Location' &&
        module !== 'Take Photos';

    const isDownloads = module === 'Downloads'

    return (
        <div className='space'>
            {cancelModal && (
                <ConfirmModal
                    title="Changes not saved"
                    cancelBtn="No"
                    submitBtn="Yes"
                    submit={leaveWithoutSavingChanges}
                    close={handleCancelModal}
                    text="Are you sure you want to leave without saving changes?"
                />
            )}
            {isChangeTab && (
                <ConfirmModal
                    title="Changes not saved"
                    cancelBtn="No"
                    submitBtn="Yes"
                    submit={() => {
                        setIsChangeTab(prev => !prev)
                        setEdited(false)
                        setSidebarOpened(false);
                        setModule(title);
                    }}
                    close={() => setIsChangeTab(prev => !prev)}
                    text="Are you sure you want to leave without saving changes?"
                />
            )}
            {successModal && (
                <SuccessModal
                    title="Changes saved"
                    submitBtn="OK"
                    submit={handleSuccessModal}
                    close={handleSuccessModal}
                />
            )}
            {mediaModal && (
                <MediaModal
                    title="Add media link"
                    submitBtn="Save changes"
                    poiEdit={poiEdit}
                    setPoiEdit={setPoiEdit}
                    submit={() => setMediaModal(prev => !prev)}
                    close={closeMediaModal}
                />
            )}
            {editModalCansel && (
                <ConfirmModal
                    title="Changes not saved"
                    cancelBtn="No"
                    submitBtn="Yes"
                    submit={leaveWithoutSavingChangesEdit}
                    close={handleCancelEditModalCansel}
                    text="Are you sure you want to leave without saving changes?"
                />
            )}
            {deletePoiModal && (
                <ConfirmModal
                    title="Delete POI"
                    cancelBtn="No"
                    submitBtn="Yes"
                    submit={confirmationDeletePoi}
                    close={openDeletePoiModal}
                    text="Do you really want to remove this POI from this floor?"
                />
            )}
            <div
                className={`space-sidebar ${sidebarOpened ? 'space-sidebar_opened' : ''}`}
                ref={sidebarRef}
            >
                <div
                    className='space-sidebar__item'
                    style={{ overflow: hovered === 'Exit' ? 'visible' : '' }}
                    onClick={() => history.goBack()}
                >
                    <div
                        onMouseOver={() => handleMouseOver('Exit')}
                        onMouseOut={() => setHovered('')}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Exit fill='#969595' className='space-sidebar__item-icon' />
                    </div>
                    <div className={getSidebarTitleClass('Exit')}>
                        Exit
                    </div>
                </div>

                <div className='space-sidebar__name'>{sidebarOpened ? 'Space Name' : ''}</div>

                {sideBar.map(elem => {
                    return (
                        <div
                            className='space-sidebar__item'
                            style={{ overflow: hovered === elem.title ? 'visible' : '' }}
                            key={elem.title}
                            onClick={() => handleOpenModule(elem.title)}
                        >
                            <div
                                onMouseOver={() => handleMouseOver(elem.title)}
                                onMouseOut={() => setHovered('')}
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                {elem.icon(module === elem.title)}
                            </div>
                            <div className={getSidebarTitleClass(elem.title)}>
                                {elem.title}
                            </div>
                        </div>
                    )
                })}
                <div className="space-sidebar__openbtn" onClick={handleSideBar}>
                    <Arrow
                        className={`space-sidebar__openbtn-icon ${sidebarOpened ? 'space-sidebar__openbtn-icon_opened' : ''}`}
                        fill='#969595'
                    />
                    {sidebarOpened &&
                        <div className={getSidebarTitleClass(null)}>
                            Collapse Menu
                        </div>
                    }
                </div>
            </div>

            {module && isFormBlock && !isDownloads
                ? (
                    <div className={`space-module ${sidebarOpened ? 'space-module_opened' : ''} ${module === 'Access Settings' ? 'space-module--width' : ''}`}>
                        <div
                            className='space-module__close-module-btn'
                            onClick={() => {
                                if (edited) {
                                    handleCancelModal();
                                } else if (poiEdit && !hideAdd) {
                                    handleConfirmModal();
                                } else {
                                    closeModule();
                                }
                            }}
                        >&#10006;</div>
                        {renderTab()}
                    </div>
                )
                : <>{renderTab()}</>
            }

            <Space
                module={module}
                playSpace={playSpace}
                setPlaySpace={setPlaySpace}
                showcase={showcase}
                setShowCase={setShowCase}
                poiEdit={poiEdit}
                setPoiEdit={setPoiEdit}
                hideAdd={hideAdd}
                poiList={poiList}
                setPoiList={setPoiList}
                spaceData={spaceData}
                setSpaceData={setSpaceData}
                poiPage={setPoiPage}
                openDeleteModal={openDeletePoiModal}
                setUpdateIsEdit={setUpdateIsEdit}
                updateIsEdit={updateIsEdit}
                setUpdateMiniMap={setUpdateMiniMap}
                updateMiniMap={updateMiniMap}
                isMinimap={isMinimap}
            />
        </div >
    )
};
