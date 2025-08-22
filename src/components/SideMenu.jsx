import React from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth";

function SideMenu({ isOpen, onClose }) {
    const navigate = useNavigate();

    const styles = {
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden",
            transition: "opacity 0.3s ease, visibil ity 0.3s ease",
            zIndex: 9999,
            WebkitBackdropFilter: "blur(3px)",
            backdropFilter: "blur(3px)",
        },
        menu: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "75vw",
            maxWidth: "300px",
            minWidth: "260px",
            height: "100vh",
            backgroundColor: "#ffffff",
            boxShadow: "2px 0 20px rgba(0, 0, 0, 0.1)",
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
        },
        header: {
            padding: "20px 16px 16px 16px",
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            position: "sticky",
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "70px",
            zIndex: 1,
            flexShrink: 0,
        },
        logoContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            minWidth: 0,
        },
        logo: {
            height: "32px",
            width: "100%",
            maxWidth: "180px",
            borderRadius: "6px",
            objectFit: "contain",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#fff",
            padding: "4px 8px",
            flexShrink: 0,
        },
        closeBtn: {
            background: "rgba(255, 255, 255, 0.15)",
            border: "none",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            fontSize: "18px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            flexShrink: 0,
            WebkitTapHighlightColor: "transparent",
        },
        menuContent: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0, // Important for proper flexbox behavior
        },
        menuItemsContainer: {
            flex: 1,
            padding: "4px 0 16px 0",
            display: "flex",
            flexDirection: "column",
        },
        menuItem: {
            display: "flex",
            alignItems: "center",
            padding: "12px 20px",
            color: "#374151",
            background: "transparent",
            border: "none",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "left",
            gap: "14px",
            position: "relative",
            margin: "0",
            borderRadius: "0",
            minHeight: "48px",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
        },
        logoutContainer: {
            marginTop: "auto", // This pushes the logout to the bottom
            flexShrink: 0,
        },
        logoutItem: {
            display: "flex",
            alignItems: "center",
            padding: "12px 20px",
            color: "#dc2626",
            background: "transparent",
            border: "none",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "left",
            gap: "14px",
            position: "relative",
            margin: "0",
            borderRadius: "0",
            minHeight: "48px",
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            borderTop: "1px solid #f3f4f6",
            width: "100%",
        },
        menuIcon: {
            fontSize: "22px",
            width: "24px",
            textAlign: "center",
            flexShrink: 0,
            opacity: 0.8,
        },
        menuText: {
            fontSize: "16px",
            fontWeight: "500",
            letterSpacing: "0.2px",
            flex: 1,
            minWidth: 0,
        },
        activeBorder: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "0px",
            background: "#667eea",
            transition: "width 0.2s ease",
        },
        logoutBorder: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "0px",
            background: "#dc2626",
            transition: "width 0.2s ease",
        },
        divider: {
            height: "1px",
            background: "#f3f4f6",
            margin: "2px 20px",
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        // Show confirmation dialog
        const confirmLogout = window.confirm("Are you sure you want to logout?");

        if (confirmLogout) {
            // Clear any stored authentication data
            clearAuth();
            onClose();
            window.location.reload();
        }
    };

    const menuItems = [
        { path: "/", icon: "🏠", label: "Home" },
        { path: "/profile", icon: "👤", label: "Profile" },
        { path: "/wallet", icon: "💰", label: "Wallet" },
        { path: "/redeem", icon: "🎁", label: "Redemption" },
    ];

    const adminMenuItems = [
        { path: "/admin/users", icon: "👥", label: "User Management" },
        { path: "/admin/redeemreq", icon: "📋", label: "Redemption Requests" },
    ];

    // Prevent body scroll when menu is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    return (
        <>
            <div style={styles.overlay} onClick={onClose} />
            <div style={styles.menu}>
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <p>Puppy Digital Mart</p>
                    </div>
                    <button
                        style={styles.closeBtn}
                        onClick={onClose}
                        onTouchStart={(e) => {
                            e.target.style.background = "rgba(255, 255, 255, 0.25)";
                            e.target.style.transform = "scale(0.95)";
                        }}
                        onTouchEnd={(e) => {
                            e.target.style.background = "rgba(255, 255, 255, 0.15)";
                            e.target.style.transform = "scale(1)";
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "rgba(255, 255, 255, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "rgba(255, 255, 255, 0.15)";
                        }}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <div style={styles.menuContent}>
                    {/* Regular menu items container */}
                    <div style={styles.menuItemsContainer}>
                        {menuItems.map((item, index) => (
                            <React.Fragment key={item.path}>
                                <button
                                    style={styles.menuItem}
                                    onClick={() => handleNavigate(item.path)}
                                    onTouchStart={(e) => {
                                        e.currentTarget.style.background = "#f1f5f9";
                                        e.currentTarget.querySelector('.active-border').style.width = "4px";
                                    }}
                                    onTouchEnd={(e) => {
                                        setTimeout(() => {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.querySelector('.active-border').style.width = "0px";
                                        }, 150);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#f8fafc";
                                        e.currentTarget.querySelector('.active-border').style.width = "4px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.querySelector('.active-border').style.width = "0px";
                                    }}
                                    aria-label={`Navigate to ${item.label}`}
                                >
                                    <div className="active-border" style={styles.activeBorder}></div>
                                    <span style={styles.menuIcon}>{item.icon}</span>
                                    <span style={styles.menuText}>{item.label}</span>
                                </button>
                                {index < menuItems.length - 1 && <div style={styles.divider} />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Logout button container - pushed to bottom */}
                    <div style={styles.logoutContainer}>
                        <button
                            style={styles.logoutItem}
                            onClick={handleLogout}
                            onTouchStart={(e) => {
                                e.currentTarget.style.background = "#fef2f2";
                                e.currentTarget.querySelector('.logout-border').style.width = "4px";
                            }}
                            onTouchEnd={(e) => {
                                setTimeout(() => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.querySelector('.logout-border').style.width = "0px";
                                }, 150);
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#fef2f2";
                                e.currentTarget.querySelector('.logout-border').style.width = "4px";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.querySelector('.logout-border').style.width = "0px";
                            }}
                            aria-label="Logout"
                        >
                            <div className="logout-border" style={styles.logoutBorder}></div>
                            <span style={styles.menuIcon}>🚪</span>
                            <span style={styles.menuText}>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SideMenu;