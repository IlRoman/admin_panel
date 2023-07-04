import { isPossiblePhoneNumber, isValidPhoneNumber } from 'react-phone-number-input';

const UPDATE_FORM = "UPDATE_FORM";
const FILL_FORM = "FILL_FORM";
const TO_NULL = 'TO_NULL'

export const updateFormAction = (data) => {
    return {
        type: UPDATE_FORM,
        data,
    }
};

export const fillFormAction = (payload) => {
    return {
        type: FILL_FORM,
        payload,
    }
};

export const toNull = (payload) => {
    return {
        type: TO_NULL,
        payload,
    }
};

export const validateInput = (name, value, validate) => {
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const websiteReg = /^(http|https):/;
    const passwordReg = /(?=.*[-!$%#^&*()_+|~=`{}\[\]:";'<>?,.\/])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    const matterport = /(?:https?:\/\/)?(?:(?:(?:my\.?)?matterport\.com\/show\/\?m=([0-9a-zA-Z]+)+))/;
    function isValidHttpUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    let hasError = false;
    let error = "";

    if (validate === false) return { hasError, error }

    switch (name) {
        case "presentedBy":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "name":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "text":
            if (value?.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }else if (!value){
                hasError = true;
                error = <p>This field is required</p>
            }
            break
        case "username":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "fullname":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "fname":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "lname":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "company":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "jobTitle":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "email":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            } else if (!emailReg.test(String(value).toLowerCase())) {
                hasError = true
                error = <><p>That's not a valid email.</p><p>Try a different email address</p></>
            }
            break
        case "contactEmail":
            if (value && !emailReg.test(String(value).toLowerCase())) {
                hasError = true
                error = <><p>That's not a valid email.</p><p>Try a different email address</p></>
            }
            break
        case "street":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "city":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "zip":
            if (value.trim() === "") {
                hasError = true;
                error = <p>This field is required</p>
            }
            break
        case "website":
            if (value.trim() === "") {
                break
            } else if (!websiteReg.test(String(value).toLowerCase())) {
                hasError = true;
                error = <p>Website must start from http or https</p>
            } else if (!isValidHttpUrl(value)) {
                hasError = true;
                error = <p>Website must be an URL address</p>
            }
            break
        case "externalUrl":
            if (value.trim() === "") {
                break
            } else if (!websiteReg.test(String(value).toLowerCase())) {
                hasError = true;
                error = <p>Website must start from http or https</p>
            } else if (!isValidHttpUrl(value)) {
                hasError = true;
                error = <p>Website must be an URL address</p>
            }
            break
        case "url":
            if (value?.trim() === "") {
                hasError = true;
                error = <p>This field is required</p>
            }else if (!value){
                hasError = true;
                error = <p>This field is required</p>
            } else if (!websiteReg.test(String(value).toLowerCase())) {
                hasError = true;
                error = <p>Website must start from http or https</p>
            } else if (!isValidHttpUrl(value)) {
                hasError = true;
                error = <p>Website must be an URL address</p>
            }
            break
        case "descriptions" :
            if(!value || value?.trim() ===""){
                hasError = true;
                error = <p>This field is required</p>
            } else if(value === "<p></p>\n"){
                hasError = true;
                error = <p>This field is required</p>
            }
            break
        case "matterportUrl":
            if (value.trim() === "") {
                hasError = true;
                error = <p>This field is required</p>
            } else if (!websiteReg.test(String(value).toLowerCase())) {
                hasError = true;
                error = <p>Website must start from http or https</p>
            } else if (!isValidHttpUrl(value)) {
                hasError = true;
                error = <p>Website must be an URL address</p>
            } else if (!matterport.test(String(value).toLowerCase())) {
                hasError = true;
                error = <p>The URL must match a Matterport URL</p>
            }
            break
        case "password":
            if (value.trim() === "") {
                hasError = true;
                error = <p>This field is required</p>
            } else if (!passwordReg.test(String(value))) {
                hasError = true;
                error = <><p>Password must contain 6 - 32 characters</p>
                    <p>should include at least 1 lowercase, 1 uppercase, 1 special symbol, 1 number</p></>
            }
            break
        case "changePassword":
            if(value.trim() === ""){
            }
             else if (!passwordReg.test(String(value))) {
                hasError = true;
                error = <><p>That's not a valid password</p></>
            }
            break
        case "phoneNumber":
            if (!value) {
                hasError = true;
                error = <p>This field is required</p>
            } else if (!isPossiblePhoneNumber(value) || !isValidPhoneNumber(value)) {
                hasError = true;
                error = <p>Incorrect phone number</p>
            }
            break
        case "contactPhone":
            if (value && (!isPossiblePhoneNumber(value) || !isValidPhoneNumber(value))) {
                hasError = true;
                error = <p>Incorrect phone number</p>
            }
            break
        case "confirm":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "title":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        case "address":
            if (value.trim() === "") {
                hasError = true
                error = <p>This field is required</p>
            }
            break
        default:
            break
    }

    return { hasError, error };
};

export const onInputChange = (name, value, dispatch, formState, validate) => {
    const { hasError, error } = validateInput(name, value, validate)
    let isFormValid = true

    for (const key in formState) {
        const item = formState[key]
        // Check if the current field has error
        if (key === name && hasError) {
            isFormValid = false
            break
        } else if (key !== name && item.hasError) {
            // Check if any other field has error
            isFormValid = false
            break
        }
    }

    dispatch(
        updateFormAction({
            name,
            value,
            hasError,
            error,
            touched: false,
            isFormValid,
        })
    )
};

export const onFocusOut = (name, value, dispatch, formState, validate) => {
    const { hasError, error } = validateInput(name, value, validate)
    let isFormValid = true
    for (const key in formState) {
        const item = formState[key]
        if (key === name && hasError) {
            isFormValid = false
            break
        } else if (key !== name && item.hasError) {
            isFormValid = false
            break
        }
    }

    dispatch(
        updateFormAction({
            name, value, hasError, error, touched: true, isFormValid
        })
    )
};

export const validateForm = (formData, dispatch) => {
    let formDataArray = Object.keys(formData);
    let isFormValid = true;

    formDataArray.forEach(elem => {
        if (elem !== 'isFormValid') {
            const { hasError, error } = validateInput(elem, formData[elem].value);
            if (hasError === true) {
                isFormValid = false;
            }
            dispatch({
                type: UPDATE_FORM,
                data: {
                    ...formData[elem],
                    name: elem,
                    hasError,
                    error,
                    touched: true,
                    isFormValid
                },
            })
        }
    })

    return isFormValid;
};

export const formsReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_FORM:
            const { name, value, hasError, error, touched, isFormValid } = action.data
            return {
                ...state,
                // update the state of the particular field,
                // by retaining the state of other fields
                [name]: { ...state[name], value, hasError, error, touched },
                isFormValid,
            }
        case FILL_FORM:
            return {
                ...state,
                ...action.payload,
            }
        case TO_NULL:
            return null
        default:
            return state
    }
};
