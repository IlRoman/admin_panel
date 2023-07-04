import React from 'react'
import { CustomModal } from '../../../../components/CustomModal/CustomModal'
import { CustomDropdown } from '../../../../components/CustomDropdown/CustomDropdown'
import { onFocusOut, onInputChange } from '../../../../helpers/formUtils'

const ModalTileCreate = ({close,typeTile,onChange}) => {
  let optionHero = [
    { name: 'Text', value: 'text' },
    { name: 'Image', value: 'image' },
    { name: 'Music', value: 'music' },
    { name: 'Video', value: 'video' },
    { name: 'Iframe', value: 'iframe' },
  ];
  let optionTile = [
    { name: 'Text', value: 'text' },
    { name: 'Image', value: 'image' },
    { name: 'Music', value: 'music' },
    { name: 'Video', value: 'video' },
    { name: 'Iframe', value: 'iframe' },
    { name: 'External Link - New Tab', value: 'newTab' },
    { name: 'Matterport Flyover', value: 'mpFlyover' },
    { name: 'Matterport Deeplink', value: 'mpDeeplink' },
  ];
  return (
    <div className='tile-modal-type'>
      <CustomModal
        title="Tile Menu - Tile"
        close={close}
        isCancelBtn={false}
        isSubmitBtn={false}
      >
        <div className='tile-modal--subtitle'>Content Type</div>
        <CustomDropdown
          onChange={onChange}
          placeholder='Choose Content Type'
          options={typeTile === 'tile' ? optionTile : optionHero }
          variant='grey'
          serch={false}
        />
      </CustomModal>
    </div>
  )
}

export default ModalTileCreate