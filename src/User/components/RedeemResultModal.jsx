import React, { useEffect, useRef, useState } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const RedeemResultModal = ({ open, onClose }) => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (open) {
      // Start video playback
      video?.play().catch((err) => console.warn("Video play failed:", err));

      // Reset progress
      setProgress(0);
      const start = Date.now();

      // Start progress loop for 5 seconds
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / 5000) * 100, 100);
        setProgress(Math.round(percent));
      }, 50);
    }

    return () => {
      clearInterval(intervalRef.current);
      setProgress(0);
      video?.pause();
    };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 340,
          bgcolor: "var(--card-background)",
          borderRadius: 3,
          boxShadow: 24,
          p: 3,
          outline: "none",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <video
          ref={videoRef}
          width="100%"
          autoPlay
          muted
          loop
          playsInline
          style={{ borderRadius: "12px", marginBottom: "16px" }}
        >
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
          Your Progress
        </Typography>

        <Box sx={{ width: 120, mx: "auto" }}>
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: "var(--accent-primary)",
              textColor: "var(--primary-text)",
              trailColor: "var(--card-border)",
            })}
          />
        </Box>
      </Box>
    </Modal>
  );
};  

export default RedeemResultModal;
