import React, { useEffect, useState, useRef } from 'react';
import { SpacesTable } from './SpacesTable';
import { CustomBreadCrumbs } from '../../../components/CustomBreadCrumbs/CustomBreadCrumbs';
import { useDispatch } from 'react-redux';
import { hideLoaderAction, showLoaderAction } from '../../../redux/actions';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useLocation } from 'react-router-dom';
import { getFolders } from '../../../crud/spaces/folders';
import { ModalCreateEditFolder } from '../Modals/ModalCreateEditFolder/ModalCreateEditFolder';
import { ModalDelete } from '../Modals/ModalDelete/ModalDelete';
import { RouterPagination } from '../../../components/RouterPagination/RouterPagination';
import { CustomCheckbox } from '../../../components/CustomCheckbox/CustomCheckbox';
import smallArrow from '../../../assets/icons/small-arrow.png';
import { SimpleInput } from '../../../components/CustomInput/SimpleInput';
import { useIsMount } from '../../../hooks/useIsMount';
import { CustomFetchDropdown } from '../../../components/CustomDropdown/CustomFetchDropdown';
import plus from '../../../assets/icons/plus.svg';
import trash from '../../../assets/icons/trash.svg';
import moveFolder from '../../../assets/icons/move-folder.svg';
import { fetchUsers } from '../../../crud/users';
import './spaces-page.scss';
import { fetchCollaborators } from '../../../crud/collaborators';
import { ModalSpaceStatus } from '../Modals/ModalSpaceStatus/ModalSpaceStatus';
import { ModalSpaceAdd } from '../Modals/ModalSpaceAdd/ModalSpaceAdd'
import { ModalManageCollabSpace } from '../Modals/ModalManageCollabSpace/ModalManageCollabSpace'
import { ModalManageUserSpace } from '../Modals/ModalManageUserSpace/ModalManageUserSpace'

export const SpacesPage = ({ pageTitle }) => {
    const isFirstRender = useIsMount();
    const dispatch = useDispatch();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef();
    const treeRef = useRef();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [breadCrumbs, setBreadCrumbs] = useState([{ title: 'Main', path: '/home/spaces' }]);
    const [modalCreateFolder, setModalCreateFolder] = useState(false);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState({ name: '10', value: 10 });
    const [count, setCount] = useState(0);
    const [orderDirection, setOrderDirection] = useState('desc');
    const [check, setCheck] = useState([]);
    const [checkSpaces, setCheckSpaces] = useState([]);
    const [modalDelete, setModalDelete] = useState(false);
    const [thisFolder, setThisFolder] = useState(null);
    const [current, setCurrent] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [collabsList, setCollabsList] = useState([]);
    const [userFilter, setUserFilter] = useState(null);
    const [collaboratorFilter, setCollaboratorFilter] = useState(null);
    const [modalSpaceStatus, setModalSpaceStatus] = useState(false);
    const [showTree, setShowTree] = useState(false);
    const [searchFolder, setSearchFolder] = useState('');
    const [isCreateSpaceModal, setIsCreateSpaceModal] = useState(false)
    const [modalManageCollaborators, setModalManageCollaborators] = useState(false)
    const [modalManageUsers, setModalManageUsers] = useState(false)
    const [currentSingle, setCurrentSingle] = useState(null)
    const [variantForDeleteModal, setVariantForDeleteModal] = useState('')

    useClickOutside(buttonRef, () => {
        if (open) setOpen(false);
    });

    useClickOutside(treeRef, () => {
        if (showTree) setShowTree(false);
    });

    // get page number & load table data
    useEffect(() => {
        if (location && page === 0) setPage(+location.search.split('page=')[1]);
        if (page >= 1) loadData();
    }, [orderDirection, page, perPage, location, userFilter, collaboratorFilter]);

    // render breadcrubms
    useEffect(() => {
        let locationArray = location.pathname.split('?')[0].split('/');
        locationArray.splice(0, 3);
        let breadCrumbs = [{ title: 'Main', path: '/home/spaces' }];
        if (locationArray.length > 0) {
            locationArray.forEach((elem, index) => {
                breadCrumbs.push({ title: elem, path: `${breadCrumbs[index].path}/${elem}` });
            });
        }
        setBreadCrumbs(breadCrumbs);
    }, [location]);

    const loadData = () => {
        dispatch(showLoaderAction());
        getFolders({
            params: {
                search,
                userFilter: userFilter?.value?.id,
                collaboratorFilter: collaboratorFilter?.value?.id,
                orderDirection,
                order: 'date',
                page,
                perPage:perPage.value
            }
        }, location.pathname.split('/home/spaces')[1])
            .then(res => {
                dispatch(hideLoaderAction());
                setData(res.data?.list);
                setThisFolder(res.data?.thisFolder);
                setCount(Math.ceil(res.data.countLeft / perPage.value + page));
                if((page !== 1) && (res.data.list.length === 0)){
                    setPage(1)
                }
            })
    };

    useEffect(() => {
        if (isFirstRender) return;
        const handler = setTimeout(() => {
            dispatch(showLoaderAction());
            getFolders({
                params: {
                    search,
                    userFilter: userFilter?.value?.id,
                    collaboratorFilter: collaboratorFilter?.value?.id,
                    orderDirection,
                    order: 'date'
                }
            }, location.pathname.split('/home/spaces')[1])
                .then(res => {
                    dispatch(hideLoaderAction());
                    setData(res.data?.list);
                    setThisFolder(res.data?.thisFolder);
                    setCount(Math.ceil(res.data.countLeft / perPage.value + page));
                })
        }, 1000);
        return () => clearTimeout(handler);
    }, [search]);

    const handleSearch = e => {
        setSearch(e.target.value);
    };

    const handleOpen = () => {
        setOpen(prev => !prev);
    };

    const onCheck = id => {
        if (id === 'select all') {
            if (check.length < data.length) {
                setCheck(data.map(elem => elem.entity.id));
            } else {
                setCheck([]);
            }
        } else {
            setCheck(prev => {
                let arr = [...prev];
                const index = prev.findIndex(item => item === id);
                if (index === -1) {
                    arr.push(id)
                } else {
                    arr.splice(index, 1)
                }
                return arr;
            })
        }
    };

    const handleCurrent = elem => {
        if (elem) {
            setCurrent(elem);
        } else {
            setCurrent(null);
        }
    };

    const handleCreateEditFolderModal = elem => {
        handleCurrent(elem)
        setOpen(false);
        setModalCreateFolder(prev => !prev);
    };

    const handleCreateSpaceModal = elem => {
        setOpen(false);
        setIsCreateSpaceModal(prev => !prev);
    };

    const handleDeleteCategories = () =>{
        let checkedFilter = check?.reduce((acc,item,index)=>{
            let find = data?.find(dat => dat?.entity?.id === item);
              if(find){
                  let objKey = `${find.type}`
                  acc[objKey] =  (acc[objKey] || 0) + 1
                  return acc
              }else{
                 return
              }
        },{})
        switch (typeof checkedFilter == 'object'){
            case (checkedFilter?.folder > 0 && checkedFilter?.space > 0):
                setVariantForDeleteModal({
                    title:'Items',
                    text:'Do you really want to delete these items from AkrotonX?'
                })
            return
            case checkedFilter?.folder > 0 :
                setVariantForDeleteModal({
                    title:`${checkedFilter?.folder > 1 ? 'Folders' :'Folder'}`,
                    text:'Do you really want to remove this folder from AKROTONX? ' +
                      '(Everything inside the folder will also be removed. Spaces will not be removed from Matterport.)'
                })
            return
            case checkedFilter?.space > 0 :
                setVariantForDeleteModal({
                    title:`${checkedFilter?.space > 1 ? 'Spaces' :'Space'}`,
                    text:'Do you really want to remove this space from AKROTONX? ' +
                      '(The space will only be removed from AKROTONX Manager, but not from Matterport)'
                })
            default: return;
        }
    }

    const handleDeleteModal = elem => {
        if(elem){
            setCheck([elem.entity.id])
        }
        else {
            handleDeleteCategories()
        }
        setModalDelete(prev => !prev);
    };

    const fetchUsersList = (search, page, setCanLoad, setFetching) => {
        dispatch(showLoaderAction())
        fetchUsers({ params: { page, perPage: '10', search } })
            .then(res => {
                dispatch(hideLoaderAction());
                if (res.data.list.length < 10) setCanLoad(false);
                setUsersList(prev => {
                    const arr = res.data.list.map(elem => {
                        return {
                            name: `${elem.fname} ${elem.lname}`,
                            value: { ...elem },
                        }
                    })
                    return [...prev, ...arr];
                });
            })
            .finally(() => setFetching(false))
    };

    const fetchCollabsList = (search, page, setCanLoad, setFetching) => {
        dispatch(showLoaderAction())
        fetchCollaborators({ params: { page, perPage: '10', search } })
            .then(res => {
                dispatch(hideLoaderAction());
                if (res.data.list.length < 10) setCanLoad(false);
                setCollabsList(prev => {
                    const arr = res.data.list.map(elem => {
                        return {
                            name: `${elem.fname} ${elem.lname}`,
                            value: { ...elem },
                        }
                    })
                    return [...prev, ...arr];
                });
            })
            .finally(() => setFetching(false))
    };

    const handleModalSpaceStatus = elem => {
        handleCurrent(elem);
        setModalSpaceStatus(prev => !prev);
    };

    const handleTreeDropdpwn = () => {
        setShowTree(prev => !prev);
        setSearchFolder('');
    };

    const handleSearchFolder = e => {
        setSearchFolder(e.target.value);
    };

    const handleManageCollaboratordModal = (elem) => {
        setModalManageCollaborators(prev => !prev);
        if(elem){
            setCurrentSingle(elem)
        } else{
            setCurrentSingle(null)
        }
    };
    const handleManageUsersModal = (elem) => {
        setModalManageUsers(prev => !prev);
        if(elem){
            setCurrentSingle(elem)
        } else{
            setCurrentSingle(null)
        }
    };
    return (
        <>
            {modalManageCollaborators && (
              <ModalManageCollabSpace
                closeModal={handleManageCollaboratordModal}
                current={currentSingle}
              />
            )}
            {modalManageUsers && (
              <ModalManageUserSpace
                closeModal={handleManageUsersModal}
                current={currentSingle}
              />
            )

            }
            {modalCreateFolder && (
                <ModalCreateEditFolder
                    closeModal={() => handleCreateEditFolderModal(null)}
                    loadData={loadData}
                    thisFolder={thisFolder}
                    current={current}
                />
            )}
            {isCreateSpaceModal && (
              <ModalSpaceAdd
                closeModal={() => handleCreateSpaceModal(null)}
                thisFolder={thisFolder}
                loadData={loadData}
              />
            )}

            {modalDelete && (
                <ModalDelete
                    loadData={loadData}
                    check={check}
                    setCheck={setCheck}
                    closeModal={() => handleDeleteModal(null)}
                    data={data}
                    text={<>
                        {variantForDeleteModal?.text}
                    </>}
                    variant={variantForDeleteModal?.title}
                />
            )}

            {modalSpaceStatus && (
                <ModalSpaceStatus
                    loadData={loadData}
                    closeModal={() => handleModalSpaceStatus(null)}
                    current={current}
                />
            )}

            <div className="subheader">
                <h2 className="subheader__title">{pageTitle}</h2>
                <div className="subheader__button" ref={buttonRef}>
                    <div onClick={handleOpen} className='subheader__button-item'>
                        <img alt="plus" src={plus} className="subheader__plus" />
                    </div>
                    {open && (
                        <div className='subheader__select'>
                            <div
                              className='subheader__select-option'
                              onClick={()=>handleCreateSpaceModal(null)}
                            >
                                Add Space
                            </div>
                            <div
                                className='subheader__select-option'
                                onClick={() => handleCreateEditFolderModal(null)}
                            >Add Folder</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="spaces-page">
                <div className="spaces-page__header">
                    <div className="spaces-page__filters">
                        <div
                            className="spaces-page__filter"
                            onClick={() => setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                        >
                            <div className='spaces-page__filter-title'>Sorting by date</div>
                            <img
                                src={smallArrow}
                                className={`spaces-page__filter-arrow ${orderDirection === 'asc' ? 'spaces-page__filter-arrow_active' : ''}`}
                            />
                        </div>
                        <div className='spaces-page__filter-dropdown'>
                            <CustomFetchDropdown
                                variant="grey"
                                placeholder="Filter by User"
                                options={usersList}
                                setOptions={setUsersList}
                                fetchOptions={fetchUsersList}
                                onChange={value => setUserFilter(value)}
                                value={userFilter?.name || ''}
                                isCancelButton={true}
                            />
                        </div>
                        <div className='spaces-page__filter-dropdown'>
                            <CustomFetchDropdown
                                variant="grey"
                                placeholder="Filter by Collaborator"
                                options={collabsList}
                                setOptions={setCollabsList}
                                fetchOptions={fetchCollabsList}
                                onChange={value => setCollaboratorFilter(value)}
                                value={collaboratorFilter?.name || ''}
                                isCancelButton={true}
                            />
                        </div>
                        <div className="spaces-page__filter">
                            <SimpleInput
                                variant="grey"
                                placeholder="Search spaces or folders"
                                value={search}
                                onChange={handleSearch}
                                isSearch={true}
                            />
                        </div>
                    </div>

                    <div className='spaces-page__actions'>
                        <div className='spaces-page__actions-elem'>
                            <CustomCheckbox
                                onChange={() => onCheck('select all')}
                                checked={check.length === data.length}
                            />
                        </div>

                        {check.length > 0 && (
                            <>
                                <div
                                    className="spaces-page__trash spaces-page__actions-elem"
                                    onClick={handleTreeDropdpwn}
                                >
                                    <img src={moveFolder} alt="move folder" />
                                </div>
                                <div
                                    className="spaces-page__trash spaces-page__actions-elem"
                                    onClick={() => handleDeleteModal(null)}
                                >
                                    <img src={trash} alt="delete" />
                                </div>
                            </>
                        )}
                    </div>

                    {showTree && (
                        <div className='spaces-page__tree-dropdowm' ref={treeRef}>
                            <div className='spaces-page__tree-title'>Select a destination folder</div>
                            <div style={{ height: '38px' }}>
                                <SimpleInput
                                    onChange={handleSearchFolder}
                                    value={searchFolder}
                                    placeholder="Type a folder name to select"
                                    isSearch={true}
                                />
                            </div>
                            <div className='spaces-page__tree-body'>

                            </div>
                            <div className='spaces-page__tree-buttons'>
                                <div className='spaces-page__tree-button' onClick={handleTreeDropdpwn}>Cancel</div>
                                <div className='spaces-page__tree-button'>Move</div>
                            </div>
                        </div>
                    )}
                </div>

                {breadCrumbs.length > 1 && (
                    <div className="spaces-page__breadcrumbs">
                        <CustomBreadCrumbs data={breadCrumbs} />
                    </div>
                )}

                <SpacesTable
                    data={data}
                    check={check}
                    onCheck={onCheck}
                    handleDeleteModal={handleDeleteModal}
                    handleCreateEditFolderModal={handleCreateEditFolderModal}
                    handleModalSpaceStatus={handleModalSpaceStatus}
                    handleManageCollaboratordModal={handleManageCollaboratordModal}
                    handleManageUsersModal={handleManageUsersModal}
                    loadData={loadData}
                    setVariantDelete={setVariantForDeleteModal}
                />

                <RouterPagination
                    location={location.pathname.split('/home/spaces')[1]}
                    page={+page}
                    setPage={setPage}
                    count={count}
                    perPage={perPage}
                    setPerPage={setPerPage}
                    disabled={true}
                />
            </div>
        </>
    )
};
