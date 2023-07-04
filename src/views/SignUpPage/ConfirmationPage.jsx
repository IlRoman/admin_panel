import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CustomButton } from '../../components/CustomButton/CustomButton';

export const ConfirmationPage = ({
    handleSubmit
}) => {

    useEffect(() => {
        document.onkeydown = (e) => {
            if (e.key === 'Enter') {
                handleSubmit();
            };
        };
    });

    return (
        <>
            <div className="form__welcome">
                {/* need translate */}
                <h5 className="form__welcome-title">Thank you for registering with AKOTRONX Space Manager</h5>
                <p className="form__welcome-text">
                    Please check your inbox and confirm the link in the email we sent you.
                </p>
            </div>

            <div className="form__help-link">
                <Link to="*">
                    <span>Help</span>
                </Link>
            </div>

            <div className="form__button">
                <CustomButton
                    variant="green"
                    name={"Back To Login"}
                    onClick={handleSubmit}
                />
            </div>
        </>
    )
};
