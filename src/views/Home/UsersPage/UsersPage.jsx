import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { UsersTable } from './UsersTable';
import { SimpleInput } from '../../../components/CustomInput/SimpleInput';
import { RouterPagination } from '../../../components/RouterPagination/RouterPagination';
import { showLoaderAction, hideLoaderAction } from '../../../redux/actions';
import { useIsMount } from '../../../hooks/useIsMount';
import { fetchUsers } from '../../../crud/users';
import { ModalAddEditUser } from '../Modals/ModalAddEditUser/ModalAddEditUser';
import { ModalInvite } from '../Modals/ModalInvite/ModalInvite';
import { ModalDelete } from '../Modals/ModalDelete/ModalDelete';
import { ModalResetPassword } from '../Modals/ModalResetPassword/ModalResetPassword';
import { ModalManageSpaces } from '../Modals/ModalManageSpaces/ModalManageSpaces';
import { ModalManageCollaborators } from '../Modals/ModalManageCollaborators/ModalManageCollaborators';
import { ModalType } from '../Modals/ModalType/ModalType';
import trash from '../../../assets/icons/trash.svg';
import plus from '../../../assets/icons/plus.svg';
import '../home.scss';
import './users-page.scss';

export const UsersPage = ({ pageTitle }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const isfirstRender = useIsMount();
    const [search, setSearch] = useState('');
    const [check, setCheck] = useState([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState({ name: '10', value: 10 });
    const [orderDirection, setOrderDirection] = useState('desc');
    const [order, setOrder] = useState('fname');
    const [tableData, setTableData] = useState([]);
    const [count, setCount] = useState(0);
    const [modalAddEdit, setModalAddEdit] = useState(false);
    const [current, setCurrent] = useState(null);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalInvite, setModalInvite] = useState(false);
    const [modalResetPassword, setModalResetPassword] = useState(false);
    const [manageSpacesModal, setManageSpacesModal] = useState(false);
    const [modalManageCollaborators, setModalManageCollaborators] = useState(false);
    const [modalType, setModalType] = useState(false);

    const loadData = () => {
        dispatch(showLoaderAction())
        fetchUsers({ params: { order, orderDirection, page, perPage: perPage.value, search } })
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
    }, [order, orderDirection, page, perPage]);

    useEffect(() => {
        if (isfirstRender) return;
        const handler = setTimeout(() => {
            dispatch(showLoaderAction())
            setPage(1);
            fetchUsers({ params: { order, orderDirection, page: 1, perPage: perPage.value, search } })
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

    const handlePerPage = value => {
        setPerPage(value);
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

    const handleModalInvite = (elem) => {
        handleCurrent(elem);
        setModalInvite(prev => !prev);
    };

    const handleResetPasswordModal = (elem) => {
        handleCurrent(elem);
        setModalResetPassword(prev => !prev);
    };

    const handleManageSpacesModal = (elem) => {
        handleCurrent(elem);
        setManageSpacesModal(prev => !prev);
    };

    const handleManageCollaboratordModal = (elem) => {
        handleCurrent(elem);
        setModalManageCollaborators(prev => !prev);
    };

    const handleTypeModal = (elem) => {
        handleCurrent(elem);
        setModalType(prev => !prev);
    };

    return (
        <>
            {modalAddEdit &&
                <ModalAddEditUser
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
                            ? "Do You Really Want To Delete This User (All associated spaces and clients will also be removed from AKOTRONX but not from Matterport. If you wish to keep associated spaces and clients, first assign them to another user accordingly)"
                            : "Do You Really Want To Delete This Users (All associated spaces and clients will also be removed from AKOTRONX but not from Matterport. If you wish to keep associated spaces and clients, first assign them to another user accordingly)"
                    }
                    variant={`user${check.length === 1 ? '' : 's'}`}
                    closeModal={handleDeleteModal}
                    loadData={loadData}
                    elementsLength={tableData.length}
                    setPage={setPage}
                />
            }

            {modalInvite && (
                <ModalInvite
                    closeModal={handleModalInvite}
                    current={current}
                />
            )}

            {modalResetPassword && (
                <ModalResetPassword
                    variant="collaborators"
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

            {modalManageCollaborators && (
                <ModalManageCollaborators
                    closeModal={handleManageCollaboratordModal}
                    current={current}
                />
            )}

            {modalType && (
                <ModalType
                    closeModal={handleTypeModal}
                    current={current}
                    loadData={loadData}
                />
            )}

            <div className="subheader">
                <h2 className="subheader__title">{pageTitle}</h2>
                <div className="subheader__button">
                    <div onClick={e => handleAddEditModal(null)} className='subheader__button-item'>
                        <img alt="plus" src={plus} className="subheader__plus" />
                    </div>
                </div>
            </div>

            <div className="users-page">
                <div className="users-page__header-wrapper">
                    <div className="search">
                        <SimpleInput
                            onChange={handleSearch}
                            value={search}
                            placeholder={'Search Users'}
                            isSearch={true}
                        />
                    </div>
                </div>

                <div className="users-page__trash">
                    {check.length > 0 &&
                        <div className='users-page__trash_image'>
                            <img src={trash} alt="delete" onClick={handleDeleteModal} />
                        </div>
                    }
                    <div />
                </div>

                <UsersTable
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
                    handleManageCollaboratordModal={handleManageCollaboratordModal}
                    handleTypeModal={handleTypeModal}
                />

                <RouterPagination
                    location="/home/users"
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
