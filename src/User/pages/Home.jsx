import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import SectionTitle from "../components/SectionTitle";
import QRScannerCard from "../components/QRScannerCard";
import CouponInputCard from "../components/CouponInputCard";
import RedeemCard from "../components/RedeemCard";
import FooterInfo from "../components/FooterInfo";
import ImageCarousel from "../components/ImageCarousel";
import SelectAction from "../components/SelectAction";
import Disclaimer from "../components/Disclaimer";
import RedeemResultModal from "../components/RedeemResultModal";
import Modal from "../components/Modal";


function Home() {

    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState("");
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");
    const [modalType, setModalType] = useState("");
    const [showResultModal, setShowResultModal] = useState(false);
    const [qrData, setQrData] = useState("");

    const closeModal = () => setModalType("");
    const closeResultModal = () => setShowResultModal(false);

    const readyToRedeem = useMemo(
        () => Boolean(appliedCoupon || qrData),
        [appliedCoupon, qrData]
    );

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const v = couponInput.trim();
        setCouponSuccess("");
        setCouponError("");
        if (!v) return setCouponError("Coupon required");
        if (v.length < 4) return setCouponError("Too short");

        setAppliedCoupon(v.toUpperCase());
        setCouponSuccess("Coupon applied");
        setModalType("");
    };

    const handleRedeem = () => {
        if (!readyToRedeem) return;
        setCouponInput("");
        setAppliedCoupon("");
        setQrData("");
        setCouponSuccess("");
        setShowResultModal(true); // Show modal
    };

    const pageStyle = {
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        color: "var(--primary-text)",
        padding: "10px",
        fontFamily: "var(--font-family)",
        position: "relative",
        bottom: "20px"
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
            />

            <Modal isOpen={modalType} onClose={closeModal}>
                {modalType === "qr" && (
                    <QRScannerCard
                        qrData={qrData}
                        setQrData={setQrData}
                    />
                )}
                {modalType === "coupon" && (
                    <CouponInputCard
                        couponInput={couponInput}
                        setCouponInput={setCouponInput}
                        handleApplyCoupon={handleApplyCoupon}
                        couponError={couponError}
                        couponSuccess={couponSuccess}
                    />
                )}
                {modalType === "coupon-select" && (
                    <CouponModal onClose={closeModal} />
                )}
            </Modal>

            <Disclaimer />
            <FooterInfo />
            <RedeemResultModal open={showResultModal} onClose={closeResultModal} />
        </div>
    );
}

export default Home;
