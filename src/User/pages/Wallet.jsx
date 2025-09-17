import React, { useState, useEffect } from "react";
import { Lock, Check, Gift } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetAllOffersQuery, useRedeemOfferMutation } from "../../utils/apiSlice";
import { useDispatch } from "react-redux";
import { updateWalletBalance } from "../../Slices/authSlice";
import { toast } from "react-toastify";
import { Alert, AlertTitle, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const WalletPage = () => {
    const userAuth = useSelector((state) => state.auth.wallet);
    const dispatch = useDispatch();

    const { walletBalance } = userAuth || {};

    // Fetch offers from API
    const { data: offersData, isLoading, error } = useGetAllOffersQuery();

    // Redeem offer mutation
    const [redeemOffer, { isLoading: isRedeeming }] = useRedeemOfferMutation();

    const [user, setUser] = useState({
        balance: walletBalance,
    });

    // State for scroll position and animations
    const [scrollY, setScrollY] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    // State for MUI Alert Dialog
    const [alertDialog, setAlertDialog] = useState({
        open: false,
        type: 'success', // 'success', 'error', 'warning'
        title: '',
        message: '',
    });

    // Smooth scroll effect
    useEffect(() => {
        let scrollTimeout;

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setIsScrolling(true);

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        // Add smooth scroll behavior to the page
        document.documentElement.style.scrollBehavior = 'smooth';

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    // Update local state when Redux state changes
    useEffect(() => {
        setUser(prevUser => ({
            ...prevUser,
            balance: walletBalance
        }));
    }, [walletBalance]);

    // Close alert dialog
    const handleCloseAlert = () => {
        setAlertDialog({ ...alertDialog, open: false });
    };

    // Show alert dialog
    const showAlert = (type, title, message) => {
        setAlertDialog({
            open: true,
            type,
            title,
            message,
        });
    };

    // Enhanced function to get high-quality Google Drive images
    const convertGoogleDriveUrl = (url) => {
        if (!url) return '';

        // Check if it's a Google Drive share link
        const driveMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (driveMatch) {
            const fileId = driveMatch[1];
            // Use higher quality settings for crystal clear images
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800-h800`;
        }

        // Check if it's already a direct Google Drive link
        if (url.includes('drive.google.com/uc?')) {
            const fileIdMatch = url.match(/id=([a-zA-Z0-9-_]+)/);
            if (fileIdMatch) {
                const fileId = fileIdMatch[1];
                return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800-h800`;
            }
        }

        // Return original URL if not a Google Drive link
        return url;
    };

    const rewards = offersData ? offersData
        .filter(offer => offer.isActive) // Only show active offers
        .map(offer => ({
            id: offer._id,
            title: offer.title,
            subtitle: offer.description,
            requiredOrbits: offer.orbitCost,
            color: "#FF8A65", // Default color, you can make this dynamic if needed
            image: convertGoogleDriveUrl(offer.imageUrl),
            type: "discount",
            createdAt: offer.createdAt
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

    const handleRedeem = async (reward) => {
        if (user.balance >= reward.requiredOrbits) {
            try {
                const response = await redeemOffer({
                    offerId: reward.id
                }).unwrap();

                const newBalance = user.balance - reward.requiredOrbits;

                // Update local state
                setUser(prevUser => ({
                    ...prevUser,
                    balance: newBalance
                }));

                // Update Redux state
                dispatch(updateWalletBalance(newBalance));

                // Show MUI Alert for success
                showAlert(
                    'success',
                    '🎉 Congratulations! 🎉',
                    `You have successfully redeemed "${reward.title}"!\n\nYour new orbit balance: ${newBalance.toLocaleString()}\nRedemption Status: ${response.redemption?.status || 'Pending'}\n\nCheck "My Redemptions" to track the status.`
                );

                // Success response handling with toast
                if (response.message && response.redemption) {
                    toast.success(
                        `Successfully redeemed ${reward.title}! Your redemption is ${response.redemption.status}. Check "My Redemptions" to track the status.`,
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        }
                    );

                    // Log the response for debugging
                    console.log('Redemption response:', response);
                } else {
                    toast.success('Redemption successful!', {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }

            } catch (error) {
                console.error('Redemption failed:', error);

                // Handle different types of errors
                let errorMessage = 'Redemption failed. Please try again later.';

                if (error.data && error.data.message) {
                    errorMessage = `Redemption failed: ${error.data.message}`;
                } else if (error.message) {
                    errorMessage = `Redemption failed: ${error.message}`;
                }

                // Show MUI Alert for error
                showAlert(
                    'error',
                    '❌ Redemption Failed!',
                    errorMessage
                );

                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } else {
            const shortageAmount = reward.requiredOrbits - user.balance;

            // Show MUI Alert for insufficient balance
            showAlert(
                'warning',
                '⚠️ Insufficient Orbits!',
                `You need ${shortageAmount.toLocaleString()} more orbits to redeem "${reward.title}".\n\nCurrent Balance: ${user.balance.toLocaleString()}\nRequired: ${reward.requiredOrbits.toLocaleString()}\n\nPurchase items from Puppy Digital Mart partner stores to earn more orbits!`
            );

            toast.warn(
                `Insufficient orbits! You need ${shortageAmount} more orbits to redeem this offer.`,
                {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        }
    };

    const canRedeem = (requiredOrbits) => user.balance >= requiredOrbits;

    // Enhanced styles with smooth animations and parallax effects
    const containerStyle = {
        backgroundColor: "#f5f5f5",
        padding: "0px 16px",
        minHeight: "100vh",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isScrolling ? 'translateY(-1px)' : 'translateY(0)',
    };

    const headerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
        transform: `translateY(${scrollY * 0.1}px)`,
        transition: "transform 0.1s ease-out",
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
        transform: `translateY(${scrollY * 0.05}px)`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
        transition: "transform 0.3s ease",
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
        animation: "float 3s ease-in-out infinite",
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
        transform: `translateY(${scrollY * 0.08}px)`,
        transition: "transform 0.1s ease-out",
    };

    const rewardsGrid = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "24px",
    };

    const rewardCard = (isRedeemable, index) => ({
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "2px solid",
        borderColor: isRedeemable ? "#e0e0e0" : "#f5f5f5",
        opacity: isRedeemable ? 1 : 0.6,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transform: `translateY(${scrollY * 0.02 * (index + 1)}px)`,
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
        cursor: "pointer",
    });

    // Enhanced image container with better responsiveness
    const rewardImageBox = {
        width: "120px",  // Increased from 90px
        height: "120px", // Increased from 90px
        borderRadius: "16px", // More rounded
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginBottom: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
        }
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
        transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        animation: "progressSlide 1s ease-out",
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
        cursor: isRedeemable && !isRedeeming ? "pointer" : "not-allowed",
        backgroundColor: isRedeemable ? color : "#e0e0e0",
        color: isRedeemable ? "white" : "#999",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isRedeeming ? 0.7 : 1,
        transform: "translateY(0)",
        "&:hover": {
            transform: isRedeemable ? "translateY(-2px)" : "translateY(0)",
            boxShadow: isRedeemable ? "0 4px 12px rgba(0,0,0,0.2)" : "none"
        }
    });

    const tipsCard = {
        backgroundColor: "#E3F2FD",
        border: "1px solid #BBDEFB",
        borderRadius: "12px",
        padding: "16px",
        transform: `translateY(${scrollY * 0.03}px)`,
        transition: "transform 0.1s ease-out",
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

    const loadingStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        fontSize: "16px",
        color: "#666",
    };

    const errorStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        fontSize: "16px",
        color: "#f44336",
        textAlign: "center",
    };

    const noOffersStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        fontSize: "16px",
        color: "#666",
        textAlign: "center",
    };

    // Add CSS animations
    const cssAnimations = `
        <style>
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes progressSlide {
                from { width: 0%; }
                to { width: var(--progress-width, 0%); }
            }
            
            .reward-card:hover {
                transform: translateY(-4px) !important;
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
            }
            
            .reward-image:hover {
                transform: scale(1.1);
            }
            
            .smooth-scroll {
                scroll-behavior: smooth;
            }
            
            * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        </style>
    `;

    // Loading state - show loading if either offers are loading OR if we don't have wallet balance yet
    if (isLoading || walletBalance === undefined || walletBalance === null) {
        return (
            <div style={containerStyle}>
                <div dangerouslySetInnerHTML={{ __html: cssAnimations }} />
                <div style={headerStyle}>
                    <h1 style={headerTitle}>Wallet</h1>
                </div>
                <div style={balanceCard}>
                    <div style={balanceContent}>
                        <div style={balanceIcon}>
                            <div style={orbIcon}>ORB</div>
                        </div>
                        <div style={balanceInfo}>
                            <div style={balanceLabel}>Your Orbits</div>
                            <div style={balanceAmount}>Loading...</div>
                        </div>
                    </div>
                </div>
                <div style={loadingStyle}>Loading offers...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={containerStyle}>
                <div dangerouslySetInnerHTML={{ __html: cssAnimations }} />
                <div style={headerStyle}>
                    <h1 style={headerTitle}>Wallet</h1>
                </div>
                <div style={balanceCard}>
                    <div style={balanceContent}>
                        <div style={balanceIcon}>
                            <div style={orbIcon}>ORB</div>
                        </div>
                        <div style={balanceInfo}>
                            <div style={balanceLabel}>Your Orbits</div>
                            <div style={balanceAmount}>{user.balance?.toLocaleString() || "0"}</div>
                        </div>
                    </div>
                </div>
                <div style={errorStyle}>
                    Failed to load offers. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle} className="smooth-scroll">
            <div dangerouslySetInnerHTML={{ __html: cssAnimations }} />

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
                        <div style={balanceAmount}>{user.balance?.toLocaleString() || "0"}</div>
                    </div>
                </div>
            </div>

            {/* Rewards Section */}
            <div>
                <h2 style={sectionTitle}>Select gift by orbits</h2>

                {rewards.length === 0 ? (
                    <div style={noOffersStyle}>
                        No active offers available at the moment.
                    </div>
                ) : (
                    <div style={rewardsGrid}>
                        {rewards.map((reward, index) => {
                            const isRedeemable = canRedeem(reward.requiredOrbits);
                            const progressPercentage = Math.min((user.balance / reward.requiredOrbits) * 100, 100);

                            // Dynamic color based on progress percentage
                            const getProgressColor = (percentage) => {
                                if (percentage >= 100) return "#4CAF50"; // Green for 100%
                                if (percentage >= 75) return "#FF9800";   // Orange for 75-99%
                                if (percentage >= 50) return "#FFC107";   // Amber for 50-74%
                                if (percentage >= 25) return "#FF5722";   // Deep Orange for 25-49%
                                return "#F44336";                         // Red for 0-24%
                            };

                            const progressColor = getProgressColor(progressPercentage);

                            return (
                                <div
                                    key={reward.id}
                                    style={rewardCard(isRedeemable, index)}
                                    className="reward-card"
                                >
                                    {/* Enhanced Image with better quality */}
                                    <div style={rewardImageBox}>
                                        <img
                                            src={reward.image}
                                            alt={reward.title}
                                            className="reward-image"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                objectPosition: "center",
                                                imageRendering: "optimizeQuality",
                                                WebkitImageSmoothing: "high",
                                                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                filter: "contrast(1.1) saturate(1.1)",
                                                borderRadius: "12px",
                                            }}
                                            loading="lazy"
                                            onError={(e) => {
                                                // Fallback for broken images
                                                e.target.style.display = 'none';
                                                e.target.parentNode.innerHTML = `
                                                    <div style="
                                                        width: 100%; 
                                                        height: 100%; 
                                                        background: linear-gradient(135deg, #FF8A65, #EF5350);
                                                        display: flex;
                                                        align-items: center;
                                                        justify-content: center;
                                                        color: white;
                                                        font-size: 12px;
                                                        font-weight: bold;
                                                        text-align: center;
                                                        border-radius: 12px;
                                                    ">
                                                        ${reward.title}
                                                    </div>
                                                `;
                                            }}
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
                                            <div
                                                style={{
                                                    ...progressFill(progressPercentage, progressColor, isRedeemable),
                                                    '--progress-width': `${Math.min(progressPercentage, 100)}%`
                                                }}
                                            ></div>
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
                                        disabled={!isRedeemable || isRedeeming}
                                    >
                                        {isRedeeming
                                            ? "Redeeming..."
                                            : isRedeemable
                                                ? "Redeem Now"
                                                : `Need ${reward.requiredOrbits - user.balance} more`}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

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

            {/* MUI Alert Dialog */}
            <Dialog
                open={alertDialog.open}
                onClose={handleCloseAlert}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: '16px',
                        padding: '8px'
                    }
                }}
            >
                <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                    {alertDialog.title}
                </DialogTitle>
                <DialogContent>
                    <Alert
                        severity={alertDialog.type}
                        style={{
                            marginBottom: '16px',
                            borderRadius: '12px',
                            fontSize: '14px'
                        }}
                    >
                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                            {alertDialog.message}
                        </div>
                    </Alert>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', paddingBottom: '16px' }}>
                    <Button
                        onClick={handleCloseAlert}
                        variant="contained"
                        style={{
                            backgroundColor: alertDialog.type === 'success' ? '#4CAF50' :
                                alertDialog.type === 'error' ? '#f44336' : '#FF9800',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '8px 24px',
                            textTransform: 'none',
                            fontWeight: '600'
                        }}
                    >
                        Got it!
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default WalletPage;