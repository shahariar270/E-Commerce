import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@Component/Table';
import CouponFormInner from './CouponFormInner';
import { getCoupons, deleteCoupon } from '@Store/slices/couponSlice';
import { showNotification } from '@Store/slices/notificationSlice';
import Button from '@Component/Buttons';
import SubHeading from '@Component/SubHeading';
import './styles.scss';

const Coupons = () => {
    const dispatch = useDispatch();
    const { coupons, loading, error, message, pagination } = useSelector(
        (state) => state.coupon
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalState, setModalState] = useState({ open: false, editId: null });

    useEffect(() => {
        dispatch(getCoupons({ page: currentPage, limit: pageSize }));
    }, [dispatch, currentPage, pageSize]);

    const handleOpenModal = useCallback((id = null) => setModalState({ open: true, editId: id }), []);
    const handleCloseModal = useCallback(() => setModalState({ open: false, editId: null }), []);

    const handleDelete = useCallback((id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            dispatch(deleteCoupon(id))
                .unwrap()
                .catch((err) => console.error('Delete failed:', err));
        }
    }, [dispatch]);

    const handleCopyCode = useCallback((code) => {
        navigator.clipboard.writeText(code)
            .then(() => dispatch(showNotification({ message: `Copied "${code}" to clipboard`, type: 'success' })))
            .catch(() => dispatch(showNotification({ message: 'Failed to copy coupon code', type: 'error' })));
    }, [dispatch]);

    const columns = [
        {
            key: 'code',
            title: 'Code',
            width: '15%',
            render: (value) => (
                <div className="coupon-code-cell">
                    <span>{value}</span>
                    <button
                        type="button"
                        className="coupon-code-copy"
                        onClick={() => handleCopyCode(value)}
                        aria-label="Copy coupon code"
                        title="Copy coupon code"
                    >
                        <span className="st-icon--clipboard" />
                    </button>
                </div>
            ),
        },
        {
            key: 'discount_type',
            title: 'Discount',
            width: '20%',
            render: (value, row) => (
                value === 'percentage'
                    ? `${row.discount_value}%${row.max_discount_amount ? ` (up to $${row.max_discount_amount})` : ''}`
                    : `$${row.discount_value}`
            ),
        },
        {
            key: 'min_purchase_amount',
            title: 'Min. Purchase',
            width: '15%',
            render: (value) => `$${value || 0}`,
        },
        {
            key: 'used_count',
            title: 'Used',
            width: '10%',
            render: (value, row) => `${value || 0}${row.usage_limit ? ` / ${row.usage_limit}` : ''}`,
        },
        {
            key: 'expiry_date',
            title: 'Expires',
            width: '15%',
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'is_active',
            title: 'Status',
            width: '10%',
            render: (value) => (
                <span className={`badge ${value ? 'badge--success' : 'badge--danger'}`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_, row) => (
                <div className="table-actions">
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleOpenModal(row._id)}
                        label='Edit'
                    >
                    </Button>
                    <Button
                        variant="danger"
                        size="small"
                        label=' Delete'
                        onClick={() => handleDelete(row._id)}
                    >
                    </Button>
                </div>
            ),
        },
    ];

    const filteredCoupons = coupons.filter(({ code }) => {
        const q = searchQuery.toLowerCase();
        return code.toLowerCase().includes(q);
    });

    return (
        <div className="coupons-page st-page">

            <SubHeading
                title={"Coupons"}
                subtitle={"Manage discount coupons for your store."}
                rightContent={
                    <Button variant="primary" onClick={() => handleOpenModal()} label='Add New Coupon'>
                    </Button>
                }
            />

            {error && <div className="alert alert--error">{error}</div>}
            {message && <div className="alert alert--success">{message}</div>}
            <Table
                columns={columns}
                data={filteredCoupons}
                loading={loading}
                searchable={true}
                searchPlaceholder="Search coupons..."
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                pagination={true}
                currentPage={currentPage}
                pageSize={pageSize}
                total={pagination?.total}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                emptyMessage="No coupons found"
            />

            {modalState.open && (
                <CouponFormInner
                    id={modalState.editId}
                    handleCloseModal={handleCloseModal}
                />
            )}

        </div>
    );
};

export default Coupons;
