import React, { useState } from 'react';

const LocationCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const shopAddress = "Puppy mobile shop, paramathy bus stop, Namakkal, Tamil Nadu 637207"; 
  const googleMapsLink = "https://maps.app.goo.gl/jcmVo8X7YmCiMadi6";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const cardStyle = {
    background: 'var(--card-background)',
    borderRadius: '16px',
    border: '1px solid var(--card-border)',
    padding: '40px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isHovered 
      ? '0 20px 40px -8px rgba(31, 41, 55, 0.15), 0 8px 16px -4px rgba(31, 41, 55, 0.1)' 
      : '0 4px 16px -2px rgba(31, 41, 55, 0.08), 0 2px 8px -1px rgba(31, 41, 55, 0.06)',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerSectionStyle = {
    borderBottom: '2px solid var(--card-border)',
    paddingBottom: '24px',
    marginBottom: '32px',
    position: 'relative'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--primary-text)',
    marginBottom: '8px',
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: 'var(--secondary-text)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const iconStyle = {
    width: '32px',
    height: '32px',
    padding: '8px',
    background: 'var(--accent-primary)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const addressSectionStyle = {
    marginBottom: '32px'
  };

  const addressLabelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--secondary-text)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '12px'
  };

  const addressStyle = {
    fontSize: '16px',
    color: 'var(--primary-text)',
    lineHeight: '1.6',
    fontWeight: '500',
    padding: '20px',
    background: 'linear-gradient(135deg, var(--background) 0%, rgba(124, 58, 237, 0.02) 100%)',
    borderRadius: '12px',
    border: '1px solid var(--input-border)',
    position: 'relative'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    background: 'var(--accent-primary)',
    color: 'var(--button-text)',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    flex: '1',
    justifyContent: 'center',
    minWidth: '140px',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: isHovered ? 'var(--accent-hover)' : 'var(--accent-primary)',
    boxShadow: '0 2px 8px -2px var(--accent-primary)'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: 'var(--accent-primary)',
    border: '1px solid var(--accent-primary)',
    boxShadow: 'none'
  };

  const copiedStyle = {
    ...secondaryButtonStyle,
    background: 'var(--accent-primary)',
    color: 'var(--button-text)',
    transform: 'scale(0.98)'
  };

  const containerStyle = {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="white" strokeWidth="0"/>
      <circle cx="12" cy="10" r="3" fill="rgba(255,255,255,0.3)"/>
    </svg>
  );

  const ExternalLinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );

  return (
    <div style={containerStyle}>
      <div 
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={headerSectionStyle}>
          <div style={titleStyle}>
            <div style={iconStyle}>
              <LocationIcon />
            </div>
            <div>
              <div>Location</div>
            </div>
          </div>
          <div style={subtitleStyle}>Store Address Information</div>
        </div>
        
        <div style={addressSectionStyle}>
          <div style={addressLabelStyle}>Physical Address</div>
          <div style={addressStyle}>
            {shopAddress}
          </div>
        </div>
        
        <div style={actionsStyle}>
          <a 
            href={googleMapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            style={primaryButtonStyle}
          >
            <ExternalLinkIcon />
            <span>View on Maps</span>
          </a>
          
          <button 
            onClick={copyToClipboard}
            style={isCopied ? copiedStyle : secondaryButtonStyle}
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
            <span>{isCopied ? 'Copied!' : 'Copy Address'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;