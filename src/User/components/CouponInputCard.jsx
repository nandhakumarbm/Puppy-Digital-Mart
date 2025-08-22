import React from "react";

function CouponInputCard({
    couponInput,
    setCouponInput,
    handleApplyCoupon,
    couponError,
    couponSuccess,
}) {
    const styles = {
        card: {
            backgroundColor: "var(--card-background)",
            borderRadius: "16px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            border: `1px solid var(--card-border)`,
            maxWidth: "350px",
            margin: "0 auto",
        },
        icon: { fontSize: "32px", color: "var(--accent-primary)" },
        title: { fontWeight: "bold", margin: "10px 0", fontSize: "18px", color: "var(--primary-text)" },
        subtitle: { fontSize: "14px", color: "var(--secondary-text)", marginBottom: "15px" },
        input: {
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: `1px solid var(--input-border)`,
            backgroundColor: "var(--background)",
            color: "var(--primary-text)",
            fontSize: "14px",
            outline: "none",
            marginBottom: "12px",
            transition: "border-color 0.2s ease",
            fontFamily: "monospace",
        },
        button: (enabled) => ({
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: enabled ? "pointer" : "not-allowed",
            background: enabled ? "var(--accent-primary)" : "var(--accent-secondary)",
            color: "var(--button-text)",
            transition: "all 0.2s ease",
            opacity: enabled ? 1 : 0.6,
        }),
        errorMsg: { marginTop: "8px", fontSize: "13px", color: "#ff4c4c" },
        successMsg: { marginTop: "8px", fontSize: "13px", color: "green" },
        note: { marginTop: "12px", fontSize: "12px", color: "var(--secondary-text)" },
    };

    return (
        <div style={styles.card}>
            <div style={styles.icon}>🎟️</div>
            <div style={styles.title}>Enter Coupon</div>
            <div style={styles.subtitle}>Enter your coupon code below</div>
            <form onSubmit={handleApplyCoupon}>
                <input
                    type="text"
                    placeholder="Enter coupon code..."
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={styles.input}
                />
                <button
                    type="submit"
                    style={styles.button(couponInput.trim().length >= 1)}
                    disabled={!couponInput.trim()}
                >
                    🎟️ Apply Coupon
                </button>
            </form>
            {couponError && <div style={styles.errorMsg}>{couponError}</div>}
            {couponSuccess && <div style={styles.successMsg}>{couponSuccess}</div>}
            <div style={styles.note}>Coupon codes are case-insensitive</div>
        </div>
    );
}

export default CouponInputCard;
