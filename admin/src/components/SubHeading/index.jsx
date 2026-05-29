

const SubHeading = ({ title, subtitle, rightContent }) => {

    return (
        <div className="st-subHeading">
            <div className="st-subHeading__left">
                <h2 className="st-subHeading__title">{title}</h2>
                {subtitle && <p className="st-subHeading__subtitle">{subtitle}</p>}
            </div>
            {rightContent && <div className="st-subHeading__right">{rightContent}</div>}
        </div>
    )
}


export default SubHeading;