import React from 'react';
import { Link } from 'react-router-dom';
import arrow from '../../assets/icons/arrow.svg';
import './breadcrumbs.scss';

export const CustomBreadCrumbs = ({ data }) => {
    return (
        <div className="custom-breadcrumbs">
            {data.map((elem, index) => {
                return (
                    <Link
                        className="custom-breadcrumbs__block"
                        key={index}
                        to={elem.path}
                        style={{ pointerEvents: index + 1 >= data.length ? 'none' : '' }}
                    >
                        <div>{elem.title}</div>
                        {index + 1 < data.length && (
                            <img alt="arrow" src={arrow} className="custom-breadcrumbs__arrow" />
                        )}
                    </Link>
                )
            })}
        </div>
    )
};
