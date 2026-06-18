import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './styles.scss';

const Tooltip = ({ children, content, position = 'top', delay = 200 }) => {
    const [active, setActive] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const triggerRef = useRef(null);
    const timeoutRef = useRef(null);

    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            });
        }
    };

    const showTip = () => {
        updateCoords();
        timeoutRef.current = setTimeout(() => {
            setActive(true);
        }, delay);
    };

    const hideTip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActive(false);
    };

    useEffect(() => {
        if (active) {
            window.addEventListener('scroll', updateCoords, true);
            window.addEventListener('resize', updateCoords);
        }
        return () => {
            window.removeEventListener('scroll', updateCoords, true);
            window.removeEventListener('resize', updateCoords);
        };
    }, [active]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!content) return <>{children}</>;

    const getTipStyle = () => {
        const style = {
            top: coords.top,
            left: coords.left,
            '--trigger-width': `${coords.width}px`,
            '--trigger-height': `${coords.height}px`
        };

        if (position === 'top') {
            style.left = coords.left + coords.width / 2;
        } else if (position === 'bottom') {
            style.left = coords.left + coords.width / 2;
            style.top = coords.top + coords.height;
        } else if (position === 'left') {
            style.top = coords.top + coords.height / 2;
        } else if (position === 'right') {
            style.left = coords.left + coords.width;
            style.top = coords.top + coords.height / 2;
        }

        return style;
    };

    return (
        <div
            className="st-tooltip-wrapper"
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
            ref={triggerRef}
        >
            {children}
            {active && createPortal(
                <div 
                    className={`st-tooltip-tip ${position}`}
                    style={getTipStyle()}
                >
                    {content}
                </div>,
                document.body
            )}
        </div>
    );
};

export default Tooltip;
