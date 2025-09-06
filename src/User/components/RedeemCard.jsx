import React from "react";

function RedeemCard({ readyToRedeem, handleRedeem, appliedCoupon, qrData, isLoading }) {
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
        couponDisplay: {
            backgroundColor: "var(--accent-primary)",
            color: "var(--button-text)",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "16px",
            fontWeight: "bold",
            letterSpacing: "1px",
            border: "2px solid var(--accent-primary)",
        },
        couponLabel: {
            fontSize: "12px",
            opacity: 0.8,
            marginBottom: "4px",
        },
        couponCode: {
            fontSize: "18px",
            fontWeight: "bold",
        },
        button: (enabled, isHovered, loading) => ({
            width: "100%",
            padding: "18px 16px",
            borderRadius: "12px",
            border: "none",
            fontWeight: "bold",
            fontSize: "18px",
            cursor: enabled && !loading ? "pointer" : "not-allowed",
            background: enabled && !loading
                ? isHovered
                    ? "var(--accent-hover)"
                    : "var(--accent-primary)"
                : "var(--accent-secondary)",
            color: "var(--button-text)",
            opacity: enabled && !loading ? 1 : 0.6,
            transition: "background 0.2s ease, transform 0.2s ease",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
        }),
        loadingSpinner: {
            width: "20px",
            height: "20px",
            border: "2px solid transparent",
            borderTop: "2px solid var(--button-text)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
        }
    };

    const [hovered, setHovered] = React.useState(false);

    // Get the current coupon code (either from manual input or QR scan)
    const currentCoupon = appliedCoupon || qrData;
    const buttonEnabled = readyToRedeem && !isLoading;

    return (
        <>
            {/* Add CSS animation for spinner */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>

            <div style={styles.card}>
                <div style={styles.icon}>🎁</div>
                <div style={styles.title}>Ready to Redeem</div>
                <div style={styles.subtitle}>
                    {currentCoupon
                        ? isLoading
                            ? "Loading advertisement..."
                            : "Click the button below to redeem your reward"
                        : "Please scan QR or enter coupon code first"
                    }
                </div>

                {/* Display applied coupon code */}
                {currentCoupon && (
                    <div style={styles.couponDisplay}>
                        <div style={styles.couponLabel}>Applied Coupon:</div>
                        <div style={styles.couponCode}>{currentCoupon}</div>
                    </div>
                )}

                <button
                    style={styles.button(buttonEnabled, hovered, isLoading)}
                    disabled={!buttonEnabled}
                    onClick={handleRedeem}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {isLoading ? (
                        <>
                            <div style={styles.loadingSpinner}></div>
                            Loading Ad...
                        </>
                    ) : (
                        <>
                            🎁 Redeem Orbits
                        </>
                    )}
                </button>
            </div>
        </>
    );
}

export default RedeemCard;