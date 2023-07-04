import React, { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import './dropdown.scss';

const defaultOptions = [{ name: 'No Options', value: 'No options' }];

export const CustomDropdown = ({
    placeholder,
    name,
    formData,
    value,
    onChange,
    options,
    variant, // grey | white
    serch = true,
    autoComplete,
    disabled = false,
    variantError = 'topright',
    isCancelButton = false,
    selectVariant = 'bottom', // bottom | top
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(null);
    const [currentOptions, setCurrentOptions] = useState([]);
    const ref = useRef();

    useEffect(() => {
        if (options && options.length) {
            if (search) {
                setCurrentOptions(options.filter(elem => elem.name?.includes(search)))
            } else setCurrentOptions(options)
        }
        else setCurrentOptions(defaultOptions)
    }, [options, search]);

    useClickOutside(ref, () => {
        setSearch(null);
        if (open) {
            setOpen(false);
        };
    });

    const handleChange = (elem) => {
        setSearch(null);
        setOpen(false);
        onChange(elem);
    };

    const handleCancelOption = e => {
        e.stopPropagation();
        setSearch(null);
        setOpen(false);
        onChange('');
    };

    const onOpen = () => {
        setOpen(prev => !prev);
    };

    const getValue = () => {
        return value || '';
    };

    const getSearch = () => {
        if (search) return search;
        if (search === null) return getValue();
        if (search === '') return '';
        return getValue();
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const getOptions = () => {
        let arr = [...currentOptions];
        if (selectVariant === 'top') {
            arr = arr.reverse();
        }
        return arr;
    };

    return (
        <div className={`custom-dropdown ${variant}`} >
            <div
                className={`label-container ${formData?.hasError && formData?.touched ? 'label-container_error' : ''}`}
                onClick={onOpen}
                style={{ overflow: `${name === 'country_code' ? 'hidden' : 'visible'}` }}
            >
                {serch
                    ? (
                        <input
                            placeholder={search !== '' ? placeholder : ''}
                            disabled={disabled}
                            type="text"
                            className="label"
                            style={{ color: `${value !== 'No Options' ? '#7D8D9B' : 'black'}` }}
                            value={getSearch() === 'No Options' ? '' : getSearch()}
                            onChange={handleSearch}
                            autoComplete={autoComplete === true ? 'on' : 'none'}
                        />
                    )
                    : (
                        <div className="label">
                            {(!value || value === 'No Options') ? placeholder : value}
                        </div>
                    )
                }
                {isCancelButton && value && <div className='cancel-options' onClick={handleCancelOption}>&#10006;</div>}
                <div className={`arrow ${open ? 'arrow_up' : ''}`}>{'>'}</div>
            </div>

            {open &&
                <div className={`select ${selectVariant}`} ref={ref}>
                    {currentOptions.length
                        ? (
                            getOptions().map((elem => {
                                return (
                                    <div
                                        key={elem.name}
                                        className="select__option"
                                        onClick={() => handleChange(elem)}
                                    >{elem.name}</div>
                                )
                            }))
                        )
                        : (
                            <div
                                className="select__option"
                            >No results</div>
                        )
                    }
                </div>
            }

            {formData?.hasError && formData?.touched && variantError === 'topright' && (
                <div className="custom-dropdown__topright-err">
                    {formData?.error}
                </div>
            )}
        </div>
    )
};
