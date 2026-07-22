import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@Component/Table';
import { getCustomers } from '@Store/slices/customerSlice';
import SubHeading from '@Component/SubHeading';
import SEO from '@Component/SEO';
import './styles.scss';

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-');
const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const Customers = () => {
    const dispatch = useDispatch();
    const { customers, loading, error, pagination } = useSelector((state) => state.customer);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(getCustomers({ page: currentPage, limit: pageSize, search: searchQuery }));
    }, [dispatch, currentPage, pageSize, searchQuery]);

    const columns = [
        {
            key: 'first_name',
            title: 'Customer',
            width: '30%',
            render: (_, row) => {
                const name = `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.user_name;
                const initial = name?.trim()?.charAt(0)?.toUpperCase() || '?';
                return (
                    <div className="customer-cell">
                        <div className="customer-cell__avatar">{initial}</div>
                        <div>
                            <div className="customer-cell__name">{name}</div>
                            <div className="customer-cell__email">{row.email}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'user_role',
            title: 'Role',
            width: '12%',
            render: (value) => (
                <span className={`badge badge--role-${value}`}>{value}</span>
            ),
        },
        {
            key: 'order_count',
            title: 'Orders',
            width: '12%',
            render: (value) => value || 0,
        },
        {
            key: 'total_spent',
            title: 'Total Spent',
            width: '15%',
            render: (value) => formatMoney(value),
        },
        {
            key: 'createdAt',
            title: 'Joined',
            width: '15%',
            render: (value) => formatDate(value),
        },
    ];

    return (
        <div className="customers-page st-page">
            <SEO title="Customers" description="View everyone registered on your store." noindex />
            <SubHeading
                title="Customers"
                subtitle="Everyone registered on your store, with their order history at a glance."
            />

            {error && <div className="alert alert--error">{error}</div>}
            <Table
                columns={columns}
                data={customers}
                loading={loading}
                searchable={true}
                searchPlaceholder="Search by name or email..."
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                pagination={true}
                currentPage={currentPage}
                pageSize={pageSize}
                total={pagination?.total}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                emptyMessage="No customers found"
            />
        </div>
    );
};

export default Customers;
