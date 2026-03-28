import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <nav style={{ marginBottom: "10px" }}>
            <Link to="/" style={{ color: "blue", textDecoration: "none" }}>
                Home
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
                const isLast = index === pathnames.length - 1;

                return (
                    <span key={index}>
                        {" / "}
                        {isLast ? (
                            <span style={{ textTransform: 'capitalize' }} >{name}</span>
                        ) : (
                            <Link to={routeTo} style={{ color: "blue", textDecoration: "none", textTransform: 'capitalize' }}>
                                {name}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    )
}
