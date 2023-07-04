import React, { useEffect, useState, useRef } from 'react';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { SimpleInput } from '../../../../components/CustomInput/SimpleInput';
import { useDispatch } from 'react-redux';
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../redux/actions';
import { fetchUserSpaces, manageUserSpaces } from '../../../../crud/users';
import { fetchCollabSpaces, manageCollabSpaces } from '../../../../crud/collaborators';
import smallArrow from '../../../../assets/icons/small-arrow.png';
import { CustomCheckbox } from '../../../../components/CustomCheckbox/CustomCheckbox';
import { useLocation } from 'react-router-dom';
import { useIsMount } from '../../../../hooks/useIsMount';
import { useInfiniteScroll } from '../../../../hooks/useInfiniteScroll';
import 'react-phone-number-input/style.css';
import './modal.scss';

const tableHead = [
    {
        title: 'Space Name',
        sortable: true,
        order: 'name',
        position: 'left',
    },
    {
        title: 'Space Address',
        sortable: true,
        order: 'address',
        position: 'left',
    },
    {
        title: 'Assigned',
        sortable: true,
        order: 'assigned',
        position: 'center',
    },
];

export const ModalManageSpaces = ({ closeModal, current }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [spacesList, setSpacesList] = useState([]);
    const [order, setOrder] = useState('assigned');
    const [orderDirection, setOrderDirection] = useState('desc');
    const location = useLocation();
    const isFirstRender = useIsMount();
    const [checked, setChecked] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [canLoad, setCanLoad] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const tableBodyRef = useRef();

    useInfiniteScroll(tableBodyRef, setPage, setFetching, canLoad);

    useEffect(() => {
        if (current && fetching) {
            dispatch(showLoaderAction());
            if (location.pathname.includes('users')) {
                fetchUserSpaces(current.id, { search, order, orderDirection, page: page, perPage })
                    .then(res => {
                        if (res.data.list.length < perPage) setCanLoad(false);
                        setSpacesList(prev => {
                            return [...prev, ...res.data.list]
                        });
                        setChecked([
                            ...spacesList.filter(elem => elem.assigned).map(elem => elem.id),
                            ...res.data.list.filter(elem => elem.assigned).map(elem => elem.id)
                        ]);
                        if (res.data.list.length < perPage) {
                            setCanLoad(false);
                        } else {
                            setCanLoad(true);
                        }
                    })
                    .finally(() => {
                        dispatch(hideLoaderAction());
                        setFetching(false)
                    })
            } else {
                fetchCollabSpaces(current.id, { search, order, orderDirection, page: page, perPage })
                    .then(res => {
                        if (res.data.list.length < perPage) setCanLoad(false);
                        setSpacesList(prev => {
                            return [...prev, ...res.data.list]
                        });
                        setChecked([
                            ...spacesList.filter(elem => elem.assigned).map(elem => elem.id),
                            ...res.data.list.filter(elem => elem.assigned).map(elem => elem.id)
                        ]);
                        if (res.data.list.length < perPage) {
                            setCanLoad(false);
                        } else {
                            setCanLoad(true);
                        }
                    })
                    .finally(() => {
                        setFetching(false)
                        dispatch(hideLoaderAction());
                    })
            }
        }
    }, [current, fetching]);

    useEffect(() => {
        dispatch(showLoaderAction());
        if (location.pathname.includes('users')) {
            fetchUserSpaces(current?.id, { search, order, orderDirection, page: 1, perPage })
                .then(res => {
                    if (res.data.list.length < perPage) {
                        setCanLoad(false);
                    } else {
                        setCanLoad(true);
                    }
                    setPage(1);
                    setSpacesList([...res.data.list]);
                    setChecked(res.data.list.filter(elem => elem.assigned).map(elem => elem.id));
                })
                .finally(() => {
                    dispatch(hideLoaderAction());
                })
        } else {
            fetchCollabSpaces(current?.id, { search, order, orderDirection, page: 1, perPage })
                .then(res => {
                    if (res.data.list.length < perPage) {
                        setCanLoad(false);
                    } else {
                        setCanLoad(true);
                    }
                    setPage(1);
                    setSpacesList([...res.data.list]);
                    setChecked(res.data.list.filter(elem => elem.assigned).map(elem => elem.id));
                })
                .finally(() => {
                    dispatch(hideLoaderAction());
                })
        }
    }, [order, orderDirection]);

    useEffect(() => {
        if (isFirstRender) return;
        const handler = setTimeout(() => {
            dispatch(showLoaderAction());
            if (location.pathname.includes('users')) {
                fetchUserSpaces(current.id, { search, order, orderDirection, page: 1, perPage })
                    .then(res => {
                        if (res.data.list.length < perPage) setCanLoad(false);
                        setPage(1);
                        setSpacesList(res.data.list);
                        setChecked(res.data.list.filter(elem => elem.assigned).map(elem => elem.id));
                        if (res.data.list.length < perPage) {
                            setCanLoad(false);
                        } else {
                            setCanLoad(true);
                        }
                    })
                    .finally(() => {
                        dispatch(hideLoaderAction());
                        setFetching(false);
                    })
            } else {
                fetchCollabSpaces(current.id, { search, order, orderDirection, page: 1, perPage })
                    .then(res => {
                        if (res.data.list.length < perPage) setCanLoad(false);
                        setPage(1);
                        setSpacesList(res.data.list);
                        setChecked(res.data.list.filter(elem => elem.assigned).map(elem => elem.id));
                        if (res.data.list.length < perPage) {
                            setCanLoad(false);
                        } else {
                            setCanLoad(true);
                        }
                    })
                    .finally(() => {
                        setFetching(false)
                        dispatch(hideLoaderAction());
                    })
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleSort = (order, direction) => {
        setOrderDirection(direction);
        setOrder(order);
    };

    const handleChange = (id) => {
        setChecked(prev => {
            let arr = [...prev];
            let index = arr.findIndex(elem => +elem === +id);
            if (index === -1) {
                arr.push(id);
            } else {
                arr.splice(index, 1);
            }
            return arr;
        })
    };

    const handleSubmit = () => {
        dispatch(showLoaderAction());
        if (location.pathname.includes('users')) {
            manageUserSpaces(current.id, checked)
                .then(() => closeModal())
                .catch(err => {
                    if (err?.response?.data?.error === 'Not Found') {
                        // need fix
                        dispatch(showSimpleModalAction({
                            title: `Not Found`
                        }));
                    }
                })
                .finally(() => dispatch(hideLoaderAction()))
        } else {
            manageCollabSpaces(current.id, checked)
                .then(() => closeModal())
                .catch(err => {
                    if (err?.response?.data?.error === 'Not Found') {
                        // need fix
                        dispatch(showSimpleModalAction({
                            title: `Not Found`
                        }));
                    }
                })
                .finally(() => dispatch(hideLoaderAction()))
        }
    };

    return (
        <div className="manage-spaces-modal">
            <CustomModal
                title="Manage Spaces"
                subtitle={`Check spaces to assign to ${current?.fname} ${current?.lname}, ${current?.number}`}
                close={closeModal}
                type="submit"
                cancelBtn="Cancel"
                submitBtn="Save"
                submit={handleSubmit}
            >
                <div className='manage-spaces-modal__search-container'>
                    <div className='manage-spaces-modal__search'>
                        <SimpleInput
                            placeholder="Search Name and Address"
                            value={search}
                            onChange={handleSearch}
                            isSearch={true}
                        />
                    </div>
                </div>

                <div className='manage-spaces-modal__table'>
                    <div className='manage-spaces-modal__table-head'>
                        {tableHead.map((elem, index) => {
                            return (
                                <div
                                    className={`manage-spaces-modal__table-head-cell manage-spaces-modal__table-head-cell_${elem.position}`}
                                    key={index}
                                >
                                    <div className='manage-spaces-modal__table-head-title'>{elem.title}</div>
                                    {elem.sortable &&
                                        <div className="manage-spaces-modal__sort">
                                            <img
                                                className="manage-spaces-modal__arrow-up"
                                                alt="arrow"
                                                src={smallArrow}
                                                onClick={() => handleSort(elem.order, 'asc')}
                                            />
                                            <img
                                                className="manage-spaces-modal__arrow-down"
                                                alt="arrow"
                                                src={smallArrow}
                                                onClick={() => handleSort(elem.order, 'desc')}
                                            />
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>

                    <hr style={{ opacity: '0.5', margin: '0' }} />

                    {spacesList.length > 0
                        ? (
                            <>
                                <div className='manage-spaces-modal__table-body'>
                                    {spacesList.map((elem, index) => {
                                        return (
                                            <div key={index} className='manage-spaces-modal__table-body-row'>
                                                <div className='manage-spaces-modal__table-body-cell'>
                                                    {elem.name}
                                                </div>
                                                <div className='manage-spaces-modal__table-body-cell'>
                                                    {elem.address}
                                                </div>
                                                <div className='manage-spaces-modal__table-body-cell'>
                                                    <CustomCheckbox
                                                        checked={checked.find(item => item === elem.id)}
                                                        onChange={() => handleChange(elem.id)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className='spacer' />
                            </>
                        )
                        : (
                            <div className='manage-spaces-modal__table-body-nodata'>
                                No data
                            </div>
                        )
                    }
                </div>
            </CustomModal >
        </div>
    )
};
