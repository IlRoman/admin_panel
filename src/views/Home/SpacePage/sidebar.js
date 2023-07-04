import { ReactComponent as Access } from '../../../assets/icons/access.svg';
import { ReactComponent as Camera } from '../../../assets/icons/camera.svg';
import { ReactComponent as Flag } from '../../../assets/icons/flag.svg';
import { ReactComponent as Info } from '../../../assets/icons/info.svg';
import { ReactComponent as Minimap } from '../../../assets/icons/minimap.svg';
import { ReactComponent as Pictures } from '../../../assets/icons/pictures.svg';
import { ReactComponent as Point } from '../../../assets/icons/point.svg';
import { ReactComponent as Tuning } from '../../../assets/icons/tuning.svg';
import { ReactComponent as Grid } from '../../../assets/icons/grid.svg';

export const sideBar = [
    {
        title: 'Info',
        icon: (active) => <Info className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
    {
        title: 'Set Starting Location',
        icon: (active) => <Flag className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
    {
        title: 'Fine Tuning',
        icon: (active) => <Tuning className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
    {
        title: 'Tile Menu',
        icon: (active) => <Grid className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
    {
        title: 'Mini Map',
        icon: (active) => <Minimap className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
    {
        title: 'Point of Interests (POIs)',
        icon: (active) => <Point className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
    {
        title: 'Take Photos',
        icon: (active) => <Camera className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
    {
        title: 'Downloads',
        icon: (active) => <Pictures className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
    {
        title: 'Access Settings',
        icon: (active) => <Access className='space-sidebar__item-icon' fill={active ? '#8DC63F' : '#969595'} />,
    },
];