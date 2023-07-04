import React, { useEffect, useState } from 'react'
import './space-tabs.scss';
import { Panos } from './Downloads/Panos'
import { Photos } from './Downloads/Photos'
import { SimpleInput } from '../../../../components/CustomInput/SimpleInput'
import { CustomDropdown } from '../../../../components/CustomDropdown/CustomDropdown'
import Img  from '../../../../assets/images/room.png'
import { CustomCheckbox } from '../../../../components/CustomCheckbox/CustomCheckbox'
import { ReactComponent as Delete} from '../../../../assets/icons/trash.svg'
import { ReactComponent as Download} from '../../../../assets/icons/download.svg'
import { SuccessModal } from '../../Modals/SuccessModal/SuccessModal'
import { ConfirmModal } from '../../Modals/ConfirmModal/ConfirmModal'
import { useDispatch } from 'react-redux'
import { hideLoaderAction, showLoaderAction } from '../../../../redux/actions'
import { deleteDownloadsSpace, getDownloadsSpace } from '../../../../crud/spaces/spaces'
import { useIsMount } from '../../../../hooks/useIsMount'
import { RouterPagination } from '../../../../components/RouterPagination/RouterPagination'
import { useLocation } from 'react-router-dom'

const FetchImages = [
  {url:Img
  ,checked:false
  },
  {url:'errd'
    ,checked:false
  }]

export const Downloads = ({ spaceData }) => {
  const optionSort = [
    {name:'By date asc',order:'createdAt',orderDirection:'asc'},
    {name:'By date desc',order:'createdAt',orderDirection:'desc'},
    {name: 'The name of image asc',order:'label',orderDirection:'asc'},
    {name: 'The name of image desc',order:'label',orderDirection:'desc'}]

  const isfirstRender = useIsMount();
  const location = useLocation();
  const [perPage, setPerPage] = useState({ name: '10', value: 10 });
  const [sortBy, setSortBy] = useState({name:'By date asc',order:'createdAt',orderDirection:'asc'})
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState('Photos');
  const [search, setSearch] = useState('');
  //const [sortBy , setSortBy] = useState({});
  const [type, setType] = useState('portrait')
  const [image, setImage] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [visibleAction , setVisibleAction] = useState(false);
  const [isDeleteModal , setIsDeleteModal] = useState(false);
  const dispatch = useDispatch();

  const loadData = async () => {
    dispatch(showLoaderAction())
    getDownloadsSpace(spaceData?.id,{
      search,
      page,
      perPage:perPage.value,
      type,
      order:sortBy.order,
      orderDirection:sortBy.orderDirection
    })
      .then(res=>{
        let updateObj = res.data.list?.map(list => {
          list.checked = false
          return list
        })
        setImage(updateObj);
        let totalPage = res.data.countLeft /perPage.value;
        if((page !== 1) && (res.data.list.length === 0)){
          setPage(prevState => prevState - 1)
        }
        setCount(Math.ceil(totalPage));
      }).finally(_=>dispatch(hideLoaderAction()))
  }
  useEffect(()=>{
    if(isfirstRender) return
    loadData()
  },[page,perPage,type,sortBy])
  useEffect(() => {
    if(isfirstRender) return
    const handler = setTimeout(() => {
      loadData();
    }, 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSearch = e => {
    setSearch(e.target.value)
  }
  const handleCheck = (e,item,type) => {
    if(type === 'all'){
      if(image.length === 0) return
      let value = !allChecked
      let allCheckedImg = image.map(img => {
        img.checked = value
        return img
      });
      setVisibleAction(value)
      setImage(allCheckedImg)
      //setAllChecked(prev=>!prev)
    }
    else {
      let updateArr = image.map((img)=>{
        if(item?.id === img?.id){
          img.checked = !img.checked;
          let value = img.checked ? setVisibleAction(true) : null
          return  img
        } else{
          return img
        }
      })
      setImage(updateArr)
      setAllChecked(false)
    }
  }
  useEffect(()=>{
      if(image?.length){
       let lengChecked = image?.filter(img => img.checked === true);
       let lengNotCheked = image?.filter(img => img.checked === false);
       let visibleCheckedAll = lengChecked?.length === image?.length;
       let visibleActionPanel = lengNotCheked?.length === image?.length;
        visibleActionPanel ? setVisibleAction(false) : null
        //setVisibleAction(visibleAction)
        setAllChecked(visibleCheckedAll)
      } else{
        setAllChecked(false)
        setVisibleAction(false)
      }
  },[image])

  const handleDownload = () =>{
    let downloadSearch = image?.filter(img => img.checked == true);
    downloadSearch?.forEach(image =>{
      fetch(image?.photo)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          let el = document.createElement("a");
          let objectURL = URL.createObjectURL(blob);
          el.setAttribute("href", objectURL);
          el.setAttribute("target", '_blank');
          el.setAttribute("download",image?.label || 'image.jpg');
          document.body.appendChild(el);
          el.click();
          el.remove();
        });
    })
  }

  const handleDelete = () =>{
    let deleteItems = [];
    let deleteSearch = image?.filter(img => img.checked == true);
    deleteSearch?.forEach(item => {
      let idItem = item.id;
      deleteItems.push(idItem)
    });
    if(deleteItems?.length === 0) return
    dispatch(showLoaderAction())
    deleteDownloadsSpace(spaceData?.id,{data:{ids:deleteItems}}).then(res=>{
    }).catch(err=>{
    }).finally(()=>{
      dispatch(hideLoaderAction())
      openDeletePoiModal()
      loadData()
    })
  }

  const openDeletePoiModal = () =>{
    setIsDeleteModal(prev=>!prev)
  }
  const resetState = async () =>{
    setPage(1)
    setPerPage({ name: '10', value: 10 })
    setCount(1)
    setAllChecked(false);
    setVisibleAction(false);
    setIsDeleteModal(false);
   setImage([])
  }

  const renderTab = () => {
    switch (tab) {
      case 'Photos':
        return (
          <Photos
            image={image}
            handleCheck={handleCheck}
          />
        )
      case 'Panos':
        return (
          <Panos
            image={image}
            handleCheck={handleCheck}
          />
        )
    }
  };
  useEffect(()=>{
    if(tab === 'Panos'){
      resetState()
      setType('landscape')
    } else{
      resetState()
      setType('portrait')
    }
  },[tab]);

  const handleChangeOption = (item) =>{
    setSortBy(item)
  }

  return (
    <>
      {isDeleteModal && <ConfirmModal
        title="Delete media"
        cancelBtn="No"
        submitBtn="Yes"
        submit={handleDelete}
        close={openDeletePoiModal}
        text="Do you really want to delete?"
      />}
    <div className='space-tab tuning-tab download-tab'>
      <h2 className='space-tab__title download-tab__title'>{`${spaceData?.name || 'Space'} - Downloads`}</h2>
      <div className='download-tab__head'>
        <div className='tuning-tab__tabs'>
          <div
            className={`tuning-tab__tab ${tab === 'Photos' ? 'tuning-tab__tab_active' : ''}`}
            onClick={() => setTab('Photos')}
          >Photos</div>
          <div
            className={`tuning-tab__tab ${tab === 'Panos' ? 'tuning-tab__tab_active' : ''}`}
            onClick={() => setTab('Panos')}
          >Panos</div>
        </div>
        <div className='download-tab__sort'>
          <div className='download-tab__sort-sorting'>
            <CustomDropdown
              placeholder='Floor'
              variant='grey'
              value={sortBy.name}
              onChange={handleChangeOption}
              options={optionSort}
              serch={false}
            />
          </div>
          <div className='download-tab__sort-search'>
            <SimpleInput
              placeholder='Search'
              value={search}
              onChange={handleSearch}
              isSearch={true}
            />
          </div>
        </div>
      </div>
      <div className='download-tab__actions'>
        <div className='download-tab__actions-item'>
          <CustomCheckbox
            checked={allChecked}
            onChange={(e)=>handleCheck(e,'','all')}/>
        </div>
        {visibleAction &&
          <>
          <div onClick={handleDownload} className='download-tab__actions-item'>
            <Download style={{width:'18px'}} />
          </div>
        <div onClick={openDeletePoiModal}
          className='download-tab__actions-item'>
          <Delete/>
        </div>
          </>}
      </div>

      {renderTab()}
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
      </>
  )
};
