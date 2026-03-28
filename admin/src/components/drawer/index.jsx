import React from "react"


const Drawer = ({
    isOpen,
    onClose,
    children,
}) => {

    return (
        <>
            <div
                className={`overlay ${isOpen ? "show" : ""}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`drawer ${isOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={onClose}>
                    ✕
                </button>

                {children}
            </div>
        </>
    )
}

export default Drawer;
