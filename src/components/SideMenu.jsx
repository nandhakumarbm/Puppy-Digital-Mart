import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";

function SideMenu({ isOpen, onClose }) {
    const navigate = useNavigate();
    const user = getUser();
    // Changed to store only the currently expanded group (single value instead of object)
    const [expandedGroup, setExpandedGroup] = useState(null);

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
            transition: "opacity 0.3s ease, visibility 0.3s ease",
            zIndex: 9999,
        },
        menu: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "75vw",
            maxWidth: "320px",
            minWidth: "280px",
            height: "100%",
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
            paddingBottom: "env(safe-area-inset-bottom, 20px)",
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
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflowY: "auto",
        },
        menuItemsContainer: {
            padding: "4px 0",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
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
            minHeight: "48px",
            WebkitTapHighlightColor: "transparent",
        },
        groupItem: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            color: "#374151",
            background: "none",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "left",
            position: "relative",
            minHeight: "48px",
            WebkitTapHighlightColor: "transparent",
        },
        groupHeader: {
            display: "flex",
            alignItems: "center",
            gap: "14px",
        },
        expandIcon: {
            fontSize: "12px",
            transition: "transform 0.2s ease",
            color: "#6b7280",
        },
        subMenuItem: {
            display: "flex",
            alignItems: "center",
            padding: "10px 20px 10px 54px",
            color: "#6b7280",
            background: "transparent",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "left",
            gap: "12px",
            position: "relative",
            minHeight: "44px",
            WebkitTapHighlightColor: "transparent",
        },
        subMenuContainer: {
            backgroundColor: "#f9fafb",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
        },
        logoutContainer: {
            borderTop: "1px solid #f3f4f6",
            background: "#ffffff",
            flexShrink: 0,
            padding: "16px 0",
            position: "sticky",
            bottom: "env(safe-area-inset-bottom, 0px)",
            zIndex: 2,
        },
        logoutItem: {
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            color: "#dc2626",
            background: "transparent",
            border: "none",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "left",
            gap: "14px",
            minHeight: "48px",
            width: "100%",
            zIndex: 3,
        },
        divider: {
            height: "1px",
            background: "#f3f4f6",
            margin: "2px 20px",
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
    };

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            clearAuth();
            onClose();
            window.location.reload();
        }
    };

    // Updated toggle function to handle single dropdown logic
    const toggleGroup = (groupKey) => {
        setExpandedGroup(prev => {
            // If clicking the same group that's already open, close it
            if (prev === groupKey) {
                return null;
            }
            // Otherwise, open the clicked group (this automatically closes any other open group)
            return groupKey;
        });
    };

    const menuItems = [
        { path: "/user/", icon: "🏠", label: "Home" },
        { path: "/user/profile", icon: "👤", label: "Profile" },
        { path: "/user/wallet", icon: "💳", label: "Orbits & Gifts" },
        { path: "/user/redeem", icon: "🎁", label: "Redemption" },
        { path: "/user/store", icon: "🏪", label: "Collaborators" },
    ];

    const adminMenuStructure = [
        { path: "/admin/", icon: "👥", label: "Users" },
        { path: "/admin/redeemreq", icon: "📋", label: "Redemption Requests" },
        {
            type: "group",
            key: "stores",
            icon: "🏪",
            label: "Manage Stores",
            items: [
                { path: "/admin/createStore", icon: "➕", label: "Create Store" },
                { path: "/admin/EditOrDeleteStore", icon: "✏️", label: "Edit Store" },
            ]
        },
        {
            type: "group",
            key: "media",
            icon: "📱",
            label: "Manage Media",
            items: [
                { path: "/admin/manageAds", icon: "📺", label: "Manage Ads" },
                { path: "/admin/manageOffers", icon: "🛍️", label: "Manage Offers" },
                { path: "/admin/liveCoupons", icon: "🎟️", label: "Manage Coupons" },
            ]
        },
        { path: "/admin/profile", icon: "👤", label: "Profile" },
    ];

    const renderMenuItem = (item, index, isLast) => {
        if (item.type === "group") {
            // Check if this specific group is expanded
            const isExpanded = expandedGroup === item.key;
            return (
                <React.Fragment key={item.key}>
                    <button
                        style={styles.groupItem}
                        onClick={() => toggleGroup(item.key)}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f3f4f6";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                        }}
                    >
                        <div style={styles.activeBorder}></div>
                        <div style={styles.groupHeader}>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                        <span
                            style={{
                                ...styles.expandIcon,
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                            }}
                        >
                            ▼
                        </span>
                    </button>

                    <div
                        style={{
                            ...styles.subMenuContainer,
                            maxHeight: isExpanded ? `${item.items.length * 44}px` : "0px"
                        }}
                    >
                        {item.items.map((subItem, subIndex) => (
                            <button
                                key={subItem.path}
                                style={styles.subMenuItem}
                                onClick={() => handleNavigate(subItem.path)}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#f3f4f6";
                                    e.target.style.color = "#374151";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "transparent";
                                    e.target.style.color = "#6b7280";
                                }}
                            >
                                <div style={styles.activeBorder}></div>
                                <span>{subItem.icon}</span>
                                <span>{subItem.label}</span>
                            </button>
                        ))}
                    </div>

                    {!isLast && <div style={styles.divider} />}
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment key={item.path}>
                    <button
                        style={styles.menuItem}
                        onClick={() => handleNavigate(item.path)}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#f3f4f6";
                            e.target.querySelector('div[style*="width: 0px"]').style.width = "4px";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.querySelector('div[style*="width: 0px"], div[style*="width: 4px"]').style.width = "0px";
                        }}
                    >
                        <div style={styles.activeBorder}></div>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                    {!isLast && <div style={styles.divider} />}
                </React.Fragment>
            );
        }
    };

    const itemsToShow = user?.role === "admin" ? adminMenuStructure : menuItems;

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        };
    }, [isOpen]);

    // Reset expanded group when menu closes
    React.useEffect(() => {
        if (!isOpen) {
            setExpandedGroup(null);
        }
    }, [isOpen]);

    return (
        <>
            <div style={styles.overlay} onClick={onClose} />
            <div style={styles.menu}>
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <p>Puppy Digital Mart</p>
                    </div>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div style={styles.menuContent}>
                    <div style={styles.menuItemsContainer}>
                        {itemsToShow.map((item, index) =>
                            renderMenuItem(item, index, index === itemsToShow.length - 1)
                        )}
                    </div>

                    <div style={styles.logoutContainer}>
                        <button
                            style={styles.logoutItem}
                            onClick={handleLogout}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#fef2f2";
                                e.target.querySelector('div[style*="width: 0px"]').style.width = "4px";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.querySelector('div[style*="width: 0px"], div[style*="width: 4px"]').style.width = "0px";
                            }}
                        >
                            <div style={styles.logoutBorder}></div>
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SideMenu;