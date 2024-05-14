import React from 'react';
import { Pagination } from 'react-bootstrap';

const Paginacao = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
            {pageNumbers.map(number => (
                <Pagination.Item key={number} active={number === currentPage} onClick={(e) => {
                    e.preventDefault();
                    paginate(number);
                }}>
                    {number}
                </Pagination.Item>
            ))}
        </Pagination>
    );
};

export default Paginacao;
