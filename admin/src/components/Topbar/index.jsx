import React from "react";
import logo from "../../assets/images/logo.svg";
import Breadcrumb from "../Breadcrumb";
import { NotificationPopover } from "./NotificationPopover";

export const Topbar = ({
    leftContent,
    breadcrumb = true,
    rightContent,
    onMenuToggle
}) => {
    return (
        <div className="st-topbar">
            <button 
                className="st-topbar__menu-toggle"
                onClick={onMenuToggle}
                aria-label="Toggle Menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
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
            </div>

            <div className="st-topbar__actions">
                <NotificationPopover />
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

