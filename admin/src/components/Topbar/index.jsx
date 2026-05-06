import React from "react";
import logo from "../../assets/images/logo.svg";
import Breadcrumb from "../Breadcrumb";

export const Topbar = ({
    leftContent,
    breadcrumb = true,
    rightContent,
}) => {
    return (
        <div className="st-topbar">
            <div className="st-topbar--logo">
                <img src={logo} alt="Logo" />
            </div>

            <div className="st-topbar--left">
                {breadcrumb && (
                    <>
                        <div className="st-topbar--logo__separator"></div>
                        <Breadcrumb />
                    </>
                )}
                {rightContent && (
                    <div className="st-topbar--right">
                        {rightContent}
                    </div>
                )}
            </div>

            {leftContent && <div className="st-topbar--left-custom">{leftContent}</div>}
        </div>
    );
};
