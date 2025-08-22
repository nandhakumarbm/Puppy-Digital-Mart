import React, { useState, useEffect } from "react";

function ImageCarousel() {
    const images = [
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1600&q=80"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        const slideInterval = setInterval(goToNext, 4000);
        return () => clearInterval(slideInterval);
    }, [currentIndex]);

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
        backgroundImage: `url(${images[currentIndex]})`,
        transition: "background-image 0.6s ease-in-out",
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

    return (
        <div style={carouselContainer}>
            <div style={slideStyle}></div>
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
        </div>
    );
}

export default ImageCarousel;
