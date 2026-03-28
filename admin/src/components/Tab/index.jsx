import { useEffect, useState } from "react";

const Tab = ({
    tabs = [],
    link = false,
}) => {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!link) return;

        const params = new URLSearchParams(window.location.search);
        const tabName = params.get("tab");

        if (tabName) {
            const index = tabs.findIndex(
                (t) => t.label.toLowerCase() === tabName.toLowerCase()
            );

            if (index !== -1) {
                setActiveTab(index);
            }
        }
    }, [link, tabs]);

    const handleTabChange = (index) => {
        setActiveTab(index);

        if (!link) return;

        const params = new URLSearchParams(window.location.search);
        params.set("tab", tabs[index].label.toLowerCase());

        window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${params.toString()}`
        );
    };

    return (
        <div className="tab-component">
            <div className="tab-buttons">
                {tabs.map((tab, index) => (
                    <button
                        className={`tab-button ${activeTab === index ? 'active' : ''}`}
                        key={index}
                        onClick={() => handleTabChange(index)}
                    >
                        {tab?.label}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {tabs[activeTab]?.content}
            </div>
        </div>
    );
};

export default Tab;
