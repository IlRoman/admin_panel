import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClickOutside } from '../../hooks/useClickOutside';
import avatar from '../../assets/icons/avatar.svg';
import logoutIcon from '../../assets/icons/logout.svg';
import logo from '../../assets/icons/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoaderAction, setLanguage, showLoaderAction } from '../../redux/actions';
import { logout } from '../../crud/auth';
import './home.scss';

const defaultTabs = [
    {
        id: 1,
        title: 'Spaces',
        path: '/home/spaces',
        active: '/home/space',
    },
    {
        id: 2,
        title: 'Users',
        path: '/home/users',
        active: '/home/users',
    },
    {
        id: 3,
        title: 'Collaborators',
        path: '/home/collaborators',
        active: '/home/collaborators',
    },
];

const languages = [
    { name: 'English', value: 'en' },
    { name: 'Deutsch', value: 'ru' },
    { name: 'Italian', value: 'ru' }
];

const Home = ({ children }) => {
    const ref = useRef();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [profile, setProfile] = useState({ name: 'Profile Name' });
    const [pageTitle, setPageTitle] = useState('');
    const [modal, setModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const lang = useSelector(state => state.profile.language);
    const [open, setOpen] = useState(false);
    const [tabs, setTabs] = useState(defaultTabs);
    const role = useSelector(state => state.profile.role);

    useClickOutside(ref, () => setOpen(false));

    useEffect(() => {
        if (i18n) {
            i18n.changeLanguage(lang.value);
        }
    }, [i18n, lang]);

    useEffect(() => {
        if (!role) return;

        // need fix after backend
        if (role === 'user') {
            // hide Users tab for user role
            return setTabs(prev => prev.filter(elem => elem.title !== 'Users'));
        }

        if (role === 'collaborator' || role === 'frontend_user') {
            // hide Users and Collaborators tabs for collaborator and frontend_user roles
            return setTabs(prev => prev.filter(elem => elem.title !== 'Users' && elem.title !== 'Collaborators'))
        }
    }, [role]);

    useEffect(() => {
        let route = location.pathname.split('/');
        if (route.length === 4) route.pop();
        route = route.join('/');

        switch (route) {
            case '/home/dashboard':
                return setPageTitle('Dashboard')
            case '/home/spaces':
                return setPageTitle('Spaces')
            case '/home/users':
                return setPageTitle('Users')
            case '/home/collaborators':
                return setPageTitle('Collaborators')
            case '/home/media-library':
                return setPageTitle('Media Library')
            case '/home/customize':
                return setPageTitle('Customize')
            case '/home/help':
                return setPageTitle('Help')
            default:
                return;
        }
    }, [location, modal]);

    const getLinkPath = (elem) => {
        if (
            elem.path === '/home/users' ||
            elem.path === '/home/collaborators' ||
            elem.path === '/home/spaces'
        ) {
            return `${elem.path}?page=1`
        } else {
            return elem.path;
        }
    };

    const handleOpen = () => {
        setOpen(prev => !prev);
    };

    const onLogout = () => {
        dispatch(showLoaderAction())
        logout()
            .then(() => {
                localStorage.removeItem('akroton_access_token');
                dispatch(hideLoaderAction());
                history.push('/login');
            })
    };

    return (
        <>
            {modal}
            {deleteModal}

            <div className="home-page">
                <div className="header">
                    <img alt="logo" className="header__logo" src={logo} />

                    <div className="flex-sb">
                        {tabs.map(elem => {
                            return (
                                <Link
                                    key={elem.title}
                                    className={`header__tab ${location.pathname.includes(elem.active) ? 'header__tab_active' : ''}`}
                                    to={getLinkPath(elem)}
                                >
                                    {elem.title}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="header__user-info">
                        <div className="header__avatar">
                            <img alt="avatar" src={avatar} />
                        </div>

                        <div className="header__profile-dropdown" ref={ref}>
                            <div
                                className="header__profile-dropdown-button"
                                onClick={handleOpen}
                            >
                                <div className="header__profile-dropdown-title">
                                    {profile.name}
                                </div>
                                <div className={`arrow ${open ? 'arrow_up' : ''}`}>{'>'}</div>
                            </div>
                            {open && (
                                <div className="header__profile-select">
                                    <div
                                        className="header__profile-select-item"
                                        onClick={onLogout}
                                    >
                                        <img alt="logout" src={logoutIcon} />
                                        <div>Logout</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="home-main">
                    {children({ pageTitle })}
                </div>
            </div>
        </>
    )
};

export default Home;
