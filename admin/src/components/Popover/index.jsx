import React, { useEffect, useRef, useState } from 'react'

export const Popover = ({ label, children, hoverType = 'button' }) => {
    const [trigger, setTrigger] = useState(false);
    const Wrapper = hoverType === 'button' ? 'button' : 'div';
    console.log(label);
    return (
        <div
            className='popover-container'
            onMouseEnter={() => { setTrigger(true) }}
            onMouseLeave={() => setTrigger(false)}
        >
            <Wrapper>
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
