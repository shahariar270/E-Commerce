
import React from 'react';
import './styles.scss';

const SubHeading = ({ title, subtitle, rightContent, leftContent }) => {

    return (
        <div className="st-subHeading">
            {leftContent ?
                <div className="st-subHeading__left">{leftContent}</div> :
                <div className="st-subHeading__left">
                    <h2 className="st-subHeading__title">{title}</h2>
                    {subtitle && <p className="st-subHeading__subtitle">{subtitle}</p>}
                </div>
            }
            {rightContent && <div className="st-subHeading__right">{rightContent}</div>}
        </div>
    )
}


export default SubHeading;