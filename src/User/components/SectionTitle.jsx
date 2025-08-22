import React from "react";

function SectionTitle({ title, subtitle }) {
    const titleStyle = {
        textAlign: "center",
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "8px",
        marginTop: "10px",
        color: "var(--primary-text)",
        position: "relative",
        display: "inline-block",
        paddingBottom: "6px",
        fontFamily: "var(--font-family)",
    };

    const underlineStyle = {
        display: "block",
        width: "60px",
        height: "3px",
        backgroundColor: "var(--accent-primary)",
        margin: "6px auto 0 auto",
        borderRadius: "3px",
    };

    const subtitleStyle = {
        textAlign: "center",
        color: "var(--secondary-text)",
        fontSize: "14px",
        marginBottom: "30px",
        maxWidth: "500px",
        marginInline: "auto",
        lineHeight: "1.5",
        fontFamily: "var(--font-family)",
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2 style={titleStyle}>{title}</h2>
            <div style={underlineStyle}></div>
            <p style={subtitleStyle}>{subtitle}</p>
        </div>
    );
}

export default SectionTitle;
