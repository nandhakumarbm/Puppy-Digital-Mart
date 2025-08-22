import React from "react";

function SelectAction({ onSelect, qrDisabled = true }) {
    const styles = {
        container: {
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            margin: "30px auto",
            flexWrap: "wrap",
            position: "relative",
        },
        qrCard: {
            position: "relative", 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "160px",
            height: "160px",
            backgroundColor: "var(--card-background)",
            borderRadius: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: qrDisabled ? "not-allowed" : "pointer",
            color: "var(--primary-text)",
            textAlign: "center",
            padding: "10px",
            transition: "transform 0.2s ease, background 0.2s ease",
            border: `1px solid var(--card-border)`,
            opacity: qrDisabled ? 0.5 : 1,
            pointerEvents: qrDisabled ? "none" : "auto",
        },
        card: {
            position: "relative",   // 👈 optional, in case you add overlays later
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "160px",
            height: "160px",
            backgroundColor: "var(--card-background)",
            borderRadius: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
            color: "var(--primary-text)",
            textAlign: "center",
            padding: "10px",
            transition: "transform 0.2s ease, background 0.2s ease",
            border: `1px solid var(--card-border)`,
        },

        icon: { fontSize: "40px" },
        label: { marginTop: "10px", fontSize: "14px" },
        overlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
            color: "white",
            fontSize: "18px",
            fontWeight: "600",
            backdropFilter: "blur(2px)",
            animation: "slideInDiagonal 0.8s ease-out",
            zIndex: 10,
        }
    };

    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInDiagonal {
                0% {
                    transform: translate(-100%, 100%);
                    opacity: 0;
                }
                100% {
                    transform: translate(0, 0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.qrCard} onClick={() => !qrDisabled && onSelect("qr")}>
                <div style={styles.icon}>🔍</div>
                <div style={styles.label}>Scan any QR code</div>
                {qrDisabled && <div style={styles.overlay}>Coming soon...</div>}
            </div>

            <div style={styles.card} onClick={() => onSelect("coupon")}>
                <div style={styles.icon}>🎟️</div>
                <div style={styles.label}>Enter Coupon Code</div>
            </div>

        </div>
    );
}

export default SelectAction;
