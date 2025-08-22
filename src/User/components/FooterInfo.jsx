import React from "react";

function FooterInfo() {
    const styles = {
        container: {
            marginTop: "60px",
            textAlign: "center",
            fontSize: "13px",
            color: "var(--secondary-text)",
            lineHeight: 1.8,
        },
        icon: {
            marginRight: "6px",
        },
        developer: {
            marginTop: "12px",
            fontSize: "12.5px",
            color: "var(--secondary-text)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        contactRow: {
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
        },
        phoneIcon: {
            marginRight: "4px",
            color: "red",
        },
        name: {
            fontWeight: "500",
        }
    };

    return (
        <div style={styles.container}>
            <div><span style={styles.icon}>🔒</span>Secure redemption process</div>
            <div><span style={styles.icon}>💎</span>Instant rewards to your wallet</div>

            {/* <div style={styles.developer}>
                <div>Developed by</div>
                <div style={styles.contactRow}>
                    <div>
                        <span style={styles.name}>Nandhakumar BM</span> 
                        <span style={styles.phoneIcon}> 📞</span>+91 74181 91606
                    </div>
                    <div>
                        <span style={styles.name}>Akash</span>
                        <span style={styles.phoneIcon}> 📞</span>+91 73055 94291
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default FooterInfo;
