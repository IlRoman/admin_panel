import React, { useEffect } from 'react';
import { CustomDropdown } from '../../components/CustomDropdown/CustomDropdown';
import { CustomInput } from '../../components/CustomInput/CustomInput';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { countries } from '../../helpers/countries';

export const WelcomePage = ({
    handleSubmit,
    onChangeInput,
    formData,
    errors,
    validate
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
                <h5 className="form__welcome-title">Welcome</h5>
                <p className="form__welcome-text">
                    We only need your address and phone contact and you’re ready to start
                </p>
            </div>

            <div className="form__input">
                <CustomInput
                    type="text"
                    placeholder={"Street, Nr"}
                    value={formData.street}
                    onChange={onChangeInput}
                    name="street"
                    error={errors.street}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomInput
                    type="text"
                    placeholder={`Zip`}
                    value={formData.zip}
                    onChange={onChangeInput}
                    name="zip"
                    error={errors.zip}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomInput
                    type="text"
                    placeholder={`City`}
                    value={formData.city}
                    onChange={onChangeInput}
                    name="city"
                    error={errors.city}
                    onBlur={validate}
                />
            </div>

            <div className="form__input">
                <CustomDropdown
                    placeholder="Country"
                    value={formData.country}
                    onChange={onChangeInput}
                    options={countries}
                    variant="grey"
                    name="country"
                    autoComplete="none"
                />
            </div>

            <div className="form__phone-wrapper">
                <div className="form__country-code">
                    <CustomDropdown
                        placeholder="+1"
                        value={formData.country}
                        onChange={onChangeInput}
                        options={countries}
                        variant="grey"
                        name="country_code"
                        autoComplete="none"
                    />
                </div>
                <div className="form__phone">
                    <CustomInput
                        type="text"
                        placeholder={`Phone`}
                        value={formData.phone_number}
                        onChange={onChangeInput}
                        name="phone_number"
                        error={errors.phone_number}
                        onBlur={validate}
                    />
                </div>
            </div>

            <div className="form__button">
                <CustomButton
                    name={"Continue"}
                    onClick={handleSubmit}
                />
            </div>
        </>
    )
};
