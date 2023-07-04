import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';
import PaginationItem from '@mui/material/PaginationItem';
import { CustomDropdown } from '../CustomDropdown/CustomDropdown';
import './pagination.scss';

export const RouterPagination = ({ page, setPage, perPage, setPerPage, location, count = 1, simplePagination,disabled }) => {
    const handleChange = (e, value) => {
        setPage(value);
    };

    return (
        <div className="pagination">
          {simplePagination ?
            <Pagination
                count={count}
                page={page}
                onChange={handleChange}
            />
              :
            <Pagination
            count={count}
            page={page}
            onChange={handleChange}
            renderItem={item => (
              <PaginationItem
                component={Link}
                to={`${location}?page=${item.page}`}
                {...item}
              />
            )}
          />}

            <div className="pagination__per-page">
                <div className="pagination__label">Items per page:</div>
                <div className="pagination__dropdown">
                    <CustomDropdown
                        value={perPage.value}
                        onChange={value => setPerPage(value)}
                        options={[
                            { name: '10', value: 10 },
                            { name: '25', value: 25 },
                            { name: '50', value: 50 },
                            { name: '100', value: 100 },
                        ]}
                        disabled={disabled}
                        selectVariant="top"
                    />
                </div>
            </div>
        </div>
    );
};
