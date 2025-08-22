import React, { useState } from 'react';
import { Plus, Upload, X, Image, Video, Package } from 'lucide-react';

const AddItems = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [ads, setAds] = useState([]);
  
  // Item form state
  const [itemForm, setItemForm] = useState({
    name: '',
    image: null,
    imagePreview: ''
  });
  
  // Ad form state
  const [adForm, setAdForm] = useState({
    title: '',
    type: 'image',
    media: null,
    mediaPreview: ''
  });

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'item') {
          setItemForm(prev => ({
            ...prev,
            image: file,
            imagePreview: event.target.result
          }));
        } else {
          setAdForm(prev => ({
            ...prev,
            media: file,
            mediaPreview: event.target.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    if (itemForm.name && itemForm.image) {
      setItems(prev => [...prev, {
        id: Date.now(),
        name: itemForm.name,
        image: itemForm.imagePreview
      }]);
      setItemForm({ name: '', image: null, imagePreview: '' });
    }
  };

  const addAd = () => {
    if (adForm.title && adForm.media) {
      setAds(prev => [...prev, {
        id: Date.now(),
        title: adForm.title,
        type: adForm.type,
        media: adForm.mediaPreview
      }]);
      setAdForm({ title: '', type: 'image', media: null, mediaPreview: '' });
    }
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const removeAd = (id) => {
    setAds(prev => prev.filter(ad => ad.id !== id));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      padding: '16px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #E5E7EB'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#7C3AED',
          color: '#FFFFFF',
          padding: '24px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: '0',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: '600',
            fontFamily: 'Poppins, sans-serif'
          }}>Admin Dashboard</h1>
          <p style={{
            margin: '8px 0 0 0',
            opacity: '0.9',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            fontFamily: 'Poppins, sans-serif'
          }}>Manage Items & Advertisements</p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          backgroundColor: '#F9FAFB',
          borderBottom: '2px solid #E5E7EB'
        }}>
          <button
            onClick={() => setActiveTab('items')}
            style={{
              flex: '1',
              padding: '16px 20px',
              border: 'none',
              backgroundColor: activeTab === 'items' ? '#7C3AED' : 'transparent',
              color: activeTab === 'items' ? '#FFFFFF' : '#6B7280',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <Package size={20} />
            Add Items
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            style={{
              flex: '1',
              padding: '16px 20px',
              border: 'none',
              backgroundColor: activeTab === 'ads' ? '#6366F1' : 'transparent',
              color: activeTab === 'ads' ? '#FFFFFF' : '#6B7280',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            <Video size={20} />
            Add Advertisements
          </button>
        </div>

        <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
          {activeTab === 'items' && (
            <div>
              {/* Add Item Form */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: 'clamp(20px, 4vw, 32px)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.1)',
                marginBottom: '24px',
                border: '1px solid #C7D2FE'
              }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  color: '#1F2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600'
                }}>
                  <Plus size={24} />
                  Add New Item
                </h2>
                
                <div style={{ 
                  display: 'grid', 
                  gap: '20px',
                  gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontSize: '0.9rem',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Item Name</label>
                    <input
                      type="text"
                      value={itemForm.name}
                      onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter item name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #C7D2FE',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#1F2937'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                      onBlur={(e) => e.target.style.borderColor = '#C7D2FE'}
                    />
                  </div>
                  
                  <div style={{ gridColumn: window.innerWidth <= 768 ? '1' : '1 / -1' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontSize: '0.9rem',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Item Image</label>
                    <div style={{
                      border: '2px dashed #C7D2FE',
                      borderRadius: '8px',
                      padding: 'clamp(20px, 4vw, 40px)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: itemForm.imagePreview ? 'transparent' : '#F9FAFB',
                      minHeight: window.innerWidth <= 768 ? '200px' : '250px'
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = '#7C3AED'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#C7D2FE'}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'item')}
                        style={{ display: 'none' }}
                        id="item-image-upload"
                      />
                      <label htmlFor="item-image-upload" style={{ cursor: 'pointer' }}>
                        {itemForm.imagePreview ? (
                          <img
                            src={itemForm.imagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                        ) : (
                          <div>
                            <Upload size={window.innerWidth <= 768 ? 36 : 48} style={{ color: '#6B7280', marginBottom: '12px' }} />
                            <p style={{ 
                              margin: '0', 
                              color: '#6B7280', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                              fontFamily: 'Poppins, sans-serif'
                            }}>
                              Click to upload image
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <button
                    onClick={addItem}
                    style={{
                      backgroundColor: '#7C3AED',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '14px 24px',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                      fontFamily: 'Poppins, sans-serif',
                      gridColumn: window.innerWidth <= 768 ? '1' : '1 / -1'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#6D28D9';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#7C3AED';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <Plus size={20} />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: 'clamp(20px, 4vw, 32px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #E5E7EB'
              }}>
                <h3 style={{ 
                  margin: '0 0 20px 0', 
                  color: '#1F2937', 
                  fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600'
                }}>Added Items ({items.length})</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth <= 768 
                    ? 'repeat(auto-fit, minmax(200px, 1fr))' 
                    : 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 'clamp(12px, 3vw, 20px)'
                }}>
                  {items.map(item => (
                    <div key={item.id} style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      position: 'relative',
                      transition: 'transform 0.3s ease',
                      border: '1px solid #E5E7EB'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1
                        }}
                      >
                        <X size={14} />
                      </button>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: window.innerWidth <= 768 ? '120px' : '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '12px'
                        }}
                      />
                      <h4 style={{ 
                        margin: '0', 
                        color: '#1F2937', 
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500'
                      }}>{item.name}</h4>
                    </div>
                  ))}
                </div>
                {items.length === 0 && (
                  <p style={{
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: '1rem',
                    fontFamily: 'Poppins, sans-serif',
                    padding: '40px 20px'
                  }}>No items added yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div>
              {/* Add Advertisement Form */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: 'clamp(20px, 4vw, 32px)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
                marginBottom: '24px',
                border: '1px solid #C7D2FE'
              }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  color: '#1F2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600'
                }}>
                  <Video size={24} />
                  Add New Advertisement
                </h2>
                
                <div style={{ 
                  display: 'grid', 
                  gap: '20px',
                  gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontSize: '0.9rem',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Advertisement Title</label>
                    <input
                      type="text"
                      value={adForm.title}
                      onChange={(e) => setAdForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter advertisement title"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #C7D2FE',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#1F2937'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                      onBlur={(e) => e.target.style.borderColor = '#C7D2FE'}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontSize: '0.9rem',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Media Type</label>
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#1F2937'
                      }}>
                        <input
                          type="radio"
                          value="image"
                          checked={adForm.type === 'image'}
                          onChange={(e) => setAdForm(prev => ({ ...prev, type: e.target.value }))}
                          style={{ cursor: 'pointer' }}
                        />
                        <Image size={18} />
                        Image
                      </label>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#1F2937'
                      }}>
                        <input
                          type="radio"
                          value="video"
                          checked={adForm.type === 'video'}
                          onChange={(e) => setAdForm(prev => ({ ...prev, type: e.target.value }))}
                          style={{ cursor: 'pointer' }}
                        />
                        <Video size={18} />
                        Video
                      </label>
                    </div>
                  </div>
                  
                  <div style={{ gridColumn: window.innerWidth <= 768 ? '1' : '1 / -1' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontSize: '0.9rem',
                      fontFamily: 'Poppins, sans-serif'
                    }}>Upload {adForm.type === 'image' ? 'Image' : 'Video'}</label>
                    <div style={{
                      border: '2px dashed #C7D2FE',
                      borderRadius: '8px',
                      padding: 'clamp(20px, 4vw, 40px)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: adForm.mediaPreview ? 'transparent' : '#F9FAFB',
                      minHeight: window.innerWidth <= 768 ? '200px' : '250px'
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = '#6366F1'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#C7D2FE'}>
                      <input
                        type="file"
                        accept={adForm.type === 'image' ? 'image/*' : 'video/*'}
                        onChange={(e) => handleImageUpload(e, 'ad')}
                        style={{ display: 'none' }}
                        id="ad-media-upload"
                      />
                      <label htmlFor="ad-media-upload" style={{ cursor: 'pointer' }}>
                        {adForm.mediaPreview ? (
                          adForm.type === 'image' ? (
                            <img
                              src={adForm.mediaPreview}
                              alt="Preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              }}
                            />
                          ) : (
                            <video
                              src={adForm.mediaPreview}
                              controls
                              style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              }}
                            />
                          )
                        ) : (
                          <div>
                            <Upload size={window.innerWidth <= 768 ? 36 : 48} style={{ color: '#6B7280', marginBottom: '12px' }} />
                            <p style={{ 
                              margin: '0', 
                              color: '#6B7280', 
                              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                              fontFamily: 'Poppins, sans-serif'
                            }}>
                              Click to upload {adForm.type}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <button
                    onClick={addAd}
                    style={{
                      backgroundColor: '#6366F1',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '14px 24px',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                      fontFamily: 'Poppins, sans-serif',
                      gridColumn: window.innerWidth <= 768 ? '1' : '1 / -1'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4F46E5';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#6366F1';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <Plus size={20} />
                    Add Advertisement
                  </button>
                </div>
              </div>

              {/* Ads List */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: 'clamp(20px, 4vw, 32px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #E5E7EB'
              }}>
                <h3 style={{ 
                  margin: '0 0 20px 0', 
                  color: '#1F2937', 
                  fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600'
                }}>Added Advertisements ({ads.length})</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth <= 768 
                    ? 'repeat(auto-fit, minmax(250px, 1fr))' 
                    : 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 'clamp(12px, 3vw, 20px)'
                }}>
                  {ads.map(ad => (
                    <div key={ad.id} style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      position: 'relative',
                      transition: 'transform 0.3s ease',
                      border: '1px solid #E5E7EB'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                      <button
                        onClick={() => removeAd(ad.id)}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1
                        }}
                      >
                        <X size={14} />
                      </button>
                      {ad.type === 'image' ? (
                        <img
                          src={ad.media}
                          alt={ad.title}
                          style={{
                            width: '100%',
                            height: window.innerWidth <= 768 ? '120px' : '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}
                        />
                      ) : (
                        <video
                          src={ad.media}
                          controls
                          style={{
                            width: '100%',
                            height: window.innerWidth <= 768 ? '120px' : '150px',
                            borderRadius: '8px',
                            marginBottom: '12px'
                          }}
                        />
                      )}
                      <h4 style={{ 
                        margin: '0 0 4px 0', 
                        color: '#1F2937', 
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500'
                      }}>{ad.title}</h4>
                      <p style={{ 
                        margin: '0', 
                        color: '#6B7280', 
                        textTransform: 'capitalize',
                        fontSize: '0.85rem',
                        fontFamily: 'Poppins, sans-serif'
                      }}>
                        {ad.type}
                      </p>
                    </div>
                  ))}
                </div>
                {ads.length === 0 && (
                  <p style={{
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: '1rem',
                    fontFamily: 'Poppins, sans-serif',
                    padding: '40px 20px'
                  }}>No advertisements added yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddItems;