export const reduceFormData = formData => {
    return Object.keys(formData).reduce((acc, current) => {
        if (
            current === 'isFormValid' ||
            !formData[current].value ||
            (typeof formData[current].value === 'object' && !formData[current].value.value)
        ) {
            return { ...acc };
        } else if (typeof formData[current].value === 'object') {
            return {
                ...acc,
                [current]: formData[current].value.value,
            };
        } else {
            return {
                ...acc,
                [current]: formData[current].value,
            };
        }
    }, {});
};
