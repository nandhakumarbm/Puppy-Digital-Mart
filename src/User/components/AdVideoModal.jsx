import React, { useEffect, useRef, useState } from "react";
import { Box, Modal, Typography, IconButton } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Close } from "@mui/icons-material";
import "react-circular-progressbar/dist/styles.css";

const AdVideoModal = ({ open, onClose, onComplete, adData }) => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [actualDuration, setActualDuration] = useState(0);
  const intervalRef = useRef(null);
  const playerRef = useRef(null);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Convert YouTube URL to embed URL with no controls
  const getEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    
    // Use YouTube embed URL with strict parameters to disable all controls
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&playsinline=1&enablejsapi=0`;
  };

  useEffect(() => {
    if (open && adData?.mediaUrl) {
      // Reset states
      setProgress(0);
      setIsVideoCompleted(false);
      setCanClose(false);
      setVideoDuration(0);
      setActualDuration(0);
      
      // Load YouTube Player API for YouTube videos
      const videoId = getYouTubeVideoId(adData.mediaUrl);
      if (videoId && !window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = () => {
          initializeYouTubePlayer(videoId);
        };
      } else if (videoId && window.YT && window.YT.Player) {
        initializeYouTubePlayer(videoId);
      }
    }

    return () => {
      clearInterval(intervalRef.current);
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (error) {
          console.warn('Error destroying YouTube player:', error);
        }
      }
    };
  }, [open, adData]);

  const initializeYouTubePlayer = (videoId) => {
    // Create hidden player to get duration
    const hiddenDiv = document.createElement('div');
    hiddenDiv.id = 'hidden-youtube-player';
    hiddenDiv.style.display = 'none';
    document.body.appendChild(hiddenDiv);

    playerRef.current = new window.YT.Player('hidden-youtube-player', {
      height: '1',
      width: '1',
      videoId: videoId,
      events: {
        'onReady': (event) => {
          const duration = event.target.getDuration();
          setActualDuration(duration * 1000); // Convert to milliseconds
          startProgressTracking(duration * 1000);
          
          // Clean up hidden player
          event.target.destroy();
          document.body.removeChild(hiddenDiv);
        },
        'onError': () => {
          // Fallback to estimated duration if YouTube API fails
          console.warn('YouTube player error, using fallback duration');
          setActualDuration(30000); // 30 seconds fallback
          startProgressTracking(30000);
          
          // Clean up
          document.body.removeChild(hiddenDiv);
        }
      }
    });
  };

  const startProgressTracking = (duration = null) => {
    const videoDuration = duration || actualDuration || 30000; // Use actual duration or fallback to 30 seconds
    const startTime = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / videoDuration) * 100, 100);
      setProgress(Math.round(progressPercent));
      
      if (progressPercent >= 100) {
        setIsVideoCompleted(true);
        setCanClose(true);
        clearInterval(intervalRef.current);
        
        // Auto-complete after reaching 100%
        setTimeout(() => {
          handleComplete();
        }, 1000);
      }
    }, 100); // Update every 100ms for smooth progress
  };

  const handleClose = () => {
    if (canClose || isVideoCompleted) {
      onClose();
    } else {
      // Prevent closing - show alert or just ignore
      console.log("Video must be watched completely");
    }
  };

  // Prevent right-click context menu on video
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Render the video based on URL from database
  const renderVideo = () => {
    if (!adData?.mediaUrl) {
      return (
        <div 
          style={{
            height: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: '12px',
            marginBottom: '16px',
            color: '#666'
          }}
        >
          No advertisement video available
        </div>
      );
    }

    const videoId = getYouTubeVideoId(adData.mediaUrl);
    
    if (videoId) {
      // YouTube video
      const embedUrl = getEmbedUrl(adData.mediaUrl);
      return (
        <div 
          style={{ 
            position: 'relative',
            marginBottom: '16px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          onContextMenu={handleContextMenu}
        >
          <iframe
            width="100%"
            height="250"
            src={embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            style={{ 
              borderRadius: "12px",
              pointerEvents: 'none' // Disable interaction
            }}
          />
          {/* Overlay to prevent interaction */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              cursor: 'not-allowed',
              zIndex: 1
            }}
            onContextMenu={handleContextMenu}
          />
        </div>
      );
    } else {
      // Regular video file URL
      return (
        <div 
          style={{ 
            marginBottom: '16px',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          onContextMenu={handleContextMenu}
        >
          <video
            ref={videoRef}
            width="100%"
            height="250"
            autoPlay
            muted
            loop={false}
            playsInline
            controls={false} // Disable controls
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={handleContextMenu}
            onLoadedMetadata={() => {
              // Get actual video duration for regular video files
              if (videoRef.current && videoRef.current.duration) {
                const duration = videoRef.current.duration * 1000; // Convert to milliseconds
                setActualDuration(duration);
                startProgressTracking(duration);
              } else {
                // Fallback duration if metadata fails to load
                setActualDuration(30000);
                startProgressTracking(30000);
              }
            }}
            onError={() => {
              // Fallback if video fails to load
              console.warn('Video failed to load, using fallback duration');
              setActualDuration(30000);
              startProgressTracking(30000);
            }}
            style={{ 
              borderRadius: "12px",
              pointerEvents: 'none' // Disable interaction
            }}
          >
            <source src={adData.mediaUrl} type="video/mp4" />
            <source src={adData.mediaUrl} type="video/webm" />
            <source src={adData.mediaUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  };

  const handleComplete = () => {
    if (isVideoCompleted) {
      onComplete();
    }
  };

  if (!adData) {
    return null;
  }

  return (
    <Modal 
      open={open} 
      onClose={() => {}} // Disable modal close
      disableEscapeKeyDown={true} // Disable ESC key
      disableBackdropClick={true} // Disable backdrop click
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 350, sm: 450 },
          bgcolor: "var(--card-background)",
          borderRadius: 3,
          boxShadow: 24,
          p: 3,
          outline: "none",
          textAlign: "center",
          fontFamily: "var(--font-family)",
          maxHeight: "90vh",
          overflow: "auto"
        }}
      >
        {/* Close button - only enabled after video completion */}
        <IconButton
          onClick={handleClose}
          disabled={!canClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: canClose ? 'var(--primary-text)' : 'var(--secondary-text)',
            opacity: canClose ? 1 : 0.3,
            '&:disabled': {
              color: 'var(--secondary-text)',
              cursor: 'not-allowed'
            }
          }}
        >
          <Close />
        </IconButton>

        {/* Ad Title */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: 'var(--primary-text)',
            pr: 4 // Add padding to avoid close button
          }}
        >
          {adData.title || "Advertisement"}
        </Typography>

        {/* Ad Description */}
        {adData.description && (
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            {adData.description}
          </Typography>
        )}

        {/* Video Container */}
        {renderVideo()}

        {/* Progress Section */}
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2, 
            fontWeight: 500,
            color: 'var(--primary-text)'
          }}
        >
          Advertisement Progress
        </Typography>

        <Box sx={{ width: 120, mx: "auto", mb: 2 }}>
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: isVideoCompleted ? "#4CAF50" : "var(--accent-primary)",
              textColor: "var(--primary-text)",
              trailColor: "var(--card-border)",
              pathTransitionDuration: 0.5,
            })}
          />
        </Box>

        {/* Status Messages */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: isVideoCompleted ? '#4CAF50' : 'var(--secondary-text)',
            fontWeight: isVideoCompleted ? 600 : 400,
            mb: 1
          }}
        >
          {isVideoCompleted 
            ? "✅ Advertisement completed! You can now proceed..." 
            : "⏳ Please watch the complete advertisement to redeem your reward"
          }
        </Typography>

        {/* Warning message */}
        {!isVideoCompleted && (
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
              mb: 2
            }}
          >
            ⚠️ Video cannot be skipped or paused. Please wait for completion.
          </Typography>
        )}

        {/* Manual Complete Button (only show if video is completed) */}
        {isVideoCompleted && (
          <Box sx={{ mt: 2 }}>
            <button
              onClick={handleComplete}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#45a049";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#4CAF50";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Continue to Redeem 🎁
            </button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AdVideoModal;