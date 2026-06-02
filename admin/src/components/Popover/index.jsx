import React, { useEffect, useRef, useState } from 'react'

export const Popover = ({ label, children, hoverType = 'button' }) => {
    const [trigger, setTrigger] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setTrigger(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setTrigger(false);
        }, 200); // 200ms delay before closing
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const Wrapper = hoverType === 'button' ? 'button' : 'div';
    return (
        <div
            className='popover-container'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Wrapper className="popover-trigger">
                {label}
            </Wrapper>

            {trigger && (
                <div className="popover">
                    <div className="popover-arrow"></div>
                    <div className="popover-body">{children}</div>
                </div>
            )}
        </div>
    )
}
