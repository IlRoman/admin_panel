import React, { useEffect, useState } from 'react'
import { PoiStep1 } from './PoiSteps/PoiStep1';
import { PoiStep2 } from './PoiSteps/PoiStep2';
import { toNull } from '../../../../helpers/formUtils'

export const PointsOfInterest = ({
    spaceData,
    setSpaceData,
    edited,
    setEdited,
    handleCancelModal,
    closeModule,
    handleSuccessModal,
    setMediaModal,
    poiEdit,
    setPoiEdit,
    showcase,
    handleConfirmModal,
    openDeletePoiModal,
    updateStep1,
    setUpdateStep1,
    setHideAdd,
    poiPage,
    setPoiPage,
    poiList,
    setPoiList,
    setSuccessModal
}) => {
    const [step, setStep] = useState(1);
    const [current, setCurrent] = useState(null);
    useEffect(()=>{
        if(poiPage === 'step2'){
            setPoiPage('')
            setStep(2)
        } else if (poiPage === 'step1'){
            setPoiPage('')
            setStep(1)
        }
    },[poiPage])
    useEffect(()=>{
       return ()=> setPoiPage('')
    },[])
    return (
        <div className='poi-tab'>
            {step === 1
                ? <PoiStep1
                    spaceData={spaceData}
                    setSpaceData={setSpaceData}
                    edited={edited}
                    setEdited={setEdited}
                    handleCancelModal={handleCancelModal}
                    closeModule={closeModule}
                    handleSuccessModal={handleSuccessModal}
                    setStep={setStep}
                    setCurrent={setCurrent}
                    setPoiEdit={setPoiEdit}
                    openDeletePoiModal={openDeletePoiModal}
                    showcase={showcase}
                    updateStep1={updateStep1}
                    setUpdateStep1={setUpdateStep1}
                    poiListOriginal={poiList}
                    setPoiListOrigin={setPoiList}
                />
                : <PoiStep2
                    spaceData={spaceData}
                    setSpaceData={setSpaceData}
                    edited={edited}
                    setEdited={setEdited}
                    handleCancelModal={handleCancelModal}
                    closeModule={closeModule}
                    handleSuccessModal={handleSuccessModal}
                    setStep={setStep}
                    current={current}
                    setMediaModal={setMediaModal}
                    setPoiEdit={setPoiEdit}
                    poiEdit={poiEdit}
                    showcase={showcase}
                    handleConfirmModal={handleConfirmModal}
                    setHideAdd={setHideAdd}
                    setSuccessModal={setSuccessModal}
                    setPoiListOrigin={setPoiList}
                    poiListOriginal={poiList}
                />
            }
        </div>
    )
};
