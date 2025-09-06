import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";

function SideMenu({ isOpen, onClose }) {
    const navigate = useNavigate();
    const user = getUser();
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
        // Base button style that all menu items inherit
        baseMenuItem: {
            display: "flex",
            alignItems: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            textAlign: "left",
            position: "relative",
            WebkitTapHighlightColor: "transparent",
            width: "100%",
            outline: "none",
        },
        menuItem: {
            padding: "12px 20px",
            color: "#374151",
            fontSize: "16px",
            fontWeight: "500",
            gap: "14px",
            minHeight: "48px",
        },
        groupItem: {
            padding: "12px 20px",
            color: "#374151",
            fontSize: "16px",
            fontWeight: "600",
            minHeight: "48px",
            justifyContent: "space-between",
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
            flexShrink: 0,
        },
        subMenuItem: {
            padding: "10px 20px 10px 54px",
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: "500",
            gap: "12px",
            minHeight: "44px",
        },
        subMenuContainer: {
            backgroundColor: "#f9fafb",
            overflow: "hidden",
            transition: "max-height 0.3s ease-out",
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
            padding: "16px 20px",
            color: "#dc2626",
            fontSize: "16px",
            fontWeight: "500",
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
        // Border indicators
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

    const toggleGroup = (groupKey) => {
        setExpandedGroup(prev => prev === groupKey ? null : groupKey);
    };

    // Enhanced hover handlers
    const handleItemHover = (e, isEntering, borderColor = "#667eea") => {
        const button = e.currentTarget;
        const border = button.querySelector('[data-border]');
        
        if (isEntering) {
            button.style.backgroundColor = "#f3f4f6";
            if (border) {
                border.style.width = "4px";
            }
        } else {
            button.style.backgroundColor = "transparent";
            if (border) {
                border.style.width = "0px";
            }
        }
    };

    const handleSubItemHover = (e, isEntering) => {
        const button = e.currentTarget;
        const border = button.querySelector('[data-border]');
        
        if (isEntering) {
            button.style.backgroundColor = "#f3f4f6";
            button.style.color = "#374151";
            if (border) {
                border.style.width = "4px";
            }
        } else {
            button.style.backgroundColor = "transparent";
            button.style.color = "#6b7280";
            if (border) {
                border.style.width = "0px";
            }
        }
    };

    const handleLogoutHover = (e, isEntering) => {
        const button = e.currentTarget;
        const border = button.querySelector('[data-border]');
        
        if (isEntering) {
            button.style.backgroundColor = "#fef2f2";
            button.style.width = "100%";
            if (border) {
                border.style.width = "4px";
            }
        } else {
            button.style.backgroundColor = "transparent";
            button.style.width = "100%";
            if (border) {
                border.style.width = "0px";
            }
        }
    };

    const menuItems = [
        { path: "/user/", icon: "🏠", label: "Home" },
        { path: "/user/profile", icon: "👤", label: "Profile" },
        { path: "/user/wallet", icon: "💳", label: "Orbits & Gifts" },
        { path: "/user/redeem", icon: "🎁", label: "Redemption" },
        { path: "/user/store", icon: "🏪", label: "Stores" },
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
            const isExpanded = expandedGroup === item.key;
            return (
                <React.Fragment key={item.key}>
                    <button
                        style={{
                            ...styles.baseMenuItem,
                            ...styles.groupItem,
                        }}
                        onClick={() => toggleGroup(item.key)}
                        onMouseEnter={(e) => handleItemHover(e, true)}
                        onMouseLeave={(e) => handleItemHover(e, false)}
                    >
                        <div style={styles.activeBorder} data-border></div>
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
                        {item.items.map((subItem) => (
                            <button
                                key={subItem.path}
                                style={{
                                    ...styles.baseMenuItem,
                                    ...styles.subMenuItem,
                                }}
                                onClick={() => handleNavigate(subItem.path)}
                                onMouseEnter={(e) => handleSubItemHover(e, true)}
                                onMouseLeave={(e) => handleSubItemHover(e, false)}
                            >
                                <div style={styles.activeBorder} data-border></div>
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
                        style={{
                            ...styles.baseMenuItem,
                            ...styles.menuItem,
                        }}
                        onClick={() => handleNavigate(item.path)}
                        onMouseEnter={(e) => handleItemHover(e, true)}
                        onMouseLeave={(e) => handleItemHover(e, false)}
                    >
                        <div style={styles.activeBorder} data-border></div>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                    {!isLast && <div style={styles.divider} />}
                </React.Fragment>
            );
        }
    };

    const itemsToShow = user?.role === "admin" ? adminMenuStructure : menuItems;

    // Body scroll lock effect
    useEffect(() => {
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
    useEffect(() => {
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
                            style={{
                                ...styles.baseMenuItem,
                                ...styles.logoutItem,
                            }}
                            onClick={handleLogout}
                            onMouseEnter={(e) => handleLogoutHover(e, true)}
                            onMouseLeave={(e) => handleLogoutHover(e, false)}
                        >
                            <div style={styles.logoutBorder} data-border></div>
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