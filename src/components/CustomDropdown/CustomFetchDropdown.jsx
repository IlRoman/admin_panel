import React, { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useIsMount } from '../../hooks/useIsMount';
import './dropdown.scss';

export const CustomFetchDropdown = ({
    placeholder,
    name,
    formData,
    value,
    onChange,
    options,
    setOptions,
    variant,
    serch = true,
    autoComplete,
    variantError = 'topright',
    isCancelButton = false,
    fetchOptions,
}) => {
    const ref = useRef();
    const firstRender = useIsMount();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(null);
    const [page, setPage] = useState(1);
    const [canLoad, setCanLoad] = useState(true);
    const [fetching, setFetching] = useState(true);

    useInfiniteScroll(ref, setPage, setFetching, canLoad);

    useClickOutside(ref, () => {
        setSearch(null);
        if (open) {
            setOptions([]);
            setPage(1);
            setOpen(false);
            setTimeout(() => {
                setFetching(true);
                setCanLoad(true);
            }, 200);
        };
    });

    useEffect(() => {
        if (fetching && open) {
            fetchOptions(search, page, setCanLoad, setFetching);
        }
    }, [fetching, open]);

    useEffect(() => {
        if (search !== null && !firstRender) {
            const handler = setTimeout(() => {
                if (fetching) {
                    setPage(1);
                    fetchOptions(search, 1, setCanLoad, setFetching);
                }
            }, 1000);
            return () => clearTimeout(handler);
        }
    }, [search]);

    const handleChange = (elem) => {
        setSearch(null);
        setOptions([]);
        setOpen(false);
        setTimeout(() => {
            setFetching(true);
            setCanLoad(true);
        }, 200)
        setPage(1);
        onChange(elem);
    };

    const handleCancelOption = e => {
        e.stopPropagation();
        setSearch(null);
        setOpen(false);
        setCanLoad(true);
        onChange('');
    };

    const onOpen = () => {
        setOpen(true);
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
                <div className="select" ref={ref}>
                    {options.length
                        ? (
                            options.map(((elem, index) => {
                                return (
                                    <div
                                        key={index}
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
