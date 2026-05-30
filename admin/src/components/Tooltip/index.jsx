import React, { useState } from 'react';
import './styles.scss';

const Tooltip = ({ children, content, position = 'top', delay = 200 }) => {
    const [active, setActive] = useState(false);
    let timeout;

    const showTip = () => {
        timeout = setTimeout(() => {
            setActive(true);
        }, delay);
    };

    const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
    };

    return (
        <div
            className="st-tooltip-wrapper"
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
        >
            {children}
            {active && (
                <div className={`st-tooltip-tip ${position}`}>
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
