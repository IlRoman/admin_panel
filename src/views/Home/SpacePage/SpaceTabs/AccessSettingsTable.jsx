import React, { useState, useRef } from 'react';
import smallArrow from '../../../../assets/icons/small-arrow.png';
import { CustomCheckbox } from '../../../../components/CustomCheckbox/CustomCheckbox';
import { useClickOutside } from '../../../../hooks/useClickOutside';
import edit from '../../../../assets/icons/edit.svg';
const usersTableHead = [
  {
    name: 'Full Name',
    sortable: true,
    order: 'fullname'
  },
  {
    name: 'Username',
    sortable: true,
    order: 'username'
  },
  {
    name: 'Email',
    sortable: true,
    order: 'email'
  },
  {
    name: 'Category',
    sortable: false,
  },
  {
    name: '',
    sortable: false,
  },
];

export const AccessSettingsTable = ({
 tableData,
 handleDeleteModal,
 handleAddEditModal,
 setOrder,
 setOrderDirection,
}) => {
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const ref = useRef();

  useClickOutside(ref, () => {
    if (open) setOpen(false);
  });


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


  return (
    <div className="access-table">
      <div className="access-table__row access-table__def-row">
        {usersTableHead?.map(elem => {
          return (
            <div
              key={elem.name}
              className="access-table__cell"
              style={{ width: elem.width || 'auto' }}
            >
              <div className="access-table__cell-title">{elem.name}</div>
              {elem.sortable &&
              <div
                className="access-table__sort"
                onClick={() => handleSort(elem.order)}
              >
                <img
                  className="access-table__arrow-up"
                  alt="arrow" src={smallArrow}
                />
                <img
                  className="access-table__arrow-down"
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
                className="access-table__row"
                key={elem.id || index}
                onMouseEnter={() => setHover(elem.id, false)}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className="access-table__cell"
                  onClick={() => onOpen(elem.id)}
                ><span>{elem.fullname}</span></div>
                <div
                  className="access-table__cell"
                  onClick={() => onOpen(elem.id)}
                ><span>{elem.username}</span></div>
                <div
                  className="access-table__cell"
                  onClick={() => onOpen(elem.id)}
                ><span>{elem.email}</span></div>
                <div
                  className="access-table__cell"
                  onClick={() => onOpen(elem.id)}
                ><span>{elem?.categories?.map(cat => cat.title)?.join(',') || ''}</span></div>
                <div className="access-table__cell">
                  <div style={{ position: 'relative' }}>
                    <div>
                      <div
                        className="access-table__dots"
                        onClick={() => onOpen(elem.id)}
                      >
                        <div className="access-table__dot" />
                        <div className="access-table__dot" />
                        <div className="access-table__dot" />
                      </div>
                    </div>

                    {open === elem.id && (
                      <div className="access-table__collapse" ref={ref}>
                        <div
                          className="access-table__collapse-option"
                          onClick={(e) => {
                            handleAddEditModal(e,elem);
                            setOpen(false);
                          }}
                        >Edit</div>
                        <div
                          className="access-table__collapse-option"
                          onClick={(e) => {
                            handleDeleteModal(e,elem);
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
          <div className="access-table__message" >
            No data
          </div>
        )
      }
    </div>
  )
};
