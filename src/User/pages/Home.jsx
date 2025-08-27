import { useState, useMemo, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import { useRedeemCouponMutation, useValidateCouponMutation, useGetAddForRedeemQuery } from "../../utils/apiSlice";
import SectionTitle from "../components/SectionTitle";
import QRScannerCard from "../components/QRScannerCard";
import CouponInputCard from "../components/CouponInputCard";
import RedeemCard from "../components/RedeemCard";
import ImageCarousel from "../components/ImageCarousel";
import SelectAction from "../components/SelectAction";
import Disclaimer from "../components/Disclaimer";
import AdVideoModal from "../components/AdVideoModal";
import { useDispatch } from "react-redux";
import { updateWalletBalance } from "../../Slices/authSlice";
import Modal from "../components/Modal";
import ImprovedDevCredits from "../components/ImprovedDevCredits";

function Home() {
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState("");
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");
    const [modalType, setModalType] = useState("");
    const [showResultModal, setShowResultModal] = useState(false);
    const [showAdVideoModal, setShowAdVideoModal] = useState(false);
    const [qrData, setQrData] = useState("");
    const [pendingRedemption, setPendingRedemption] = useState(null);

    // Alert state management
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

    const dispatch = useDispatch();

    // Get current wallet balance from Redux state
    const userAuth = useSelector((state) => state.auth.wallet);
    const { walletBalance } = userAuth || {};

    // API mutation hooks
    const [redeemCoupon, { isLoading: isRedeeming }] = useRedeemCouponMutation();
    const [validateCoupon, { isLoading: isValidating }] = useValidateCouponMutation();

    // Fetch advertisement data
    const { data: adData, error: adError, isLoading: adLoading } = useGetAddForRedeemQuery();

    const closeModal = () => setModalType("");
    const closeAlert = () => setAlert({ ...alert, open: false });

    const readyToRedeem = useMemo(
        () => Boolean(appliedCoupon || qrData),
        [appliedCoupon, qrData]
    );

    const showAlert = (message, severity = "info", duration = 4000) => {
        setAlert({ open: true, message, severity });
        setTimeout(() => closeAlert(), duration);
    };

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        const v = couponInput.trim();

        // Clear previous messages
        setCouponSuccess("");
        setCouponError("");

        // Basic validation
        if (!v) {
            setCouponError("Coupon required");
            showAlert("Please enter a coupon code", "warning", 3000);
            return;
        }

        if (v.length < 4) {
            setCouponError("Too short");
            showAlert("Coupon code is too short", "warning", 3000);
            return;
        }

        try {
            // Call the validation API to check if coupon is valid
            const response = await validateCoupon({
                code: v.toUpperCase()
            }).unwrap();

            // Check if coupon is valid
            if (response.valid === true) {
                // Coupon is valid - enable redeem button
                setAppliedCoupon(v.toUpperCase());
                setCouponSuccess("Coupon is valid! Ready to redeem.");
                setModalType(""); // Close modal
                showAlert("Coupon is valid! Ready to redeem", "success", 3000);
            } else {
                // Coupon is not valid - show error
                const errorMessage = response.message || "Invalid coupon code";
                setCouponError(errorMessage);
                showAlert(errorMessage, "error", 4000);
            }
        } catch (error) {
            console.error('Coupon validation failed:', error);

            let errorMessage = 'Failed to validate coupon. Please try again.';

            // Handle different types of API errors
            if (error.data && error.data.message) {
                errorMessage = error.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setCouponError(errorMessage);
            showAlert(errorMessage, "error", 4000);
        }
    };

    const handleRedeem = async () => {
        if (!readyToRedeem) return;

        // Get the coupon code from either appliedCoupon or qrData
        const couponCode = appliedCoupon || qrData;

        if (!couponCode) {
            showAlert("No coupon code found to redeem", "error", 3000);
            return;
        }

        // Check if ad data is available
        if (adError) {
            showAlert("Failed to load advertisement. Please try again.", "error", 3000);
            return;
        }

        if (adLoading) {
            showAlert("Loading advertisement...", "info", 2000);
            return;
        }

        if (!adData || !adData.mediaUrl) {
            showAlert("No advertisement available. Please try again later.", "error", 3000);
            return;
        }

        // Store the coupon code for later redemption
        setPendingRedemption(couponCode.toUpperCase());

        // Show the ad video modal
        setShowAdVideoModal(true);
    };

    // This function will be called after the ad video is completed
    const handleAdVideoComplete = async () => {
        setShowAdVideoModal(false);

        if (!pendingRedemption) {
            showAlert("No pending redemption found", "error", 3000);
            return;
        }

        try {
            // Call the API to redeem the coupon
            const response = await redeemCoupon({
                code: pendingRedemption
            }).unwrap();

            // Success handling
            if (response.success || response.message) {
                // Show success message for final redemption
                showAlert("Reward redeemed successfully!", "success", 4000);

                // Reset all coupon-related state variables
                setCouponInput("");
                setAppliedCoupon("");
                setQrData("");
                setCouponSuccess("");
                setCouponError("");
                setPendingRedemption(null);
                setShowResultModal(true);

                // Update wallet balance by adding the earned amount to current balance
                const currentBalance = walletBalance || 0;
                const earnedAmount = response.balance || 0;
                const newBalance = currentBalance + earnedAmount;

                dispatch(updateWalletBalance(newBalance));

                // Log successful redemption
                console.log('Reward redemption successful:', response);
                console.log(`Balance updated: ${currentBalance} + ${earnedAmount} = ${newBalance}`);
            } else {
                showAlert("Failed to redeem reward. Please try again.", "error", 3000);
                setPendingRedemption(null);
            }
        } catch (error) {
            console.error('Reward redemption failed:', error);

            let errorMessage = 'Failed to redeem reward. Please try again.';

            // Handle different types of API errors
            if (error.data && error.data.message) {
                errorMessage = error.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            showAlert(errorMessage, "error", 4000);
            setPendingRedemption(null);
        }
    };

    const handleAdVideoClose = () => {
        setShowAdVideoModal(false);
        setPendingRedemption(null);
        showAlert("Redemption cancelled. Please try again.", "warning", 3000);
    };

    const pageStyle = {
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        color: "var(--primary-text)",
        padding: "10px",
        fontFamily: "var(--font-family)",
        position: "relative",
        bottom: "20px",
    };

    return (
        <div style={pageStyle}>
            <ImageCarousel />
            <SectionTitle
                title="Redeem Your Rewards"
                subtitle="Scan QR codes or enter coupon codes to unlock amazing rewards and earn digital currency"
            />

            <SelectAction onSelect={setModalType} />

            <RedeemCard
                readyToRedeem={readyToRedeem}
                handleRedeem={handleRedeem}
                appliedCoupon={appliedCoupon}
                qrData={qrData}
                isLoading={isRedeeming || adLoading}
            />

            <Modal isOpen={modalType} onClose={closeModal}>
                {modalType === "qr" && (
                    <QRScannerCard qrData={qrData} setQrData={setQrData} />
                )}
                {modalType === "coupon" && (
                    <CouponInputCard
                        couponInput={couponInput}
                        setCouponInput={setCouponInput}
                        handleApplyCoupon={handleApplyCoupon}
                        couponError={couponError}
                        couponSuccess={couponSuccess}
                        isLoading={isRedeeming || isValidating} // Pass both loading states
                    />
                )}
            </Modal>

            <Disclaimer />

            {/* Ad Video Modal */}
            <AdVideoModal
                open={showAdVideoModal}
                onClose={handleAdVideoClose}
                onComplete={handleAdVideoComplete}
                adData={adData}
            />

            {/* MUI Alert Snackbar */}
            <Snackbar
                open={alert.open}
                onClose={closeAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={closeAlert}
                    severity={alert.severity}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
            <ImprovedDevCredits />
        </div>
    );
}

export default Home;