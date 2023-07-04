import React, { useState, useRef } from 'react';
import smallArrow from '../../../assets/icons/small-arrow.png';
import { CustomCheckbox } from '../../../components/CustomCheckbox/CustomCheckbox';
import { useClickOutside } from '../../../hooks/useClickOutside';
import edit from '../../../assets/icons/edit.svg';
import { usersTableHead } from './usersTableHead';

export const UsersTable = ({
    tableData,
    onCheck,
    check,
    setCheck,
    handleDeleteModal,
    handleAddEditModal,
    setOrder,
    setOrderDirection,
    handleModalInvite,
    handleResetPasswordModal,
    handleManageSpacesModal,
    handleManageCollaboratordModal,
    handleTypeModal,
}) => {
    const [hover, setHover] = useState(null);
    const [open, setOpen] = useState(null);
    const ref = useRef();

    useClickOutside(ref, () => {
        if (open) setOpen(false);
    });

    const getDisplay = (id, isEdit) => {
        if (isEdit) {
            if (open === id || hover === id) {
                return 'flex';
            } else {
                return 'none';
            }
        } else {
            const checked = check?.find(item => item === id);
            if (checked || hover === id) {
                return 'flex';
            } else {
                return 'none';
            }
        }
    };

    const onOpen = (id) => {
        if (open) {
            setOpen(null);
        } else {
            setOpen(id);
        }
    };

    const handleSort = order => {
        setOrder(order);
        setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const onDeleteModal = id => {
        setCheck([id]);
        handleDeleteModal();
        setOpen(false);
    };

    return (
        <div className="users-table">
            <div className="users-table__row users-table__def-row">
                {usersTableHead?.map(elem => {
                    if (elem.name === 'Checkbox') {
                        return (
                            <div
                                key={elem.name}
                                className="users-table__cell"
                            >
                                <div>
                                    <CustomCheckbox
                                        onChange={() => onCheck('select all')}
                                        checked={check.length === tableData.length}
                                    />
                                </div>
                            </div>
                        )
                    };

                    return (
                        <div
                            key={elem.name}
                            className="users-table__cell"
                            style={{ width: elem.width || 'auto' }}
                        >
                            <div className="users-table__cell-title">{elem.name}</div>
                            {elem.sortable &&
                                <div
                                    className="users-table__sort"
                                    onClick={() => handleSort(elem.order)}
                                >
                                    <img
                                        className="users-table__arrow-up"
                                        alt="arrow" src={smallArrow}
                                    />
                                    <img
                                        className="users-table__arrow-down"
                                        alt="arrow"
                                        src={smallArrow}
                                    />
                                </div>
                            }
                        </div>
                    );
                })}
            </div>

            <hr style={{ opacity: 0.5 }} />

            {tableData.length
                ? (
                    tableData.map((elem, index) => {
                        return (
                            <div
                                className="users-table__row"
                                key={elem.id || index}
                                onMouseEnter={() => setHover(elem.id, false)}
                                onMouseLeave={() => setHover(null)}
                            >
                                <div className="users-table__cell">
                                    <div style={{
                                        display: getDisplay(elem.id)
                                    }}>
                                        <CustomCheckbox
                                            onChange={() => onCheck(elem.id)}
                                            checked={check.find(item => item === elem.id)}
                                        />
                                    </div>
                                </div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{`${elem.fname} ${elem.lname}`}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.jobTitle}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.company}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.street}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.city}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.zip}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.country}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.email}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.phoneNumber}</span></div>
                                <div
                                    className="users-table__cell"
                                    onClick={() => onOpen(elem.id)}
                                ><span>{elem.type ==='none' ? 'N/A' : elem.type}</span></div>
                                <div className="users-table__cell">
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ display: getDisplay(elem.id, true) }}>
                                            <img
                                                alt="edit" src={edit}
                                                className="users-table__edit"
                                                onClick={() => handleAddEditModal(elem)}
                                            />
                                            <div
                                                className="users-table__dots"
                                                onClick={() => onOpen(elem.id)}
                                            >
                                                <div className="users-table__dot" />
                                                <div className="users-table__dot" />
                                                <div className="users-table__dot" />
                                            </div>
                                        </div>

                                        {open === elem.id && (
                                            <div className="users-table__collapse" ref={ref}>
                                                <div
                                                    className="users-table__collapse-option"
                                                    onClick={() => {
                                                        handleAddEditModal(elem);
                                                        setOpen(false);
                                                    }}
                                                >Edit</div>
                                                <div
                                                    className="users-table__collapse-option"
                                                    onClick={() => {
                                                        handleModalInvite(elem);
                                                        setOpen(false);
                                                    }}
                                                >Invite</div>
                                                <div
                                                    className="users-table__collapse-option"
                                                    onClick={() => {
                                                        handleManageSpacesModal(elem);
                                                        setOpen(false);
                                                    }}
                                                >Manage Spaces</div>
                                                <div
                                                    className="users-table__collapse-option"
                                                    onClick={() => {
                                                        handleManageCollaboratordModal(elem);
                                                        setOpen(false);
                                                    }}
                                                >Manage Collaborators</div>
                                                <div
                                                    className="users-table__collapse-option"
                                                    onClick={() => {
                                                        handleTypeModal(elem);
                                                        setOpen(false);
                                                    }}
                                                >Types</div>
                                                <div
                                                    className="users-table__collapse-option"
                                                    onClick={() => {
                                                        handleResetPasswordModal(elem);
                                                        setOpen(false);
                                                    }}
                                                >Reset Password</div>
                                                <div
                                                    className="users-table__collapse-option"
                                                    onClick={() => {
                                                        onDeleteModal(elem.id);
                                                        setOpen(false);
                                                    }}
                                                >Delete</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )
                : (
                    <div className="users-table__message" >
                        No data
                    </div>
                )
            }
        </div>
    )
};
