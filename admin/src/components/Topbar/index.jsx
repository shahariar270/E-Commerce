import React from "react";
import logo from "../../assets/images/logo.svg";
import { useQuery } from "@utils/helper";

export const Topbar = ({
    leftContent,
    breadcrumb = true,
    rightContent,
}) => {
    const urlQuery = useQuery();
    const page = urlQuery.get("page") || "dashboard";
    const action = urlQuery.get("action");

    const breadcrumbs = [];
    if (page) breadcrumbs.push(page.charAt(0).toUpperCase() + page.slice(1));
    if (action) breadcrumbs.push(action.charAt(0).toUpperCase() + action.slice(1));

    return (
        <div className="st-topbar">
            <div className="st-topbar--logo">
                <img src={logo} alt="Logo" />
            </div>

            <div className="st-topbar--left">
                {breadcrumb && (
                    <>
                        <div className="st-topbar--logo__separator"></div>

                        <div className="st-topbar--breadcrumb">
                            {breadcrumbs.map((crumb, index) => (
                                <span key={index}>
                                    {crumb}
                                    {index !== breadcrumbs.length - 1 && (
                                        <span className="separator"> / </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </>
                )}
                {rightContent &&
                    (
                        <>{
                            rightContent
                        }</>
                    )
                }
            </div>

            {leftContent && <div className="st-topbar--left-custom">{leftContent}</div>}
        </div>
    );
};
