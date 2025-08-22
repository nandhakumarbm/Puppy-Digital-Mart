import React, { useEffect } from "react";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const overlay = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease",
    };

    const modalBox = {
        background: "var(--card-background)",
        padding: "20px",
        borderRadius: "12px",
        position: "relative",
        maxWidth: "400px",
        width: "90%",
        color: "var(--primary-text)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        border: `1px solid var(--card-border)`,
        fontFamily: "var(--font-family)",
        animation: "scaleUp 0.3s ease",
    };

    const closeBtn = {
        position: "absolute",
        top: "12px",
        right: "12px",
        background: "var(--accent-primary)",
        border: "none",
        color: "var(--button-text)",
        fontSize: "18px",
        cursor: "pointer",
        borderRadius: "50%",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease, transform 0.2s ease",
    };

    return (
        <div style={overlay} onClick={onClose}>
            <div style={modalBox} onClick={(e) => e.stopPropagation()}>
                <button
                    style={closeBtn}
                    onClick={onClose}
                    onMouseOver={(e) =>
                        (e.target.style.background = "var(--accent-hover)")
                    }
                    onMouseOut={(e) =>
                        (e.target.style.background = "var(--accent-primary)")
                    }
                >
                    ✖
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
