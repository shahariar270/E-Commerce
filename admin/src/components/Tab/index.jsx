import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * Tab Component - Production-ready tab interface
 */
const Tab = ({
    tabs = [],
    link = false,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    onTabChange,
    defaultIndex = 0,
    className = '',
    id = 'tabs',
}) => {
    const [activeTab, setActiveTab] = useState(() => {
        if (link) {
            const params = new URLSearchParams(window.location.search);
            const tabName = params.get("tab");
            if (tabName) {
                const foundIndex = tabs.findIndex(
                    (t) => t.label?.toLowerCase() === tabName.toLowerCase()
                );
                if (foundIndex !== -1) return foundIndex;
            }
        }
        return defaultIndex;
    });

    const isValidIndex = (index) => index >= 0 && index < tabs.length && !tabs[index]?.disabled;

    const getActiveTab = useCallback((currentIndex) => {
        if (isValidIndex(currentIndex)) return currentIndex;
        for (let i = 0; i < tabs.length; i++) {
            if (isValidIndex(i)) return i;
        }
        return -1;
    }, [tabs]);

    useEffect(() => {
        if (!tabs.length) return;

        if (!isValidIndex(activeTab)) {
            const firstValid = getActiveTab(0);
            if (firstValid !== -1 && firstValid !== activeTab) {
                setActiveTab(firstValid);
            }
        }
    }, [tabs, activeTab, getActiveTab]);

    const updateURL = useCallback((index) => {
        if (!link || !tabs[index]?.label) return;

        const params = new URLSearchParams(window.location.search);
        params.set("tab", tabs[index].label.toLowerCase());

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }, [link, tabs]);

    const handleTabChange = useCallback((index) => {
        if (!isValidIndex(index) || index === activeTab) return;

        setActiveTab(index);
        updateURL(index);

        if (typeof onTabChange === 'function') {
            onTabChange(index, tabs[index]);
        }
    }, [activeTab, onTabChange, tabs, updateURL, isValidIndex]);

    const handleKeyDown = useCallback((e, index) => {
        let newIndex = index;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                do {
                    newIndex = newIndex - 1 < 0 ? tabs.length - 1 : newIndex - 1;
                } while (tabs[newIndex]?.disabled && newIndex !== index);
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                do {
                    newIndex = newIndex + 1 >= tabs.length ? 0 : newIndex + 1;
                } while (tabs[newIndex]?.disabled && newIndex !== index);
                break;
            case 'Home':
                e.preventDefault();
                newIndex = getActiveTab(0);
                break;
            case 'End':
                e.preventDefault();
                for (let i = tabs.length - 1; i >= 0; i--) {
                    if (isValidIndex(i)) {
                        newIndex = i;
                        break;
                    }
                }
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleTabChange(index);
                return;
            default:
                return;
        }

        if (newIndex !== index && isValidIndex(newIndex)) {
            const tabElement = document.getElementById(`${id}-tab-${newIndex}`);
            tabElement?.focus();
            handleTabChange(newIndex);
        }
    }, [tabs, handleTabChange, getActiveTab, isValidIndex, id]);

    if (!tabs.length) {
        return null;
    }

    const activeTabData = tabs[activeTab];

    return (
        <div
            className={`st-tab-component st-tab-${variant} st-tab-${size} ${fullWidth ? 'st-tab-full-width' : ''} ${className}`.trim()}
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${activeTab}`}
        >
            <div
                className="st-tab-buttons"
                role="tablist"
                id={`${id}-list`}
                aria-orientation="horizontal"
            >
                {tabs.map((tab, index) => {
                    const isActive = activeTab === index;
                    const isDisabled = tab.disabled;

                    return (
                        <button
                            key={tab.label || index}
                            id={`${id}-tab-${index}`}
                            className={`st-tab-button ${variant} ${size} ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`.trim()}
                            onClick={() => handleTabChange(index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`${id}-panel`}
                            tabIndex={isActive ? 0 : -1}
                            disabled={isDisabled}
                            type="button"
                        >
                            {tab.icon && <span className="st-tab-icon">{tab.icon}</span>}
                            <span className="st-tab-label">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div
                className="st-tab-content"
                role="tabpanel"
                id={`${id}-content`}
                aria-labelledby={`${id}-tab-${activeTab}`}
            >
                {activeTabData?.content}
            </div>
        </div>
    );
};

Tab.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            content: PropTypes.node.isRequired,
            disabled: PropTypes.bool,
            icon: PropTypes.node,
        })
    ).isRequired,
    link: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'pills', 'underline', 'box']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    fullWidth: PropTypes.bool,
    onTabChange: PropTypes.func,
    defaultIndex: PropTypes.number,
    className: PropTypes.string,
    id: PropTypes.string,
};

Tab.defaultProps = {
    link: false,
    variant: 'default',
    size: 'md',
    fullWidth: false,
    defaultIndex: 0,
    className: '',
    id: 'tabs',
};

export default Tab;
