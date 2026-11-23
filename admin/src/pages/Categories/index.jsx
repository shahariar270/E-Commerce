import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@Component/Table';
import CategoryFormInner from './CategoryFormInner';
import { getCategories, deleteCategory } from '@Store/slices/categorySlice';
import Button from '@Component/Buttons';
import SubHeading from '@Component/SubHeading';
import SEO from '@Component/SEO';

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error, message, pagination } = useSelector(
        (state) => state.category
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalState, setModalState] = useState({ open: false, editId: null });
    const hasInitialFetch = useRef(false);

    useEffect(() => {
        // Skip API call if we already have categories and user hasn't changed pagination/search
        if (hasInitialFetch.current && categories.length > 0 && currentPage === 1 && pageSize === 10 && !searchQuery) {
            return;
        }
        dispatch(getCategories({ page: currentPage, limit: pageSize, search: searchQuery }));
        hasInitialFetch.current = true;
    }, [dispatch, currentPage, pageSize, searchQuery]);

    const handleOpenModal = useCallback((id = null) => setModalState({ open: true, editId: id }), []);
    const handleCloseModal = useCallback(() => setModalState({ open: false, editId: null }), []);

    const handleDelete = useCallback((id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteCategory(id))
                .unwrap()
                .catch((err) => console.error('Delete failed:', err));
        }
    }, [dispatch]);

    const columns = [
        {
            key: 'name',
            title: 'Name',
            width: '30%',
        },
        {
            key: 'slug',
            title: 'Slug',
            width: '30%',
        },
        {
            key: 'is_active',
            title: 'Status',
            width: '15%',
            render: (value) => (
                <span className={`badge ${value ? 'badge--success' : 'badge--danger'}`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '25%',
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

    return (
        <div className="categories-page st-page">
            <SEO title="Categories" description="Manage your product categories." noindex />

            <SubHeading
                title={"Categories"}
                subtitle={"Manage your product categories."}
                rightContent={
                    <Button variant="primary" onClick={() => handleOpenModal()} label='Add New Category'>
                    </Button>
                }
            />

            {error && <div className="alert alert--error">{error}</div>}
            {message && <div className="alert alert--success">{message}</div>}
            <Table
                columns={columns}
                data={categories}
                loading={loading}
                searchable={true}
                searchPlaceholder="Search categories..."
                onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
                searchQuery={searchQuery}
                pagination={true}
                currentPage={currentPage}
                pageSize={pageSize}
                total={pagination?.total}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                emptyMessage="No categories found"
            />

            {/* Create / Edit Modal */}
            {modalState.open && (
                <CategoryFormInner
                    id={modalState.editId}
                    handleCloseModal={handleCloseModal}
                />
            )}

        </div>
    );
};

export default Categories;