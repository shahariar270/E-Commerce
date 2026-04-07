import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useSelectPagination = (action, selectedValues, extraParams = {}) => {
    const dispatch = useDispatch();
    const [options, setOptions] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const paramsString = JSON.stringify(extraParams);

    const loadData = useCallback(async (currentPage, isFirstLoad = false) => {
        try {
            const res = await dispatch(action({ page: currentPage, ...extraParams }));

            const apiItems = res.payload?.data || [];
            const apiTotalPages = res.payload?.pages || 1;

            setOptions(prevItems => {
                if (isFirstLoad) return apiItems;
                return [...prevItems, ...apiItems];
            });

            if (currentPage >= apiTotalPages) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error) {
            console.error("Pagination Error:", error);
        }
    }, [dispatch, action, paramsString]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        loadData(1, true);
    }, [paramsString, loadData]);

    const handleLoadMore = () => {
        if (hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadData(nextPage);
        }
    };

    const formattedOptions = options.map(opt => ({
        value: opt._id,
        label: opt.title || opt.name,
    }));

    let finalOptions = [...formattedOptions];

    if (selectedValues && Array.isArray(selectedValues)) {
        const missingItems = selectedValues
            .filter(selected => !formattedOptions.some(opt => opt.value === (selected._id || selected.value)))
            .map(item => ({
                value: item._id || item.value,
                label: item.title || item.label || item.name,
            }));

        if (missingItems.length > 0) {
            finalOptions = [...missingItems, ...formattedOptions];
        }
    }

    return {
        options: finalOptions,
        handleLoadMore,
        hasMore
    };
};