import React from 'react';
import './token-expired-page.scss';
import { Link } from 'react-router-dom';
import logo from '../../assets/icons/logo.png';

export const TokenExpiredPage = () => {
    return (
        <div className="token-expired-page">
            <div className="main-block">
                <div className="logo">
                    <img src={logo} alt="logo" />
                </div>
                <div className="form">
                    <div className="form__head flex-sb">
                        <h4>
                            Time for password recovery has expired
                        </h4>
                    </div>

                    <div className="form__bottom-text">
                        <Link to="/login" className="form__link">
                            <span className="form__arrow">{"<"}</span>
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
};
