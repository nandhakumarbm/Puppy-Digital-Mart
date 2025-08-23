import React, { useState } from "react";
import Logo from "../assets/PuppyLogo.jpg";
import SideMenu from "./SideMenu";
import { useSelector } from "react-redux";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useSelector((state) => state.auth);

    const headerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    };

    const orbBadge = {
        backgroundColor: "#7E57C2",
        color: "white",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "500",
    };


    const styles = {
        navbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 15px",
            backgroundColor: "white",
            borderRadius: "14px",
            marginBottom: "30px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            color: "#000",
            fontFamily: "var(--font-family)",
        },
        left: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
        },
        logoSection: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
        },
        logo: {
            height: "32px",
            objectFit: "contain",
        },
        menu: {
            fontSize: "24px",
            cursor: "pointer",
            color: "#7c3aed",
        },
        searchIcon: {
            fontSize: "20px",
            cursor: "pointer",
        },
        balanceBox: {
            backgroundColor: "#7c3aed",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
        },
    };


    return (
        <>
            <div style={styles.navbar}>
                <span style={styles.menu} onClick={() => setMenuOpen(true)}>☰</span>
                <div style={styles.left}>
                    <div style={styles.logoSection}>
                        <img src={Logo} alt="Logo" style={styles.logo} />
                    </div>
                </div>

                {
                    user?.phone != "9442828298" && (
                        <div style={headerStyle}>
                            <div style={orbBadge}>
                                ORB {""}
                            </div>
                        </div>
                    )
                }
            </div>
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}

export default Navbar;
