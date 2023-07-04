import React from 'react';
import { useDispatch } from 'react-redux';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions';
import { deleteCollaborator, deleteCollaborators } from '../../../../crud/collaborators';
import { deleteUser, deleteUsers } from '../../../../crud/users';
import { deleteEntities, deleteFolders, deleteSpace } from '../../../../crud/spaces/folders'
import { useHistory } from 'react-router-dom';
import './modal.scss';

export const ModalDelete = ({ check, setCheck, text, variant, closeModal, loadData, elementsLength = 101, setPage, data }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const submit = () => {
        if (check && check.length > 1) {
            // fetch massdelete
            switch (variant) {
                case "spaces":
                    // return fetch
                    break
                case "users":
                    dispatch(showLoaderAction());
                    deleteUsers(check)
                        .then(() => {
                            dispatch(hideLoaderAction());
                            closeModal();
                            setCheck([]);
                            if (elementsLength === check.length) {
                                history.push('/home/uesers?page=1');
                                setPage(1);
                            } else {
                                loadData();
                            }
                        })
                    break
                case "collaborators":
                    dispatch(showLoaderAction());
                    deleteCollaborators(check)
                        .then(() => {
                            dispatch(hideLoaderAction());
                            closeModal();
                            setCheck([]);
                            if (elementsLength === check.length) {
                                history.push('/home/collaborators?page=1');
                                setPage(1);
                            } else {
                                loadData();
                            }
                        })
                    break
                case "Folder":
                    dispatch(showLoaderAction());
                    let deleteItem = {
                      spacesIds:[],
                      foldersIds:[]
                    };
                    let findItems = data?.map(item =>{
                      let id = item?.entity?.id;
                      let getType = item?.type;
                      let inData = check.includes(id)
                      if(inData){
                        getType === "folder" ? deleteItem.foldersIds.push(id) : deleteItem.spacesIds.push(id)
                      }
                    })
                    deleteEntities(deleteItem)
                        .then(() => {
                            dispatch(hideLoaderAction());
                            closeModal();
                            setCheck([]);
                            loadData();
                        })
                    break
                default:
                  dispatch(showLoaderAction());
                  let deleteItems = {
                    spacesIds:[],
                    foldersIds:[]
                  };
                  let findItems1 = data?.map(item =>{
                    let id = item?.entity?.id;
                    let getType = item?.type;
                    let inData = check.includes(id)
                    if(inData){
                      getType === "folder" ? deleteItems.foldersIds.push(id) : deleteItems.spacesIds.push(id)
                    }
                  })
                  deleteEntities(deleteItems)
                    .then(() => {
                      dispatch(hideLoaderAction());
                      closeModal();
                      setCheck([]);
                      loadData();
                    })
                  ;
            }
        } else {
            // fetch delete
            switch (variant) {
                case "space":
                    // return fetch
                    break
                case "user":
                    dispatch(showLoaderAction());
                    deleteUser(check[0])
                        .then(() => {
                            dispatch(hideLoaderAction());
                            closeModal();
                            setCheck([]);
                            if (elementsLength === check.length) {
                                history.push('/home/users?page=1');
                                setPage(1);
                            } else {
                                loadData();
                            }
                        })
                    break
                case "collaborator":
                    dispatch(showLoaderAction());
                    deleteCollaborator(check[0])
                        .then(() => {
                            dispatch(hideLoaderAction());
                            closeModal();
                            setCheck([]);
                            if (elementsLength === check.length) {
                                history.push('/home/collaborators?page=1');
                                setPage(1);
                            } else {
                                loadData();
                            }
                        })
                    break
                case "Folder" || 'Items' || 'Space' || 'Folders'|| 'Spaces':
                    dispatch(showLoaderAction());
                    let findItems = data?.find((item)=>{
                      return item?.entity?.id === check[0]
                    })
                    if(findItems){
                      findItems?.type === "space" ?
                        deleteSpace(check)
                        .then(() => {
                          dispatch(hideLoaderAction());
                          closeModal();
                          setCheck([]);
                          loadData();
                        }) :
                        deleteFolders(check)
                        .then(() => {
                          dispatch(hideLoaderAction());
                          closeModal();
                          setCheck([]);
                          loadData();
                        })
                    }else{}
                    break
                default:
                  dispatch(showLoaderAction());
                  let deleteItems = {
                    spacesIds:[],
                    foldersIds:[]
                  };
                  let findItems1 = data?.map(item =>{
                    let id = item?.entity?.id;
                    let getType = item?.type;
                    let inData = check.includes(id)
                    if(inData){
                      getType === "folder" ? deleteItems.foldersIds.push(id) : deleteItems.spacesIds.push(id)
                    }
                  })
                  deleteEntities(deleteItems)
                    .then(() => {
                      dispatch(hideLoaderAction());
                      closeModal();
                      setCheck([]);
                      loadData();
                    })
                  ;
            }
        }
    };

    return (
        <div className="delete-modal">
            <CustomModal
                title={`Delete ${variant}`}
                close={closeModal}
                submit={submit}
                submitBtn="Confirm"
            >
                <p>{text}</p>
            </CustomModal >
        </div>
    )
};
