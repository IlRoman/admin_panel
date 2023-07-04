import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { useIsMount } from '../../../hooks/useIsMount';
import { CollaboratorsTable } from './CollaboratorsTable';
import { SimpleInput } from '../../../components/CustomInput/SimpleInput';
import { RouterPagination } from '../../../components/RouterPagination/RouterPagination';
import { showLoaderAction, hideLoaderAction } from '../../../redux/actions';
import { fetchCollaborators } from '../../../crud/collaborators';
import { ModalAddEditCollaborator } from '../Modals/ModalAddEditCollaborator/ModalAddEditCollaborator';
import { ModalDelete } from '../Modals/ModalDelete/ModalDelete';
import { ModalInvite } from '../Modals/ModalInvite/ModalInvite';
import { ModalResetPassword } from '../Modals/ModalResetPassword/ModalResetPassword';
import { ModalManageSpaces } from '../Modals/ModalManageSpaces/ModalManageSpaces';
import trash from '../../../assets/icons/trash.svg';
import plus from '../../../assets/icons/plus.svg';
import '../home.scss';
import './collaborators-page.scss';

export const CollaboratorsPage = ({ pageTitle }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const isfirstRender = useIsMount();
    const [search, setSearch] = useState('');
    const [check, setCheck] = useState([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState({ name: '10', value: 10 });
    const [count, setCount] = useState(0);
    const [orderDirection, setOrderDirection] = useState('desc');
    const [order, setOrder] = useState('number');
    const [tableData, setTableData] = useState([]);
    const [modalAddEdit, setModalAddEdit] = useState(false);
    const [current, setCurrent] = useState(null);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalInvite, setModalInvite] = useState(false);
    const [modalResetPassword, setModalResetPassword] = useState(false);
    const [manageSpacesModal, setManageSpacesModal] = useState(false);

    const loadData = () => {
        dispatch(showLoaderAction())
        fetchCollaborators({ params: { order, orderDirection, page, perPage: perPage.value, search } })
            .then(res => {
                dispatch(hideLoaderAction());
                setTableData(res.data.list);
                if((page !== 1) && (res.data.list.length === 0)){
                    setPage(1)
                }
                setCount(Math.ceil(res.data.countLeft / perPage.value + page));
            })
    };

    useEffect(() => {
        if (location && page === 0) setPage(+location.search.split('page=')[1]);
        if (page >= 1) loadData();
    }, [order, orderDirection, page, perPage, location]);

    useEffect(() => {
        if (isfirstRender) return;
        const handler = setTimeout(() => {
            dispatch(showLoaderAction())
            setPage(1);
            fetchCollaborators({ params: { order, orderDirection, page: 1, perPage: perPage.value, search } })
                .then(res => {
                    dispatch(hideLoaderAction());
                    setTableData(res.data.list);
                    setCount(Math.ceil(res.data.countLeft / perPage.value + page));
                })
        }, 1000);
        return () => clearTimeout(handler);
    }, [search]);

    const handleSearch = e => {
        setSearch(e.target.value);
    };

    const handleModalInvite = (elem) => {
        if (!current) {
            setCurrent(elem);
        } else {
            setCurrent(null);
        }
        setModalInvite(prev => !prev);
    };

    const onCheck = id => {
        if (id === 'select all') {
            if (check.length < tableData.length) {
                setCheck(tableData.map(elem => elem.id));
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

    const handleCurrent = (elem) => {
        if (elem) {
            setCurrent(elem);
        } else {
            setCurrent(null);
        }
    };

    const handleAddEditModal = elem => {
        handleCurrent(elem);
        setModalAddEdit(prev => !prev);
    };

    const handleDeleteModal = () => {
        setModalDelete(prev => !prev)
    };

    const handleResetPasswordModal = (elem) => {
        handleCurrent(elem);
        setModalResetPassword(prev => !prev);
    };

    const handleManageSpacesModal = (elem) => {
        handleCurrent(elem);
        setManageSpacesModal(prev => !prev);
    };

    return (
        <>
            <div className="subheader">
                <h2 className="subheader__title">{pageTitle}</h2>
                <div className="subheader__button">
                    <div onClick={() => handleAddEditModal(null)} className='subheader__button-item'>
                        <img alt="plus" src={plus} className="subheader__plus" />
                    </div>
                </div>
            </div>

            <div className="collaborators-page">
                {modalAddEdit &&
                    <ModalAddEditCollaborator
                        current={current}
                        closeModal={() => handleAddEditModal(null)}
                        loadData={loadData}
                    />
                }

                {modalDelete &&
                    <ModalDelete
                        check={check}
                        setCheck={setCheck}
                        text={
                            check.length === 1
                                ? "Do you really want to delete this collaborator (all associated spaces will be removed from AKOTRONX but not from Matterport)?"
                                : "Do you really want to delete these collaborators (all associated spaces will be removed from AKOTRONX but not from Matterport)?"
                        }
                        variant={`collaborator${check.length === 1 ? '' : 's'}`}
                        closeModal={handleDeleteModal}
                        loadData={loadData}
                        elementsLength={tableData.length}
                        setPage={setPage}
                    />
                }

                {modalInvite && (
                    <ModalInvite
                        variant="collaborator"
                        closeModal={handleModalInvite}
                        current={current}
                    />
                )}

                {modalResetPassword && (
                    <ModalResetPassword
                        variant="collaborator"
                        closeModal={handleResetPasswordModal}
                        current={current}
                    />
                )}

                {manageSpacesModal && (
                    <ModalManageSpaces
                        closeModal={handleManageSpacesModal}
                        current={current}
                    />
                )}

                <div className="collaborators-page__header-wrapper">
                    <div className="search">
                        <SimpleInput
                            onChange={handleSearch}
                            value={search}
                            placeholder="Search Collaborators"
                            isSearch={true}
                        />
                    </div>
                </div>

                <div className="collaborators-page__trash">
                    {check.length > 0 &&
                        <div className='collaborators-page__trash_image'>
                            <img src={trash} alt="delete" onClick={handleDeleteModal} />
                        </div>
                    }
                    <div />
                </div>

                <CollaboratorsTable
                    tableData={tableData}
                    onCheck={onCheck}
                    check={check}
                    setCheck={setCheck}
                    handleDeleteModal={handleDeleteModal}
                    handleAddEditModal={handleAddEditModal}
                    loadData={loadData}
                    setOrder={setOrder}
                    setOrderDirection={setOrderDirection}
                    handleModalInvite={handleModalInvite}
                    handleResetPasswordModal={handleResetPasswordModal}
                    handleManageSpacesModal={handleManageSpacesModal}
                />

                <RouterPagination
                    location="/home/collaborators"
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
