import React, { useState, useEffect } from "react";
import { useGetCarouselPosterQuery } from "../../utils/apiSlice";


function ImageCarousel() {
    const { data: adsData, isLoading, error } = useGetCarouselPosterQuery();

    // Extract image URLs from API response, filter for active image ads only
    const images = React.useMemo(() => {
        if (!adsData || !Array.isArray(adsData)) return [];

        return adsData
            .filter(ad => ad.isActive && ad.type === 'image' && ad.mediaUrl)
            .map(ad => ad.mediaUrl);
    }, [adsData]);


    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        // Only start the interval if there are images
        if (images.length > 0) {
            const slideInterval = setInterval(goToNext, 4000);
            return () => clearInterval(slideInterval);
        }
    }, [currentIndex, images.length]);

    // Reset currentIndex if it's out of bounds when images change
    useEffect(() => {
        if (currentIndex >= images.length && images.length > 0) {
            setCurrentIndex(0);
        }
    }, [images.length, currentIndex]);

    const carouselContainer = {
        position: "relative",
        width: "100%",
        maxWidth: "900px",
        margin: "0px auto",
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    };

    const slideStyle = {
        width: "100%",
        height: "230px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: images.length > 0 ? `url(${images[currentIndex]})` : 'none',
        transition: "background-image 0.6s ease-in-out",
        backgroundColor: images.length === 0 ? '#f0f0f0' : 'transparent',
    };

    const arrowStyle = {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(0,0,0,0.5)",
        color: "var(--button-text)",
        border: "none",
        padding: "10px 15px",
        cursor: "pointer",
        borderRadius: "50%",
        fontSize: "20px",
        zIndex: 10,
        transition: "background 0.3s ease",
    };

    const leftArrow = { ...arrowStyle, left: "15px" };
    const rightArrow = { ...arrowStyle, right: "15px" };

    const dotsWrapper = {
        position: "absolute",
        bottom: "15px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "8px",
    };

    const dotStyle = (isActive) => ({
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: isActive ? "var(--accent-primary)" : "rgba(255,255,255,0.6)",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    });

    const loadingStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "230px",
        color: "#666",
        fontSize: "16px",
    };

    // Handle loading state
    if (isLoading) {
        return (
            <div style={carouselContainer}>
                <div style={loadingStyle}>Loading advertisements...</div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div style={carouselContainer}>
                <div style={loadingStyle}>Error loading advertisements</div>
            </div>
        );
    }

    // Handle no images state
    if (images.length === 0) {
        return (
            <div style={carouselContainer}>
                <div style={loadingStyle}>No active advertisements available</div>
            </div>
        );
    }

    return (
        <div style={carouselContainer}>
            <div style={slideStyle}></div>
            {images.length > 1 && (
                <>
                    <button style={leftArrow} onClick={goToPrevious}>‹</button>
                    <button style={rightArrow} onClick={goToNext}>›</button>
                    <div style={dotsWrapper}>
                        {images.map((_, index) => (
                            <div
                                key={index}
                                style={dotStyle(index === currentIndex)}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ImageCarousel;