import React, { useReducer, useEffect, useState, useRef } from 'react'

import { useDispatch } from 'react-redux';
import { showLoaderAction, hideLoaderAction, showSimpleModalAction } from '../../../../../redux/actions'
import {
  addCategories, deleteCategories,
  getCategories, updateCategories,
} from '../../../../../crud/spaces/spaces'
import { useIsMount } from '../../../../../hooks/useIsMount'
import { ConfirmModal } from '../../../Modals/ConfirmModal/ConfirmModal'
import { RouterPagination } from '../../../../../components/RouterPagination/RouterPagination'
import { CategoryModal } from '../../../Modals/CategoryModal/CategortModal'
import { useClickOutside } from '../../../../../hooks/useClickOutside'
import {ReactComponent as Check} from '../../../../../assets/icons/check-green.svg'


export const Categories = ({ spaceData, addNew, setAddNew }) => {
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState({ name: '10', value: 10 });
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [current, setCurrent] = useState(null);
  const [addEditModal,setAddEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [open, setOpen] = useState(null);
  const ref = useRef();
  const input = useRef();
  useClickOutside(ref, () => {
    if (open) setOpen(false);
  });
  const isfirstRender = useIsMount();
  const dispacth = useDispatch()

  useEffect(()=>{
    if(addNew === 'Category'){
      setAddEditModal(prev=>!prev);
      setCurrent(null)
    }
  },[addNew])

  useEffect(()=>{
    //if(isfirstRender) return
    loadData()
  },[page,perPage])

  const loadData = () =>{
    dispacth(showLoaderAction())
    getCategories(spaceData.id,{page,perPage:perPage.value}).then(res=>{
      let categoryList = res.data?.list;
      if(categoryList?.length){
        categoryList.forEach(list => list.edit = false)
      }
      setTableData(categoryList)
      if((page !== 1) && (res.data.list.length === 0)){
        setPage(prevState => prevState - 1)
      }
      let totalPage = res.data.countLeft /perPage.value;
      setCount(Math.ceil(page + totalPage || 1));
    }).finally(()=>{
      dispacth(hideLoaderAction())
    })
  }

  const closeModal = () =>{
    setAddEditModal(prev=>!prev);
    setCurrent(null);
    setAddNew('');
    setCategoryError(null)
  }
  const handleDeleteModal = (e,currentElement) =>{
    setCurrent(currentElement);
    setDeleteModal(prev=>!prev);
  }
  const deleteUser = () =>{
    dispacth(showLoaderAction())
    deleteCategories(spaceData?.id,current.id).then((res)=>{
    }).catch((err)=>{
      const errors = err?.response?.data
      const {error,message,statusCode} = errors;
      dispacth(showSimpleModalAction({title:error,text:message}))
    }).finally(()=>{
      dispacth(hideLoaderAction())
      setDeleteModal(prev=>!prev)
      loadData()
    })
  }
  const updateCategory = (e) =>{
    dispacth(showLoaderAction())
    updateCategories(spaceData?.id,current.id,{category:current?.title}).then((res)=>{
    }).catch((err)=>{
      const errors = err?.response?.data
      const {error,message,statusCode} = errors;
      if(Array.isArray(message)){
        message[0] === "category should not be empty" ? message[0] = 'Category should not be empty' : message[0]
      }
      dispacth(showSimpleModalAction({title:'Error',text:message}))
    }).finally(()=>{
      dispacth(hideLoaderAction())
      loadData()
    })
  }

  const createCategory = (category) =>{
    dispacth(showLoaderAction())
    if(!category){
      setCategoryError('This field is required')
      dispacth(hideLoaderAction())
      return
    }
    addCategories(spaceData?.id,{category}).then((res)=>{
      loadData()
      closeModal()
    }).catch((err)=>{
      const errors = err?.response?.data
      const {error,message,statusCode} = errors;
      if(message === "category exists"){
        setCategoryError("Category exists")
      }else{
        dispacth(showSimpleModalAction({title:error,text:message}))
        closeModal()
      }
    }).finally(()=>{
      dispacth(hideLoaderAction())
    })
  }
  return (
    <div>
      {deleteModal && <ConfirmModal
        title="Delete Category"
        cancelBtn="Cancel"
        submitBtn="Confirm"
        submit={deleteUser}
        close={(e)=>handleDeleteModal(e,null)}
        text='Do you really want to remove this category?'
      />}
      {addEditModal && <CategoryModal
        title="New Category"
        cancelBtn="No"
        submitBtn="Save"
        submit={createCategory}
        close={closeModal}
        categoryError={{
          categoryError,
          setCategoryError
        }}
      />}
      <div className='categories-tab__table-head'>Category</div>
      {tableData.length > 0
        ? <div className='poi-tab__table-body categories-tab__table-body'>
          {tableData.map(elem => {
            return (
              <div className='categories-tab__table-row'>
                {elem.edit ?
                  <div className='categories-tab__edit'>
                    <div className='categories-tab__edit-wrap'>
                      <input
                        onChange={(e)=>{
                          setCurrent((prev)=>({...prev,title:e.target.value}))
                        }}
                        ref={input}
                        placeholder='Edit name'
                        value={current?.title}
                        maxLength={255}
                        className='categories-tab__input'
                      />
                      <button
                        onClick={(e)=>{
                          e.preventDefault();
                          setCurrent(null);
                          let update = tableData?.map(list =>({...list,edit:false}) );
                          setTableData(update)
                        }}
                        className='categories-tab__btn'>
                        &#10006;
                      </button>
                      <button
                        onClick={updateCategory}
                        className='categories-tab__btn'>
                        <Check/>
                      </button>
                    </div>
                    <p className='categories-tab__error'></p>
                  </div> :
                  <div className='poi-tab__table-cell categories-tab__table-cell'>
                  {elem.title || 'no name'}
                </div>}
                <div
                  className='poi-tab__table-cell categories-tab__table-cell'
                  style={{ position: 'relative' }}
                >
                  <div
                    className='poi-tab__dots'
                    onClick={() => setOpen(elem.id)}
                  >
                    <div className="poi-tab__dot" />
                    <div className="poi-tab__dot" />
                    <div className="poi-tab__dot" />
                  </div>

                  {open === elem.id && (
                    <div className="poi-tab__collapse categories-tab__collapse" ref={ref}>
                      <div
                        className="poi-tab__collapse-option"
                        onClick={() => {
                          setCurrent(elem);
                          setOpen(false);
                          let updateList = tableData?.map(item=>{
                            if(item.id === elem.id){
                              item.edit = true
                            } else {
                              item.edit = false
                            }
                            return item
                          });
                          setTableData(updateList)
                          setTimeout(()=>{
                            input?.current?.focus();
                          },500)
                        }}
                      >Rename</div>
                      <div
                        className="poi-tab__collapse-option"
                        onClick={(e) => {
                          handleDeleteModal(e,elem)
                          setOpen(false);
                        }}
                      >Delete</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        : <div className='poi-tab__table-cell poi-tab__table-cell-nodata'>
          There are no categories
        </div>
      }
      {<RouterPagination
        simplePagination={true}
        page={+page}
        setPage={setPage}
        count={count}
        perPage={perPage}
        setPerPage={setPerPage}
        disabled={true}
      />}
    </div>
  )
};
