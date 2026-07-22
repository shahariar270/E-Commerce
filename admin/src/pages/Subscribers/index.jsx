import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@Component/Table';
import Button from '@Component/Buttons';
import { getSubscribers, deleteSubscriber } from '@Store/slices/subscriberSlice';
import SubHeading from '@Component/SubHeading';
import SEO from '@Component/SEO';
import './styles.scss';

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '-');

const Subscribers = () => {
    const dispatch = useDispatch();
    const { subscribers, loading, error, pagination } = useSelector((state) => state.subscriber);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(getSubscribers({ page: currentPage, limit: pageSize, search: searchQuery }));
    }, [dispatch, currentPage, pageSize, searchQuery]);

    const handleDelete = useCallback((id) => {
        if (window.confirm('Remove this subscriber?')) {
            dispatch(deleteSubscriber(id)).unwrap().catch((err) => console.error('Delete failed:', err));
        }
    }, [dispatch]);

    const columns = [
        {
            key: 'email',
            title: 'Email',
            width: '45%',
        },
        {
            key: 'source',
            title: 'Source',
            width: '20%',
            render: (value) => <span className="badge badge--source">{value}</span>,
        },
        {
            key: 'createdAt',
            title: 'Subscribed',
            width: '20%',
            render: (value) => formatDate(value),
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_, row) => (
                <Button
                    variant="danger"
                    size="small"
                    label="Remove"
                    onClick={() => handleDelete(row._id)}
                />
            ),
        },
    ];

    return (
        <div className="subscribers-page st-page">
            <SEO title="Subscribers" description="Everyone who opted in to get notified about new products and offers." noindex />
            <SubHeading
                title="Subscribers"
                subtitle="Everyone who opted in to get notified about new products and offers."
            />

            {error && <div className="alert alert--error">{error}</div>}
            <Table
                columns={columns}
                data={subscribers}
                loading={loading}
                searchable={true}
                searchPlaceholder="Search by email..."
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                pagination={true}
                currentPage={currentPage}
                pageSize={pageSize}
                total={pagination?.total}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                emptyMessage="No subscribers yet"
            />
        </div>
    );
};

export default Subscribers;
