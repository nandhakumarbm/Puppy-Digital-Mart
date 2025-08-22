import React, { useState } from "react";
import { Lock, Check, Gift } from "lucide-react";

const WalletPage = () => {
    const [user] = useState({
        balance: 1250,
    });

    const rewards = [
        {
            id: 1,
            title: "Soap",
            subtitle: "On orders above ₹500",
            requiredOrbits: 500,
            color: "#FF8A65",
            image: "https://5.imimg.com/data5/SELLER/Default/2022/11/FC/TD/HH/142168408/hamam-soap-500x500.jpg",
            type: "discount"
        },
        {
            id: 2,
            title: "Tooth brush",
            subtitle: "On selected items",
            requiredOrbits: 800,
            color: "#EF5350",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiL88k66TSLG1Qt5Ob161uLpF1Y_Opyz7RoyP8OUN8HZ_dNMH3XdwX_jPoebmU20Lp5S4&usqp=CAU",
            type: "offer"
        },
        {
            id: 3,
            title: "Blutooth Speaker",
            subtitle: "Up to ₹200",
            requiredOrbits: 1000,
            color: "#26A69A",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkzm330_QXVLpQJnT6jKW3ixSYYI9Vka9t6Q&s",
            type: "cashback"
        },
        {
            id: 4,  
            title: "Paste",
            subtitle: "Surprise gift awaits!",
            requiredOrbits: 1500,
            color: "#7E57C2",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv06DseW8dCGPtlgwZ38P8kOjuogq8XJAHkg&s",
            type: "mystery"
        },
    ];

    const handleRedeem = (reward) => {
        if (user.balance >= reward.requiredOrbits) {
            // Create redemption object with the same structure as the wallet reward
            const redemption = {
                id: reward.id,
                title: reward.title,
                subtitle: reward.subtitle,
                requiredOrbits: reward.requiredOrbits,
                color: reward.color,
                image: reward.image,
                type: reward.type,
                redeemedAt: new Date().toISOString(),
                status: "not_approved",
                redemptionCode: `RDM${String(Date.now()).slice(-6)}`
            };

            // In a real app, you would:
            // 1. Send this to your backend API
            // 2. Update user balance
            // 3. Add to redemptions list
            // 4. Navigate to redemptions page or update state

            alert(`Successfully redeemed ${reward.title}! Check "My Redemptions" to track the approval status.`);

            // For demo purposes, log the redemption object
            console.log('Redemption created:', redemption);
        }
    };

    const canRedeem = (requiredOrbits) => user.balance >= requiredOrbits;

    // Styles
    const containerStyle = {
        backgroundColor: "#f5f5f5",
        padding: "0px 16px",
    };

    const headerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
    };

    const headerTitle = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        margin: 0,
    };

    const balanceCard = {
        background: "linear-gradient(135deg, #7E57C2, #5C6BC0)",
        borderRadius: "20px",
        color: "#fff",
        padding: "24px",
        marginBottom: "32px",
        boxShadow: "0 8px 24px rgba(126, 87, 194, 0.3)",
    };

    const balanceContent = {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    };

    const balanceIcon = {
        width: "64px",
        height: "64px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const orbIcon = {
        width: "48px",
        height: "48px",
        background: "linear-gradient(135deg, #FF8A65, #EF5350)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "12px",
    };

    const balanceInfo = {
        display: "flex",
        flexDirection: "column",
    };

    const balanceLabel = {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: "14px",
        marginBottom: "4px",
    };

    const balanceAmount = {
        fontSize: "32px",
        fontWeight: "bold",
        margin: 0,
    };

    const sectionTitle = {
        fontSize: "20px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "16px",
    };

    const rewardsGrid = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "24px",
    };

    const rewardCard = (isRedeemable) => ({
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "2px solid",
        borderColor: isRedeemable ? "#e0e0e0" : "#f5f5f5",
        opacity: isRedeemable ? 1 : 0.6,
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    });

    const rewardImageBox = {
        width: "90px",
        height: "90px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginBottom: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
    };

    const rewardTitle = {
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "4px",
    };

    const rewardSubtitle = {
        fontSize: "12px",
        color: "#666",
        marginBottom: "10px",
    };

    const requiredInfo = {
        fontSize: "12px",
        fontWeight: "500",
        color: "#666",
        marginBottom: "10px",
    };

    const progressContainer = {
        marginBottom: "12px",
        width: "100%",
    };

    const progressBar = {
        width: "100%",
        height: "8px",
        backgroundColor: "#e0e0e0",
        borderRadius: "4px",
        overflow: "hidden",
    };

    const progressFill = (percentage, color, isRedeemable) => ({
        height: "100%",
        width: `${Math.min(percentage, 100)}%`,
        backgroundColor: color,
        opacity: isRedeemable ? 1 : 0.6,
        transition: "width 0.3s ease",
    });

    const progressInfo = {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "4px",
        fontSize: "12px",
        color: "#666",
    };

    const redeemButton = (isRedeemable, color) => ({
        width: "100%",
        padding: "10px 12px",
        borderRadius: "10px",
        border: "none",
        fontSize: "12px",
        fontWeight: "600",
        cursor: isRedeemable ? "pointer" : "not-allowed",
        backgroundColor: isRedeemable ? color : "#e0e0e0",
        color: isRedeemable ? "white" : "#999",
        transition: "all 0.2s ease",
    });

    const tipsCard = {
        backgroundColor: "#E3F2FD",
        border: "1px solid #BBDEFB",
        borderRadius: "12px",
        padding: "16px",
    };

    const tipsContent = {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
    };

    const tipsIcon = {
        backgroundColor: "#2196F3",
        padding: "4px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const tipsTitle = {
        fontSize: "14px",
        fontWeight: "600",
        color: "#1565C0",
        marginBottom: "4px",
    };

    const tipsDescription = {
        fontSize: "14px",
        color: "#1976D2",
        lineHeight: "1.4",
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h1 style={headerTitle}>Wallet</h1>
            </div>

            {/* Balance Card */}
            <div style={balanceCard}>
                <div style={balanceContent}>
                    <div style={balanceIcon}>
                        <div style={orbIcon}>ORB</div>
                    </div>
                    <div style={balanceInfo}>
                        <div style={balanceLabel}>Your Orbits</div>
                        <div style={balanceAmount}>{user.balance.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Rewards Section */}
            <div>
                <h2 style={sectionTitle}>Redeem Rewards</h2>

                <div style={rewardsGrid}>
                    {rewards.map((reward) => {
                        const isRedeemable = canRedeem(reward.requiredOrbits);
                        const progressPercentage = (user.balance / reward.requiredOrbits) * 100;

                        return (
                            <div key={reward.id} style={rewardCard(isRedeemable)}>
                                {/* Image */}
                                <div style={rewardImageBox}>
                                    <img
                                        src={reward.image}
                                        alt={reward.title}
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                </div>

                                {/* Status */}
                                <div style={{ marginBottom: "8px" }}>
                                    {isRedeemable ? (
                                        <Check size={18} color="green" />
                                    ) : (
                                        <Lock size={18} color="#999" />
                                    )}
                                </div>

                                {/* Content */}
                                <div style={rewardTitle}>{reward.title}</div>
                                <div style={rewardSubtitle}>{reward.subtitle}</div>
                                <div style={requiredInfo}>
                                    Required: {reward.requiredOrbits} Orbits
                                </div>

                                {/* Progress */}
                                <div style={progressContainer}>
                                    <div style={progressBar}>
                                        <div style={progressFill(progressPercentage, reward.color, isRedeemable)}></div>
                                    </div>
                                    <div style={progressInfo}>
                                        <span>{user.balance} / {reward.requiredOrbits}</span>
                                        <span>{Math.round(progressPercentage)}%</span>
                                    </div>
                                </div>

                                {/* Button */}
                                <button
                                    style={redeemButton(isRedeemable, reward.color)}
                                    onClick={() => handleRedeem(reward)}
                                    disabled={!isRedeemable}
                                >
                                    {isRedeemable
                                        ? "Redeem Now"
                                        : `Need ${reward.requiredOrbits - user.balance} more`}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Tips Section */}
                <div style={tipsCard}>
                    <div style={tipsContent}>
                        <div style={tipsIcon}>
                            <Gift size={16} color="white" />
                        </div>
                        <div>
                            <div style={tipsTitle}>How to earn more Orbits?</div>
                            <div style={tipsDescription}>
                                Purchase items from Puppy Digital Mart partner stores and brands to earn more orbits with every transaction!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;