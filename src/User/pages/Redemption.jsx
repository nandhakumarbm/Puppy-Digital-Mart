import React, { useState } from "react";
import { Clock, AlertCircle, Gift, Calendar, CheckCircle } from "lucide-react";

const Redemption = () => {
  // Mock data for redeemed rewards - in real app, this would come from props/context/API
  const [redemptions] = useState([
    {
      id: 1,
      title: "Soap",
      requiredOrbits: 500,
      color: "#FF8A65",
      image: "https://5.imimg.com/data5/SELLER/Default/2022/11/FC/TD/HH/142168408/hamam-soap-500x500.jpg",
      type: "discount",
      redeemedAt: "2024-08-10T14:30:00Z",
      status: "not_approved",
      redemptionCode: "RDM001"
    },
    {
      id: 2,
      title: "Tooth brush",
      requiredOrbits: 800,
      color: "#EF5350",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiL88k66TSLG1Qt5Ob161uLpF1Y_Opyz7RoyP8OUN8HZ_dNMH3XdwX_jPoebmU20Lp5S4&usqp=CAU",
      type: "offer",
      redeemedAt: "2024-08-09T10:15:00Z",
      status: "not_approved",
      redemptionCode: "RDM002"
    },
  ]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          color: "#4CAF50",
          bgColor: "#E8F5E8",
          icon: CheckCircle
        };
      case "not_approved":
        return {
          label: "Not Approved",
          color: "#FF9800",
          bgColor: "#FFF3E0",
          icon: Clock
        };
      case "rejected":
        return {
          label: "Rejected",
          color: "#F44336",
          bgColor: "#FFEBEE",
          icon: AlertCircle
        };
      default:
        return {
          label: "Pending",
          color: "#9E9E9E",
          bgColor: "#F5F5F5",
          icon: Clock
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "16px",
  };

  const headerStyle = {
    marginBottom: "24px",
  };

  const headerTitle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    margin: "0 0 8px 0",
  };

  const headerSubtitle = {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  };

  const emptyState = {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
  };

  const emptyIcon = {
    fontSize: "64px",
    marginBottom: "16px",
    opacity: 0.5,
  };

  const emptyTitle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#333",
  };

  const emptyDescription = {
    fontSize: "14px",
    lineHeight: "1.5",
  };

  const redemptionCard = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e0e0e0",
  };

  const cardHeader = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "16px",
  };

  const rewardInfo = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    flex: 1,
  };

  const rewardImageContainer = {
    width: "64px",
    height: "64px",
    borderRadius: "12px",
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
    border: "1px solid #e0e0e0",
  };

  const rewardImage = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  const rewardDetails = {
    flex: 1,
  };

  const rewardTitle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 4px 0",
  };

  const rewardSubtitle = {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 8px 0",
  };

  const rewardMeta = {
    fontSize: "12px",
    color: "#999",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const statusBadge = (status) => {
    const config = getStatusConfig(status);
    return {
      backgroundColor: config.bgColor,
      color: config.color,
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      border: `1px solid ${config.color}20`,
    };
  };

  const cardDivider = {
    height: "1px",
    backgroundColor: "#f0f0f0",
    margin: "16px 0",
  };

  const cardFooter = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const redemptionCode = {
    fontSize: "12px",
    color: "#666",
    backgroundColor: "#f5f5f5",
    padding: "4px 8px",
    borderRadius: "6px",
    fontFamily: "monospace",
  };

  const orbitsSpent = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  };

  const orbIcon = {
    width: "16px",
    height: "16px",
    background: "linear-gradient(135deg, #FF8A65, #EF5350)",
    borderRadius: "50%",
  };

  const filterTabs = {
    display: "flex",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "4px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  };

  const filterTab = (isActive) => ({
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: isActive ? "#7E57C2" : "transparent",
    color: isActive ? "white" : "#666",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={headerTitle}>My Redemptions</h1>
        <p style={headerSubtitle}>Track your redeemed rewards and their approval status</p>
      </div>

      {/* Filter Tabs */}
      <div style={filterTabs}>
        <button style={filterTab(true)}>All</button>
        <button style={filterTab(false)}>Pending</button>
        <button style={filterTab(false)}>Approved</button>
      </div>

      {/* Redemptions List */}
      {redemptions.length === 0 ? (
        <div style={emptyState}>
          <div style={emptyIcon}>🎁</div>
          <div style={emptyTitle}>No Redemptions Yet</div>
          <div style={emptyDescription}>
            Start redeeming rewards from your wallet to see them here.<br />
            Your redeemed rewards will be reviewed and approved.
          </div>
        </div>
      ) : (
        <div>
          {redemptions.map((redemption) => {
            const statusConfig = getStatusConfig(redemption.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={redemption.id} style={redemptionCard}>
                {/* Header */}
                <div style={cardHeader}>
                  <div style={rewardInfo}>
                    <div style={rewardImageContainer}>
                      <img
                        src={redemption.image}
                        alt={redemption.title}
                        style={rewardImage}
                      />
                    </div>
                    <div style={rewardDetails}>
                      <h3 style={rewardTitle}>{redemption.title}</h3>
                      <div style={rewardMeta}>
                        <Calendar size={12} />
                        <span>Redeemed on {formatDate(redemption.redeemedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={statusBadge(redemption.status)}>
                    <StatusIcon size={12} />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>

                {/* Divider */}
                <div style={cardDivider}></div>

                {/* Footer */}
                <div style={cardFooter}>
                  <div style={redemptionCode}>
                    Code: {redemption.redemptionCode}
                  </div>
                  <div style={orbitsSpent}>
                    <div style={orbIcon}></div>
                    <span>{redemption.requiredOrbits} Orbits</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      {redemptions.length > 0 && (
        <div style={{
          backgroundColor: "#E3F2FD",
          border: "1px solid #BBDEFB",
          borderRadius: "12px",
          padding: "16px",
          marginTop: "20px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}>
            <div style={{
              backgroundColor: "#2196F3",
              padding: "4px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <AlertCircle size={16} color="white" />
            </div>
            <div>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#1565C0",
                marginBottom: "4px",
              }}>
                Approval Process
              </div>
              <div style={{
                fontSize: "14px",
                color: "#1976D2",
                lineHeight: "1.4",
              }}>
                Your redemptions are being reviewed by our team. You'll be notified once they're approved and ready to use!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Redemption;