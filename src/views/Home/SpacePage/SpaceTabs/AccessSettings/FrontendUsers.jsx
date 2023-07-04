import React, { useEffect, useState } from 'react'
import { AccessSettingsTable } from '../AccessSettingsTable'
import { SimpleInput } from '../../../../../components/CustomInput/SimpleInput'
import { useIsMount } from '../../../../../hooks/useIsMount'
import { ConfirmModal } from '../../../Modals/ConfirmModal/ConfirmModal'
import { ModalAddEditCollaborator } from '../../../Modals/ModalAddEditCollaborator/ModalAddEditCollaborator'
import { ModalAddEditFrontendUser } from '../../../Modals/ModalAddEditFrontendUser/ModalAddEditFrontendUser'
import { addUserToSpace, deleteFrontendUser, getFrontendUser } from '../../../../../crud/spaces/spaces'
import { useDispatch } from 'react-redux'
import { hideLoaderAction, showLoaderAction, showSimpleModalAction } from '../../../../../redux/actions'
import { RouterPagination } from '../../../../../components/RouterPagination/RouterPagination'
import { CustomModal } from '../../../../../components/CustomModal/CustomModal'

const FrontendUsers = ({spaceData, addNew, setAddNew}) => {
  const [tableData, setTableData] = useState([]);
  const [order, setOrder] = useState('fullname');
  const [orderDirection, setOrderDirection] = useState('desc');
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState({ name: '10', value: 10 });
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [current, setCurrent] = useState(null);
  const [addEditModal,setAddEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false)
  const [confirmAdd, setConfirmAdd] = useState(false)
  const [email, setEmail] = useState('')
  const isfirstRender = useIsMount();
  const dispacth = useDispatch()

  useEffect(()=>{
    if(addNew === 'User'){
      setAddEditModal(prev=>!prev);
      setCurrent(null)
    }
  },[addNew])

  useEffect(()=>{
    //if(isfirstRender) return
    loadData()
  },[order,orderDirection,page,perPage])


  const loadData = () =>{
    dispacth(showLoaderAction())
    getFrontendUser(spaceData.id,{search,order,orderDirection,page,perPage:perPage.value}).then(res=>{
      let frontendList = res.data?.list;
      setTableData(frontendList)
      if((page !== 1) && (res.data.list.length === 0)){
        setPage(prevState => prevState - 1)
      }
      let totalPage = res.data.countLeft /perPage.value;
      setCount(Math.ceil(page +totalPage || 1));
    }).catch(err=>{
      const errors = err?.response?.data
      const {error,message,statusCode} = errors;
      dispacth(showSimpleModalAction({title:error,text:message}))
    }).finally(()=>{
      dispacth(hideLoaderAction())
    })
  }

  const handleSearch = e => {
    setSearch(e.target.value)
  }
  useEffect(() => {
    if(isfirstRender) return
    const handler = setTimeout(() => {
      loadData();
    }, 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const handleAddEditModal = (e,currentElement) =>{
    setAddEditModal(prev=>!prev);
    setCurrent(currentElement)
  }
  const closeModal = () =>{
    setAddEditModal(prev=>!prev);
    setCurrent(null);
    setAddNew('')
  }
  const handleDeleteModal = (e,currentElement) =>{
    setCurrent(currentElement);
    setDeleteModal(prev=>!prev)
  }
  const deleteUser = () =>{
    dispacth(showLoaderAction())
    deleteFrontendUser(spaceData?.id,current.id).then((res)=>{
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

  const addExistUser = () =>{
    dispacth(showLoaderAction())
    let send = {
      email
    }
    addUserToSpace(spaceData?.id,send)
      .then( res=>{
        closeModal()
        })
      .catch(err=>{
        const errors = err?.response?.data
        const {error,message,statusCode} = errors;
        dispacth(showSimpleModalAction({title:error,text:message}))
      })
      .finally(()=>{
        dispacth(hideLoaderAction())
        setConfirmAdd(prev=>!prev)
        setEmail('')
      })
  }

  return (
    <div>
      {deleteModal && <ConfirmModal
        title="Delete User"
        cancelBtn="No"
        submitBtn="Yes"
        submit={deleteUser}
        close={(e)=>handleDeleteModal(e,null)}
        text={`Do you really want to remove this User from ${spaceData.name}?`}
      />}
      {addEditModal && <ModalAddEditFrontendUser
        loadData={loadData}
        closeModal={closeModal}
        current={current}
        spaceData={spaceData}
        setConfirmAdd={setConfirmAdd}
        setEmail={setEmail}
      />}
      {confirmAdd &&
        <ConfirmModal
          title='Invite user'
          text='User with that email already exists, do you want to invite him to space?'
          cancelBtn="Cancel"
          submitBtn="Add"
          close={()=>setConfirmAdd(prev=>!prev)}
          submit={addExistUser}
        />
      }
      <div className='access-settings__search'>
        <SimpleInput
          placeholder='Search'
          value={search}
          onChange={handleSearch}
          isSearch={true}
        />
      </div>
      <AccessSettingsTable
        tableData={tableData}
        handleDeleteModal={handleDeleteModal}
        handleAddEditModal={handleAddEditModal}
        setOrder={setOrder}
        setOrderDirection={setOrderDirection}
      />
      <RouterPagination
        simplePagination={true}
        page={+page}
        setPage={setPage}
        count={count}
        perPage={perPage}
        setPerPage={setPerPage}
        disabled={true}
      />
    </div>
  )
}

export default FrontendUsers