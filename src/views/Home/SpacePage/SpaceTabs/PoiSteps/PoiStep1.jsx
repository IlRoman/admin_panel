import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CustomDropdown } from '../../../../../components/CustomDropdown/CustomDropdown';
import { SimpleInput } from '../../../../../components/CustomInput/SimpleInput';
import { getPoiList, updatePoi } from '../../../../../crud/spaces/spaces';
import { useIsMount } from '../../../../../hooks/useIsMount';
import { hideLoaderAction, showLoaderAction } from '../../../../../redux/actions';
import eye from '../../../../../assets/icons/eye.svg';
import eyeCrossed from '../../../../../assets/icons/eye-crossed-out.svg';
import { useClickOutside } from '../../../../../hooks/useClickOutside';
import { fillFormAction, toNull } from '../../../../../helpers/formUtils'

export const PoiStep1 = ({
    spaceData,
    setSpaceData,
    edited,
    setEdited,
    handleCancelModal,
    closeModule,
    handleSuccessModal,
    setStep,
    setCurrent,
    setPoiEdit,
    openDeletePoiModal,
    showcase,
    updateStep1,
    setUpdateStep1,
    poiListOriginal,
    setPoiListOrigin
}) => {
    const ref = useRef();
    const isFirstRender = useIsMount();
    const dispatch = useDispatch();
    const [search, setSearch] = useState();
    const [floor, setFloor] = useState({ name: '', value: '' });
    const [poiList, setPoiList] = useState([]);
    const [open, setOpen] = useState(null);

    useClickOutside(ref, () => {
        if (open) setOpen(false);
    });

    const loadData = () => {
        dispatch(showLoaderAction());
        let poiOrigin = poiListOriginal
        getPoiList(spaceData.id, { floor: floor.name, search })
            .then(res => {
                dispatch(hideLoaderAction());
                if(poiOrigin){
                    let getData = res.data?.map(poi =>{
                        let findItem = poiOrigin.find(origin => origin?.id == poi?.id);
                        if(findItem?.matterPortId){
                            poi.matterPortId = findItem?.matterPortId
                        }
                        return poi
                    })
                    setPoiList(getData);
                } else {
                    setPoiList(res.data.list);
                }
            })
    };

    useEffect(() => {
        loadData();
    }, [spaceData, floor]);
    useEffect(()=>{
        if(poiListOriginal?.length){
            let poi = poiList;
            let originPoi = poiListOriginal;
            let getData = poiList?.map(poi =>{
                let findItem = originPoi.find(origin => origin?.id == poi?.id);
                if(findItem?.matterPortId){
                    poi.matterPortId = findItem?.matterPortId
                }
                return poi
            })
            setPoiList(getData);
        }
    },[poiListOriginal])

    useEffect(()=>{
        if(updateStep1 === 'update'){
            loadData()
            setUpdateStep1(null)
        }
    },[updateStep1])

    useEffect(() => {
        if (isFirstRender) return;
        const handler = setTimeout(() => {
            loadData();
        }, 1000);
        return () => clearTimeout(handler);
    }, [search]);

    const handleSearch = e => {
        setSearch(e.target.value);
    };

    const handleChangeFloor = value => {
        setFloor(value);
    };

    const getFllors = () => {
        let arr = [];
        if (spaceData) {
            for (let i = 1; i <= spaceData.floors; i++) {
                arr.push({ name: i, value: i })
            }
        }
        return arr;
    };

    const handleChangeStatus = (poiId, elem) => {
        dispatch(showLoaderAction());
        const data = { ...elem };
        data.enabled = elem.enabled === true ? false : true;
        if (!data.mediaUrl) delete data.mediaUrl;
        if(!data?.category) data.categories = []
        updatePoi(spaceData.id, poiId, data)
            .then(res => {
                dispatch(hideLoaderAction())
                loadData();
                let updateItem = poiListOriginal.map(poi =>{
                    if(poi?.id ===  elem?.id){
                        poi.enabled = !poi?.enabled
                        return poi
                    }else{
                        return poi
                    }
                })
                setPoiListOrigin(updateItem)
                showcase.Mattertag.editOpacity(elem?.matterPortId, !elem?.enabled ? elem?.opacity : 0 ).then(edit=>{
                }).catch((err)=>{
                })
            })
    };

    return (
        <>
            <h2 className='poi-tab__title'>{`${spaceData?.name || 'Space'} - POIs`}</h2>
            <h3 className='poi-tab__subtitle'>
                Navigate to the desired location and click the <br />
                + button the pin the POI.
            </h3>

            <CustomDropdown
                placeholder='Floor'
                variant='grey'
                serch={false}
                value={floor.name}
                onChange={handleChangeFloor}
                options={getFllors()}
            />

            <div className='poi-tab__input-container'>
                <SimpleInput
                    placeholder='Search'
                    value={search}
                    onChange={handleSearch}
                    isSearch={true}
                />
            </div>

            <div className='poi-tab__table'>
                <div className='poi-tab__table-head poi-tab__table-row'>
                    <div />
                    <div>Name</div>
                    <div className='poi-tab__table-category'>Category</div>
                    <div />
                </div>

                {poiList.length > 0
                    ? <div className='poi-tab__table-body'>
                        {poiList.map((elem,index)=> {
                            return (
                                <div className='poi-tab__table-row'>
                                    <div className='poi-tab__table-cell'>
                                        <img
                                            src={elem.enabled ? eye : eyeCrossed}
                                            className={`poi-tab__table-eye ${elem.enabled ? '' : 'poi-tab__table-eye_crossed'}`}
                                            onClick={() => handleChangeStatus(elem.id, elem)}
                                        />
                                    </div>
                                    <div className={`poi-tab__table-cell ${elem.enabled ? '' : 'poi-tab__table-cell_disabled'}`}>
                                        {elem.name || 'no name'}
                                    </div>
                                    <div className={`poi-tab__table-cell ${elem.enabled ? '' : 'poi-tab__table-cell_disabled'}`}>
                                        {elem?.categories?.reduce((prevStr,category)=>{
                                            return prevStr + category?.title
                                        },'')}
                                    </div>
                                    <div
                                        className={`poi-tab__table-cell ${elem.enabled ? '' : 'poi-tab__table-cell_disabled'}`}
                                        style={{ position: 'relative' }}
                                    >
                                        <div
                                            className={`poi-tab__dots ${elem.enabled ? '' : 'poi-tab__dots_disabled'}`}
                                            onClick={() => setOpen(elem.id)}
                                        >
                                            <div className="poi-tab__dot" />
                                            <div className="poi-tab__dot" />
                                            <div className="poi-tab__dot" />
                                        </div>
                                        {open === elem.id && (
                                            <div
                                              className={`poi-tab__collapse ${((poiList.length - (index+1)) <= 1) && (poiList.length>2) ? 'poi-tab__collapse--top' : ''}`}
                                              ref={ref}>
                                                <div
                                                    className="poi-tab__collapse-option"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        setPoiEdit(toNull(null))
                                                        showcase?.Mattertag.preventAction(elem?.matterPortId, {
                                                            opening: true,
                                                        })
                                                        showcase?.Mattertag?.navigateToTag(elem?.matterPortId,
                                                          showcase.Mattertag.Transition.FLY)
                                                          .then((res)=>{

                                                          }).catch((err)=>{
                                                              console.log(err)
                                                        })
                                                    }}
                                                >View</div>
                                                <div
                                                    className="poi-tab__collapse-option"
                                                    onClick={() => {
                                                        setStep(2);
                                                        setCurrent(elem);
                                                        setOpen(false);
                                                        let mutate = elem?.categories?.reduce((arr,category)=>{
                                                            let item = {
                                                                name:category?.title,
                                                                value: category?.id
                                                            }
                                                            arr.push(item)
                                                            return arr
                                                        },[])
                                                        setPoiEdit(fillFormAction({
                                                            name: { value: elem?.name, touched: false, hasError: true, error: '' },
                                                            description: { value: elem?.description, touched: false, hasError: true, error: '' },
                                                            backgroundColor: { value: elem?.backgroundColor, touched: false, hasError: true, error: '' },
                                                            opacity: { value: elem?.opacity, touched: false, hasError: true, error: '' },
                                                            size: { value: elem?.size, touched: false, hasError: true, error: '' },
                                                            categories: { value: mutate || [], touched: false, hasError: true, error: '' },
                                                            mediaType: { value: elem?.mediaType, touched: false, hasError: true, error: '' },
                                                            mediaUrl: { value: elem?.mediaUrl, touched: false, hasError: true, error: '' },
                                                            mouseAction: { value: elem?.mouseAction, touched: false, hasError: true, error: '' },
                                                            matterPortId:{ value: elem?.matterPortId, touched: false, hasError: true, error: '' },
                                                            id:{ value: elem?.id, touched: false, hasError: true, error: '' },
                                                            isFormValid: false,
                                                            x:{ value: elem?.x, touched: false, hasError: true, error: '' },
                                                            y:{ value: elem?.y, touched: false, hasError: true, error: '' },
                                                            z:{ value: elem?.z, touched: false, hasError: true, error: '' },
                                                            floor: { value: elem?.floor, touched: false, hasError: true, error: '' },
                                                            createdAt:{ value: elem?.createdAt, touched: false, hasError: true, error: '' },
                                                            enabled:{ value: elem?.enabled, touched: false, hasError: true, error: '' },
                                                            image:{ value: {origin:elem?.image}, touched: false, hasError: true, error: '' },
                                                            icon:{ value: elem?.icon, touched: false, hasError: true, error: '' },
                                                            modalSize:{ value: elem?.modalSize, touched: false, hasError: true, error: '' },
                                                        }))
                                                        showcase?.Mattertag.preventAction(elem?.matterPortId, {
                                                            opening: true,
                                                        })
                                                        showcase?.Mattertag?.navigateToTag(elem?.matterPortId,
                                                          showcase.Mattertag.Transition.FLY)
                                                          .then((res)=>{

                                                          }).catch((err)=>{
                                                            console.log(err)
                                                        })

                                                    }}
                                                >Edit</div>
                                                <div
                                                    className="poi-tab__collapse-option"
                                                    onClick={() => {
                                                        openDeletePoiModal(elem)
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
                        There are no POIs
                    </div>
                }
            </div>
        </>
    )
};
