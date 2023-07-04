import React from 'react';

export const validateStep1 = (formData, setErrors) => {
    let isValid = true;

    if (!formData.first_name) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                first_name: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    if (!formData.last_name) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                last_name: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(formData.email).toLowerCase())) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                email: {
                    message: <><p>That's not a valid email.</p><p>Try a different email address</p></>,
                    isError: true,
                }
            }
        })
    }

    if (!formData.email) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                email: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    if (!formData.company) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                company: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    if (!formData.password) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                password: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    const re1 = /(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!re1.test(formData.password)) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                password: {
                    message: <><p>Password should include at least 1 lowercase, </p><p>1 uppercase letter, 1 special symbol, 1 number</p></>,
                    isError: true,
                }
            }
        })
    }

    if (formData.password.length < 6 || formData.password.length > 32) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                password: {
                    message: 'Password must be between 6 and 32 characters long',
                    isError: true,
                }
            }
        })
    }

    if (!formData.validate_password) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                validate_password: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    if (formData.validate_password !== formData.password) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                validate_password: {
                    // need fix
                    message: 'Incorrect password',
                    isError: true,
                }
            }
        })
    }

    return isValid;
};

export const validateStep2 = (formData, setErrors) => {
    let isValid = true;

    if (!formData.street) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                street: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    if (!formData.zip) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                zip: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    if (!formData.city) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                city: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    if (!formData.country) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                country: {
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    if (!formData.phone_number) {
        isValid = false;
        setErrors(prev => {
            return {
                ...prev,
                phone_number: {
                    // need fix
                    message: 'This field is required',
                    isError: true,
                }
            }
        })
    }

    return isValid;
};
