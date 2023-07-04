import React, { useRef, useState } from 'react';
import folder from '../../../assets/icons/folder.svg';
import { CustomCheckbox } from '../../../components/CustomCheckbox/CustomCheckbox';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { CustomSwitcher } from '../../../components/CustomSwitcher/CustomSwitcher';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { ImageComponent } from '../../../components/ImageComponent/ImageComponent';
import { ReactComponent as Check } from '../../../assets/icons/check-green.svg'
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../redux/actions'
import { useDispatch } from 'react-redux'
import { updateSpaceName } from '../../../crud/spaces/spaces'

export const SpacesTable = ({
    data,
    check,
    onCheck,
    handleDeleteModal,
    handleCreateEditFolderModal,
    handleModalSpaceStatus,
    handleManageCollaboratordModal,
    handleManageUsersModal,
    loadData,
    setVariantDelete
}) => {
    const [hover, setHover] = useState(null);
    const [open, setOpen] = useState(null);
    const [edited, setEdited] = useState(null)
    const history = useHistory();
    const ref = useRef();
    const input = useRef();
    const dispatch = useDispatch();
    useClickOutside(ref, () => {
        if (open) setOpen(false);
    });

    const getDisplay = id => {
        const checked = check?.find(item => item === id);
        if (open === id || checked || hover === id) {
            return 'flex';
        } else {
            return 'none';
        }
    };

    const onOpen = (id) => {
        if (open) {
            setOpen(null);
        } else {
            setOpen(id);
        }
    };

    const handleOpenFolder = elem => {
        history.push(`${location.pathname.split('?')[0]}/${elem.entity.title}?page=1`)
    };

    const handleOpenSpace = elem => {
        history.push(`/home/space/${elem.entity.id}/${elem.entity.url.split('/')[4]}`)
    };

    const updateName = () =>{
        dispatch(showLoaderAction())
        let updateObj = {
            status: edited?.entity?.status,
            name:edited?.entity?.name
        }
        updateSpaceName(edited?.entity?.id,updateObj).then(res=>{
            setEdited(null)
            loadData()
        }).catch((err)=>{
            const errors = err?.response?.data
            const {error,message,statusCode} = errors;
            dispatch(showSimpleModalAction({title:'Error',text:message}))
        }).finally(()=>{
            dispatch(hideLoaderAction())
        })
    }

    return (
        <div className="spaces-page__table">
            <div className="spaces-grid">
                {data?.map((elem, index) => {
                    if (elem.type === 'folder') {
                        return (
                            <div
                                className="grid-row" key={index}
                                onMouseEnter={() => setHover(elem.entity.id, false)}
                                onMouseLeave={() => setHover(null)}
                            >
                                <div
                                    className="grid-row__container"
                                    onClick={() => handleOpenFolder(elem)}
                                >
                                    <img className="grid-row__image" alt="folder" src={folder} />
                                </div>
                                <div className="grid-row__name">{elem.entity.title}</div>
                                <div className="grid-row__info">
                                    {`${elem.entity.childrenSpaces.length} ${elem.entity.childrenSpaces.length === 1 ? 'Space' : 'Spaces'}`}
                                </div>
                                <div className="grid-row__info">
                                    {`${elem.entity.childrenFolders.length} ${elem.entity.childrenFolders.length === 1 ? 'Folder' : 'Folders'}`}
                                </div>
                                <div className="grid-row__date">
                                    {`Created ${moment(elem.entity.createdAt).format('MMMM DD, YYYY')}`}
                                </div>

                                <div className="grid-row__actions">
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ display: getDisplay(elem.entity.id) }}>
                                            <div className="grid-row__checkbox">
                                                <CustomCheckbox
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        onCheck(elem.entity.id);
                                                    }}
                                                    checked={check.find(item => item === elem.entity.id)}
                                                />
                                            </div>
                                            <div
                                                className="grid-row__dots"
                                                onClick={() => onOpen(elem.entity.id)}
                                            >
                                                <div className="grid-row__dot" />
                                                <div className="grid-row__dot" />
                                                <div className="grid-row__dot" />
                                            </div>
                                        </div>

                                        {open === elem.entity.id && (
                                            <div className="spaces-grid__collapse spaces-grid__collapse-folder" ref={ref}>
                                                <div
                                                    className="spaces-grid__collapse-option"
                                                    onClick={() => {
                                                        handleOpenFolder(elem);
                                                        setOpen(false);
                                                    }}
                                                >View</div>
                                                <div
                                                    className="spaces-grid__collapse-option"
                                                    onClick={() => {
                                                        handleCreateEditFolderModal(elem);
                                                        setOpen(false);
                                                    }}
                                                >Rename</div>
                                                <div
                                                    className="spaces-grid__collapse-option"
                                                    onClick={() => {
                                                        setVariantDelete({
                                                            title:'Folder',
                                                            text:'Do you really want to remove this folder from AKROTONX? ' +
                                                              '(Everything inside the folder will also be removed. Spaces will not be removed from Matterport.)'
                                                        })
                                                        handleDeleteModal(elem);
                                                        setOpen(false);
                                                    }}
                                                >Delete</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div
                                className={`grid-row grid-row-space ${elem.entity.id === edited?.entity.id ? 'grid-row-space--edit' : ''}`}
                                key={index}
                                onMouseEnter={() => setHover(elem.entity.id, false)}
                                onMouseLeave={() => setHover(null)}
                            >
                                <div
                                    className="grid-row__container grid-row__space-container"
                                    onClick={() => handleOpenSpace(elem)}
                                >
                                    <ImageComponent src={`admin/spaces/${elem.entity.id}/preview?mode=prev`} />
                                    <div className='grid-row__switcher' onClick={e => e.stopPropagation()}>
                                        <CustomSwitcher
                                            onChange={() => handleModalSpaceStatus(elem)}
                                            checked={elem.entity.status}
                                        />
                                    </div>
                                </div>
                                { elem.entity.id === edited?.entity.id
                                  ?
                                  <div className='categories-tab__edit-wrap'>
                                      <input
                                        onChange={(e)=>{
                                            setEdited(prev=>({...prev,entity:{
                                                ...prev.entity,
                                                    name: e.target.value
                                                }}))
                                        }}
                                        ref={input}
                                        placeholder='Edit name'
                                        value={edited?.entity?.name}
                                        maxLength={255}
                                        className='categories-tab__input'
                                      />
                                      <button
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            setEdited(null)
                                        }}
                                        className='categories-tab__btn'>
                                          &#10006;
                                      </button>
                                      <button
                                        onClick={updateName}
                                        className='categories-tab__btn'>
                                          <Check/>
                                      </button>
                                  </div>
                                  :
                                    <div className="grid-row__name">{elem.entity.name}</div>
                                }
                                <div className="grid-row__info">{elem.entity.url}</div>
                                <div className="grid-row__date">
                                    {`Created ${moment(elem.entity.createdAt).format('MMMM DD, YYYY')}`}
                                </div>

                                <div className="grid-row__actions">
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ display: getDisplay(elem.entity.id, true) }}>
                                            <div className="grid-row__checkbox">
                                                <CustomCheckbox
                                                    onChange={() => onCheck(elem.entity.id)}
                                                    checked={check.find(item => item === elem.entity.id)}
                                                />
                                            </div>
                                            <div
                                                className="grid-row__dots"
                                                onClick={() => onOpen(elem.entity.id)}
                                            >
                                                <div className="grid-row__dot" />
                                                <div className="grid-row__dot" />
                                                <div className="grid-row__dot" />
                                            </div>
                                        </div>

                                        {open === elem.entity.id && (
                                            <div className="spaces-grid__collapse" ref={ref}>
                                                <div
                                                  className="spaces-grid__collapse-option"
                                                  onClick={() => {
                                                      // handleModalInvite(elem);
                                                      setTimeout(()=>{
                                                          input.current?.focus()
                                                      })
                                                      setEdited(elem)
                                                      setOpen(false);
                                                  }}
                                                >Rename</div>
                                                <div
                                                    className="spaces-grid__collapse-option"
                                                    onClick={() => {
                                                        handleOpenSpace(elem);
                                                        setOpen(false);
                                                    }}
                                                >Edit</div>
                                                <div
                                                    className="spaces-grid__collapse-option"
                                                    onClick={() => {
                                                        // handleManageSpacesModal(elem);
                                                        handleManageUsersModal(elem?.entity)
                                                        setOpen(false);
                                                    }}
                                                >Manage Users</div>
                                                <div
                                                    className="spaces-grid__collapse-option"
                                                    onClick={() => {
                                                        // handleResetPasswordModal(elem);
                                                        handleManageCollaboratordModal(elem?.entity)
                                                        setOpen(false);
                                                    }}
                                                >Manage Collaborators</div>
                                                <div
                                                    className="spaces-grid__collapse-option"
                                                    onClick={() => {
                                                        setVariantDelete({
                                                            title:'Space',
                                                            text:'Do you really want to remove this space from AKROTONX? ' +
                                                              '(The space will only be removed from AKROTONX Manager, but not from Matterport)'
                                                        })
                                                        handleDeleteModal(elem);
                                                        setOpen(false);
                                                    }}
                                                >Delete</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
};
