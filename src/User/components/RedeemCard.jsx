import React from "react";

function RedeemCard({ readyToRedeem, handleRedeem }) {
    const styles = {
        card: {
            backgroundColor: "var(--card-background)",
            borderRadius: "20px",
            padding: "30px 20px",
            textAlign: "center",
            maxWidth: "420px",
            margin: "0 auto 20px auto",
            boxShadow: "0px 4px 25px rgba(0,0,0,0.08)",
            border: `1px solid var(--card-border)`,
            color: "var(--primary-text)",
            fontFamily: "var(--font-family)",
        },
        icon: { fontSize: "42px", color: "var(--accent-primary)" },
        title: {
            marginTop: "10px",
            marginBottom: "6px",
            fontSize: "20px",
            fontWeight: "bold",
        },
        subtitle: {
            color: "var(--secondary-text)",
            fontSize: "14px",
            marginBottom: "20px",
        },
        button: (enabled, isHovered) => ({
            width: "100%",
            padding: "18px 16px",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            fontSize: "18px",
            cursor: enabled ? "pointer" : "not-allowed",
            background: enabled
                ? isHovered
                    ? "var(--accent-hover)"
                    : "var(--accent-primary)"
                : "var(--accent-secondary)",
            color: "var(--button-text)",
            opacity: enabled ? 1 : 0.6,
            transition: "background 0.2s ease, transform 0.2s ease",
        }),
    };

    const [hovered, setHovered] = React.useState(false);

    return (
        <div style={styles.card}>
            <div style={styles.icon}>🎁</div>
            <div style={styles.title}>Ready to Redeem</div>
            <div style={styles.subtitle}>
                Please scan QR or enter coupon code first
            </div>
            <button
                style={styles.button(readyToRedeem, hovered)}
                disabled={!readyToRedeem}
                onClick={handleRedeem}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                🎁 Redeem Reward
            </button>
        </div>
    );
}

export default RedeemCard;
