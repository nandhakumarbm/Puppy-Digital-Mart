import React, { useState, useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

function QRScannerCard({ qrData, setQrData }) {
  const [showScanner, setShowScanner] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const codeReaderRef = useRef(null);
  const scanningRef = useRef(false);

  useEffect(() => {
    if (showScanner) {
      startCamera();
    } else {
      stopCamera();
    }

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [showScanner]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);
      scanningRef.current = true;

      console.log("🎥 Starting camera...");

      // Initialize QR code reader
      codeReaderRef.current = new BrowserQRCodeReader();

      // Get available video devices
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
      console.log("📱 Available cameras:", videoInputDevices.length);

      // Use back camera if available, otherwise use first available
      const selectedDeviceId = videoInputDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear')
      )?.deviceId || videoInputDevices[0]?.deviceId;

      if (!selectedDeviceId) {
        throw new Error("No camera found on this device");
      }

      // Request camera access with specific device
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          facingMode: { ideal: "environment" },
          width: { ideal: 640, max: 1920 },
          height: { ideal: 480, max: 1080 },
          frameRate: { ideal: 30 }
        }
      });

      streamRef.current = stream;
      console.log("✅ Camera stream obtained");

      if (videoRef.current && scanningRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });

        await videoRef.current.play();
        console.log("▶️ Video playing, starting QR scan loop...");

        // Start continuous scanning
        startScanningLoop();
      }
    } catch (err) {
      console.error("❌ Camera initialization failed:", err);
      setCameraError(getErrorMessage(err));
      setIsScanning(false);
      scanningRef.current = false;
    }
  };

  const startScanningLoop = async () => {
    if (!codeReaderRef.current || !videoRef.current || !scanningRef.current) {
      return;
    }

    try {
      // Scan for QR code
      const result = await codeReaderRef.current.decodeOnceFromVideoDevice(
        undefined, // Let it use the video element's stream
        videoRef.current
      );

      if (result && result.getText() && scanningRef.current) {
        const qrText = result.getText().trim();
        console.log("🎯 QR Code detected:", qrText);

        // Only process if it's different from last scanned
        if (qrText !== lastScanned) {
          setQrData(qrText);
          setLastScanned(qrText);

          // Success feedback
          console.log("✅ QR Data saved:", qrText);

          // Auto-stop scanning after success (remove these lines for continuous scanning)
          scanningRef.current = false;
          setShowScanner(false);
          setIsScanning(false);
          return;
        }
      }
    } catch (err) {
      // NotFoundException is expected when no QR code is found - this is normal
      if (err.name !== 'NotFoundException') {
        console.warn("⚠️ Scanning error:", err.name, err.message);

        // Only show user-facing errors for serious issues
        if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
          setCameraError(getErrorMessage(err));
          scanningRef.current = false;
          setIsScanning(false);
          return;
        }
      }
    }

    // Continue scanning if still active
    if (scanningRef.current) {
      // Use requestAnimationFrame for better performance, or setTimeout for lower CPU usage
      requestAnimationFrame(startScanningLoop);
      // Alternative: setTimeout(startScanningLoop, 100);
    }
  };

  const stopCamera = () => {
    console.log("🛑 Stopping camera...");
    scanningRef.current = false;

    // Stop QR code reader
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
        console.log("📱 QR reader reset");
      } catch (err) {
        console.warn("Error resetting code reader:", err);
      }
      codeReaderRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`🔇 Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }

    setIsScanning(false);
  };

  const getErrorMessage = (error) => {
    console.error("📛 Camera error:", error.name, error.message);

    switch (error.name) {
      case 'NotAllowedError':
        return 'Camera access denied. Please allow camera permissions in your browser settings and reload the page.';
      case 'NotFoundError':
        return 'No camera found on this device.';
      case 'NotReadableError':
        return 'Camera is being used by another application. Please close other apps using the camera.';
      case 'OverconstrainedError':
        return 'Camera does not support the required settings. Try a different device.';
      case 'SecurityError':
        return 'Camera access blocked. Make sure you\'re using HTTPS or localhost.';
      case 'AbortError':
        return 'Camera access was interrupted.';
      default:
        return error.message || 'Failed to access camera. Please check your device and browser settings.';
    }
  };

  const handleScanClick = () => {
    console.log("🚀 Starting QR scan...");
    setCameraError(null);
    setLastScanned(null);
    setShowScanner(true);
  };

  const handleCloseClick = () => {
    console.log("❌ User closed scanner");
    stopCamera();
    setShowScanner(false);
  };

  const handleRescan = () => {
    console.log("🔄 Rescanning...");
    setQrData(null);
    setLastScanned(null);
    setCameraError(null);
    setShowScanner(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      console.log("📋 Copied to clipboard:", qrData);
      alert("QR data copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback selection method
      const textArea = document.createElement('textarea');
      textArea.value = qrData;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("QR data copied to clipboard!");
    }
  };

  const styles = {
    card: {
      textAlign: "center",
      padding: "24px",
      background: "#ffffff",
      borderRadius: "16px",
      maxWidth: "400px",
      margin: "0 auto",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      color: "#1a202c",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    header: {
      marginBottom: "20px",
    },
    icon: {
      fontSize: "48px",
      marginBottom: "8px",
      display: "block"
    },
    title: {
      margin: "0",
      fontSize: "20px",
      fontWeight: "600",
      color: "#2d3748"
    },
    scanBox: {
      marginTop: "16px",
      border: "2px dashed #8b5cf6",
      borderRadius: "12px",
      minHeight: "120px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#6b7280",
      transition: "all 0.3s ease",
      padding: "20px",
      background: "#fafafb",
      fontSize: "16px",
      fontWeight: "500",
    },
    videoContainer: {
      marginTop: "16px",
      position: "relative",
      display: "inline-block",
    },
    video: {
      width: "100%",
      maxWidth: "320px",
      height: "240px",
      background: "#000",
      borderRadius: "12px",
      objectFit: "cover",
    },
    scanningOverlay: {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      background: "rgba(139, 92, 246, 0.1)",
      border: "2px solid #8b5cf6",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    },
    scanningIndicator: {
      background: "rgba(0, 0, 0, 0.8)",
      color: "white",
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    buttonContainer: {
      marginTop: "16px",
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    button: (variant, isHovered) => ({
      padding: "10px 20px",
      background: variant === 'primary'
        ? (isHovered ? "#7c3aed" : "#8b5cf6")
        : variant === 'secondary'
          ? (isHovered ? "#ef4444" : "#f87171")
          : (isHovered ? "#059669" : "#10b981"),
      border: "none",
      color: "#ffffff",
      fontWeight: "600",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
      minWidth: "100px",
    }),
    errorText: {
      color: "#ef4444",
      fontSize: "14px",
      marginTop: "12px",
      padding: "12px",
      background: "#fef2f2",
      borderRadius: "8px",
      border: "1px solid #fecaca",
    },
    qrResult: {
      background: "#f0f9ff",
      border: "1px solid #bae6fd",
      borderRadius: "8px",
      padding: "16px",
      marginTop: "16px",
      fontSize: "14px",
      color: "#0c4a6e",
      wordBreak: "break-all",
      textAlign: "left",
      maxHeight: "120px",
      overflowY: "auto",
    },
    successHeader: {
      color: "#059669",
      fontWeight: "600",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.icon}>📱</div>
        <h3 style={styles.title}>QR Code Scanner</h3>
      </div>

      {cameraError && (
        <div style={styles.errorText}>
          ⚠️ {cameraError}
        </div>
      )}

      {!showScanner ? (
        <>
          <div style={styles.scanBox} onClick={handleScanClick}>
            {qrData ? (
              <div style={{ width: '100%' }}>
                <div style={styles.successHeader}>
                  ✅ QR Code Scanned Successfully
                </div>
                <div style={styles.qrResult}>
                  {qrData}
                </div>
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.button('primary', false)}
                    onClick={handleRescan}
                  >
                    🔄 Scan Another
                  </button>
                  <button
                    style={styles.button('success', false)}
                    onClick={copyToClipboard}
                  >
                    📋 Copy Data
                  </button>
                </div>
              </div>
            ) : (
              <div>
                📷 Click to Start Scanning
                <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
                  Point your camera at a QR code
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={styles.videoContainer}>
          <video
            ref={videoRef}
            style={styles.video}
            playsInline
            muted
            autoPlay
          />

          {isScanning && (
            <div style={styles.scanningOverlay}>
              <div style={styles.scanningIndicator}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid transparent',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Scanning for QR codes...
              </div>
            </div>
          )}

          <div style={styles.buttonContainer}>
            <button
              style={styles.button('secondary', hovered)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={handleCloseClick}
            >
              ✖️ Stop Scanning
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default QRScannerCard;