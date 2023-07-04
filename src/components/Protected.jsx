import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

export const Protected = ({ roles, redirect, children }) => {
    const role = useSelector(state => state.profile.role);
    const [isRedirect, setIsRedirect] = useState(false);

    useEffect(() => {
        if (!role) return;
        if (!roles.find(elem => elem === role)) setIsRedirect(true);
    }, [role]);

    if (!role) return <></>;

    return (
        <>
            {isRedirect
                ? <Redirect to={redirect || '/home/spaces?page=1'} />
                : children
            }
        </>
    )
};
