import React from "react";

function Divider({ label }) {
    const styles = {
        container: {
            margin: "10px auto",
            maxWidth: "420px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
        },
        line: {
            flex: 1,
            height: "1px",
            background: "var(--card-border)",
        },
        labelBox: {
            padding: "2px 12px",
            fontSize: "12px",
            backgroundColor: "var(--card-background)",
            borderRadius: "12px",
            border: `1px solid var(--card-border)`,
            color: "var(--secondary-text)",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.line} />
            <div style={styles.labelBox}>{label}</div>
            <div style={styles.line} />
        </div>
    );
}

export default Divider;
