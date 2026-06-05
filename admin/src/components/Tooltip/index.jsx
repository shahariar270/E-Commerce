import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './styles.scss';

const Tooltip = ({ children, content, position = 'top', delay = 200 }) => {
    const [active, setActive] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    let timeout;

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
        timeout = setTimeout(() => {
            setActive(true);
        }, delay);
    };

    const hideTip = () => {
        if (timeout) clearTimeout(timeout);
        setActive(false);
    };

    useEffect(() => {
        if (active) {
            window.addEventListener('scroll', updateCoords);
            window.addEventListener('resize', updateCoords);
        }
        return () => {
            window.removeEventListener('scroll', updateCoords);
            window.removeEventListener('resize', updateCoords);
        };
    }, [active]);

    const getTipStyle = () => {
        if (!coords) return {};

        const style = {
            position: 'absolute',
            zIndex: 9999,
        };

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
                    style={{
                        top: coords.top,
                        left: coords.left,
                        '--trigger-width': `${coords.width}px`,
                        '--trigger-height': `${coords.height}px`
                    }}
                >
                    {content}
                </div>,
                document.body
            )}
        </div>
    );
};

export default Tooltip;
