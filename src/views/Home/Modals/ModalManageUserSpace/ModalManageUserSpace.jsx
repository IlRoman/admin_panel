import React, { useEffect, useState, useRef } from 'react';
import { CustomModal } from '../../../../components/CustomModal/CustomModal';
import { SimpleInput } from '../../../../components/CustomInput/SimpleInput';
import { useDispatch } from 'react-redux';
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../redux/actions';
import { fetchCollabs, manageCollabs } from '../../../../crud/users';
import smallArrow from '../../../../assets/icons/small-arrow.png';
import { CustomCheckbox } from '../../../../components/CustomCheckbox/CustomCheckbox';
import { useIsMount } from '../../../../hooks/useIsMount';
import { useInfiniteScroll } from '../../../../hooks/useInfiniteScroll';
import 'react-phone-number-input/style.css';
import './modal.scss';
import { addSpaceUser, fetchSpaceUser } from '../../../../crud/spaces/spaces'

const tableHead = [
  {
    title: 'Full Name',
    sortable: true,
    order: 'name',
    position: 'left',
  },
  {
    title: 'Email',
    sortable: true,
    order: 'email',
    position: 'left',
  },
  {
    title: 'Company',
    sortable: true,
    order: 'company',
    position: 'left',
  },
  {
    title: 'Assigned',
    sortable: true,
    order: 'assigned',
    position: 'center',
  },
];

export const ModalManageUserSpace = ({ closeModal, current }) => {
  const dispatch = useDispatch();
  const firstRender = useIsMount();
  const [search, setSearch] = useState('');
  const [collabList, setCollabList] = useState([]);
  const [order, setOrder] = useState('name');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [checked, setChecked] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [canLoad, setCanLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const tableBodyRef = useRef();

  useInfiniteScroll(tableBodyRef, setPage, setFetching, canLoad);

  const loadData = () => {
    if (fetching) {
      dispatch(showLoaderAction());
      fetchSpaceUser({ search, id: current?.id, order, orderDirection, page, perPage })
        .then(res => {
          dispatch(hideLoaderAction());
          if (res.data.list.length < perPage) setCanLoad(false);
          setCollabList(prev => {
            return [...prev, ...res.data.list]
          });
          setChecked([
            ...collabList.filter(elem => elem.assigned).map(elem => elem.id),
            ...res.data.list.filter(elem => elem.assigned).map(elem => elem.id)
          ]);
        })
        .finally(() => setFetching(false))
    }
  };

  useEffect(() => {
    if (current) loadData();
  }, [current, fetching]);

  useEffect(() => {
    if (firstRender) return;
    dispatch(showLoaderAction());
    fetchSpaceUser({ search, id: current?.id, order, orderDirection, page: 1, perPage })
      .then(res => {
        if (res.data.list.length < perPage) {
          setCanLoad(false);
        } else {
          setCanLoad(true);
        }
        setPage(1);
        dispatch(hideLoaderAction());
        setCollabList([...res.data.list]);
        setChecked(res.data.list.filter(elem => elem.assigned).map(elem => elem.id));
      })
  }, [order, orderDirection]);

  useEffect(() => {
    if (firstRender) return;
    const handler = setTimeout(() => {
      dispatch(showLoaderAction());
      fetchSpaceUser({ search, id: current.id, order, orderDirection, page: 1, perPage })
        .then(res => {
          if (res.data.list.length < perPage) {
            setCanLoad(false);
          } else {
            setCanLoad(true);
          }
          setPage(1);
          dispatch(hideLoaderAction());
          setCollabList([...res.data.list]);
          setChecked(res.data.list.filter(elem => elem.assigned).map(elem => elem.id));
        })
    }, 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = order => {
    setOrder(order);
    setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc');
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
    addSpaceUser( current.number,{ users: checked })
      .then(() => {
        dispatch(hideLoaderAction());
        closeModal();
      })
      .catch(err => {
        if (err?.response?.data?.error === 'Not Found') {
          dispatch(showSimpleModalAction({
            title:'Error',
            text: `User could not be added to space because his account has been deleted`
          }));
        }
      })
  };

  return (
    <div className="manage-col-modal">
      <form onSubmit={handleSubmit}>
        <CustomModal
          title="Manage Users"
          subtitle={`Check users to assign to ${current?.name}`}
          close={closeModal}
          cancelBtn="Cancel"
          submitBtn="Save"
          submit={handleSubmit}
        >
          <div className='manage-col-modal__search-container'>
            <div className='manage-col-modal__search'>
              <SimpleInput
                placeholder="Search"
                value={search}
                onChange={handleSearch}
                isSearch={true}
              />
            </div>
          </div>

          <div className='manage-col-modal__table'>
            <div className='manage-col-modal__table-head'>
              {tableHead.map((elem, index) => {
                return (
                  <div
                    className={`manage-col-modal__table-head-cell manage-col-modal__table-head-cell_${elem.position}`}
                    key={index}
                  >
                    <div className='manage-col-modal__table-head-title'>{elem.title}</div>
                    {elem.sortable &&
                    <div
                      className="manage-col-modal__sort"
                      onClick={() => handleSort(elem.order)}
                    >
                      <img
                        className="manage-col-modal__arrow-up"
                        alt="arrow"
                        src={smallArrow}
                      />
                      <img
                        className="manage-col-modal__arrow-down"
                        alt="arrow"
                        src={smallArrow}
                      />
                    </div>
                    }
                  </div>
                )
              })}
            </div>

            <hr style={{ opacity: '0.5', margin: '0' }} />

            {collabList.length > 0
              ? (
                <>
                  <div className='manage-col-modal__table-body' ref={tableBodyRef}>
                    {collabList.map((elem, index) => {
                      return (
                        <div key={index} className='manage-col-modal__table-body-row'>
                          <div className='manage-col-modal__table-body-cell'>
                            {`${elem.fname} ${elem.lname}`}
                          </div>
                          <div className='manage-col-modal__table-body-cell'>
                            {elem.email}
                          </div>
                          <div className='manage-col-modal__table-body-cell'>
                            {`${elem.company}`}
                          </div>
                          <div className='manage-col-modal__table-body-cell'>
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
                <div className='manage-col-modal__table-body-nodata'>
                  No search results found
                </div>
              )
            }
          </div>
        </CustomModal >
      </form>
    </div >
  )
};
