import React from "react";

function Disclaimer() {
    const styles = {
        container: {
            marginTop: "40px",
            padding: "24px",
            backgroundColor: "var(--card-background)",
            color: "var(--secondary-text)",
            borderRadius: "16px",
            border: "1px solid var(--card-border)",
            fontSize: "14px",
            lineHeight: "1.7",
            maxWidth: "850px",
            marginInline: "auto",
            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
        },
        title: {
            fontSize: "18px",
            fontWeight: "600",
            color: "var(--primary-text)",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
        },
        emoji: {
            marginRight: "10px",
            fontSize: "20px",
        },
        section: {
            marginBottom: "14px",
        },
        ul: {
            paddingLeft: "20px",
            marginBottom: "14px",
        },
        li: {
            marginBottom: "8px",
        },
        p: {
            marginBottom: "14px",
        },
        highlight: {
            backgroundColor: "var(--accent-secondary)",
            color: "var(--button-text)",
            padding: "2px 6px",
            borderRadius: "6px",
            fontWeight: "500",
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>
                <span style={styles.emoji}>📜</span> Disclaimer
            </div>

            <div style={styles.section}>
                <ul style={styles.ul}>
                    <li style={styles.li}>
                        The <span style={styles.highlight}>rewards, coins, or points</span> displayed and earned within this application are purely virtual and do not represent real-world money, legal tender, or transferable value.
                    </li>
                    <li style={styles.li}>
                        These rewards are intended only for use within this platform (offers, discounts, in-app benefits). They cannot be withdrawn, exchanged for cash, or transferred outside the application.
                    </li>
                    <li style={styles.li}>
                        This system complies with Indian regulations for digital rewards and does not constitute gambling, betting, or unauthorized transactions.
                    </li>
                </ul>
            </div>

            <p style={styles.p}>By using this application, you acknowledge and agree that:</p>
            <ul style={styles.ul}>
                <li style={styles.li}>Virtual coins/rewards have <span style={styles.highlight}>no cash equivalence</span>.</li>
                <li style={styles.li}>The app owner may modify or terminate the reward system at any time without prior notice.</li>
                <li style={styles.li}>The reward system is built to enhance engagement — no real money payouts are involved.</li>
            </ul>

            <p style={styles.p}>
                For queries about the reward system or its legal aspects, reach us at <span style={styles.highlight}>[your support email]</span>.
            </p>
        </div>
    );
}

export default Disclaimer;
