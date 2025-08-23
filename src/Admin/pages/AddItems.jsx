import React, { useState } from 'react';
import { Plus, Upload, X, Image, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useCreateAdMutation } from '../../utils/apiSlice';

const AddItems = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);

  // API mutation hook
  const [createAd, { isLoading: isCreatingAd }] = useCreateAdMutation();

  // Item form state
  const [itemForm, setItemForm] = useState({
    name: '',
    image: null,
    imagePreview: ''
  });

  // Ad form state
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    type: 'image'
  });

  // UI state
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setItemForm(prev => ({
          ...prev,
          image: file,
          imagePreview: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    if (!itemForm.name.trim()) {
      showNotification('Please enter an item name', 'error');
      return;
    }
    if (!itemForm.image) {
      showNotification('Please select an image', 'error');
      return;
    }

    setItems(prev => [...prev, {
      id: Date.now(),
      name: itemForm.name.trim(),
      image: itemForm.imagePreview
    }]);

    setItemForm({ name: '', image: null, imagePreview: '' });
    showNotification('Item added successfully');
  };

  const createAdvertisement = async () => {
    // Validation
    if (!adForm.title.trim()) {
      showNotification('Please enter an advertisement title', 'error');
      return;
    }
    if (!adForm.description.trim()) {
      showNotification('Please enter a description', 'error');
      return;
    }
    if (!adForm.mediaUrl.trim()) {
      showNotification('Please enter a media URL', 'error');
      return;
    }

    // URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(adForm.mediaUrl)) {
      showNotification('Please enter a valid URL (starting with http:// or https://)', 'error');
      return;
    }

    try {
      const adData = {
        title: adForm.title.trim(),
        description: adForm.description.trim(),
        mediaUrl: adForm.mediaUrl.trim(),
        type: adForm.type
      };

      await createAd(adData).unwrap();

      // Reset form on success
      setAdForm({
        title: '',
        description: '',
        mediaUrl: '',
        type: 'image'
      });

      showNotification('Advertisement created successfully');
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to create advertisement';
      showNotification(errorMessage, 'error');
    }
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    showNotification('Item removed');
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthStyle}>

        {/* Notification */}
        {notification && (
          <div style={{
            ...notificationStyle,
            backgroundColor: notification.type === 'error' ? '#FEF2F2' : '#F0FDF4',
            borderColor: notification.type === 'error' ? '#FECACA' : '#BBF7D0',
            color: notification.type === 'error' ? '#991B1B' : '#166534'
          }}>
            {notification.type === 'error' ?
              <AlertCircle size={20} /> :
              <CheckCircle size={20} />
            }
            <span>{notification.message}</span>
          </div>
        )}

        <div style={cardStyle}> 

          {/* Tab Navigation */}
          <div style={tabContainerStyle}>
            <button
              onClick={() => setActiveTab('items')}
              style={{
                ...tabButtonStyle,
                backgroundColor: activeTab === 'items' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'items' ? 'white' : 'var(--secondary-text)'
              }}
            >
              <Package size={20} />
              Items
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              style={{
                ...tabButtonStyle,
                backgroundColor: activeTab === 'ads' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'ads' ? 'white' : 'var(--secondary-text)'
              }}
            >
              <Image size={20} />
              Advertisements
            </button>
          </div>

          <div style={contentStyle}>
            {activeTab === 'items' && (
              <div>
                {/* Add Item Form */}
                <div style={formSectionStyle}>
                  <h2 style={sectionTitleStyle}>
                    <Plus size={24} />
                    Add New Item
                  </h2>

                  <div style={formGridStyle}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Item Name *</label>
                      <input
                        type="text"
                        value={itemForm.name}
                        onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter item name"
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Item Image *</label>
                      <div style={uploadAreaStyle}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                          id="item-image-upload"
                        />
                        <label htmlFor="item-image-upload" style={uploadLabelStyle}>
                          {itemForm.imagePreview ? (
                            <img
                              src={itemForm.imagePreview}
                              alt="Preview"
                              style={previewImageStyle}
                            />
                          ) : (
                            <div style={uploadPlaceholderStyle}>
                              <Upload size={48} style={{ color: 'var(--secondary-text)' }} />
                              <p style={uploadTextStyle}>
                                Click to upload image
                              </p>
                              <p style={uploadSubtextStyle}>
                                Supports JPG, PNG, GIF up to 10MB
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={addItem}
                      style={{ ...primaryButtonStyle, gridColumn: '1 / -1' }}
                    >
                      <Plus size={20} />
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div style={listSectionStyle}>
                  <h3 style={listTitleStyle}>Added Items ({items.length})</h3>

                  {items.length === 0 ? (
                    <div style={emptyStateStyle}>
                      <Package size={48} style={{ color: 'var(--secondary-text)' }} />
                      <p style={emptyTextStyle}>No items added yet</p>
                    </div>
                  ) : (
                    <div style={itemsGridStyle}>
                      {items.map(item => (
                        <div key={item.id} style={itemCardStyle}>
                          <button
                            onClick={() => removeItem(item.id)}
                            style={removeButtonStyle}
                          >
                            <X size={14} />
                          </button>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={itemImageStyle}
                          />
                          <h4 style={itemNameStyle}>{item.name}</h4>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ads' && (
              <div>
                {/* Add Advertisement Form */}
                <div style={formSectionStyle}>
                  <h2 style={sectionTitleStyle}>
                    <Image size={24} />
                    Create Advertisement
                  </h2>

                  <div style={formGridStyle}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Title *</label>
                      <input
                        type="text"
                        value={adForm.title}
                        onChange={(e) => setAdForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter advertisement title"
                        style={inputStyle}
                      />
                    </div>

                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Media Type *</label>
                      <select
                        value={adForm.type}
                        onChange={(e) => setAdForm(prev => ({ ...prev, type: e.target.value }))}
                        style={selectStyle}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Description *</label>
                      <textarea
                        value={adForm.description}
                        onChange={(e) => setAdForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter advertisement description"
                        style={textareaStyle}
                        rows={3}
                      />
                    </div>

                    <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Media URL *</label>
                      <input
                        type="url"
                        value={adForm.mediaUrl}
                        onChange={(e) => setAdForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                        placeholder="https://example.com/media.jpg"
                        style={{
                          ...inputStyle,
                          borderColor: adForm.mediaUrl && !isValidUrl(adForm.mediaUrl) ? '#EF4444' : 'var(--input-border)'
                        }}
                      />
                      {adForm.mediaUrl && !isValidUrl(adForm.mediaUrl) && (
                        <p style={errorTextStyle}>Please enter a valid URL</p>
                      )}
                    </div>

                    <button
                      onClick={createAdvertisement}
                      disabled={isCreatingAd}
                      style={{
                        ...primaryButtonStyle,
                        gridColumn: '1 / -1',
                        opacity: isCreatingAd ? 0.7 : 1,
                        cursor: isCreatingAd ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isCreatingAd ? (
                        <>
                          <div style={spinnerStyle}></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          Create Advertisement
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional styling using CSS variables
const containerStyle = {
  backgroundColor: 'var(--background)',
  minHeight: '100vh',
  padding: '24px',
  fontFamily: 'var(--font-family)'
};

const maxWidthStyle = {
  maxWidth: '1200px',
  margin: '0 auto'
};

const notificationStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid',
  marginBottom: '24px',
  fontSize: '14px',
  fontWeight: '500'
};

const cardStyle = {
  backgroundColor: 'var(--card-background)',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  border: '1px solid var(--card-border)',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '32px 32px 24px 32px',
  borderBottom: '1px solid var(--card-border)'
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: '600',
  color: 'var(--primary-text)',
  margin: '0 0 8px 0'
};

const subtitleStyle = {
  fontSize: '16px',
  color: 'var(--secondary-text)',
  margin: '0'
};

const tabContainerStyle = {
  display: 'flex',
  borderBottom: '1px solid var(--card-border)'
};

const tabButtonStyle = {
  flex: '1',
  padding: '16px 24px',
  border: 'none',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: 'var(--font-family)'
};

const contentStyle = {
  padding: '32px'
};

const formSectionStyle = {
  backgroundColor: 'var(--background)',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid var(--card-border)',
  marginBottom: '32px'
};

const sectionTitleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: 'var(--primary-text)',
  margin: '0 0 24px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: 'var(--primary-text)'
};

const inputStyle = {
  padding: '12px 16px',
  border: '1px solid var(--input-border)',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  fontFamily: 'var(--font-family)',
  backgroundColor: 'var(--card-background)',
  color: 'var(--primary-text)'
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '80px'
};

const uploadAreaStyle = {
  border: '2px dashed var(--input-border)',
  borderRadius: '8px',
  transition: 'border-color 0.2s ease'
};

const uploadLabelStyle = {
  display: 'block',
  cursor: 'pointer'
};

const uploadPlaceholderStyle = {
  padding: '48px 24px',
  textAlign: 'center'
};

const uploadTextStyle = {
  fontSize: '16px',
  color: 'var(--primary-text)',
  margin: '12px 0 4px 0',
  fontWeight: '500'
};

const uploadSubtextStyle = {
  fontSize: '14px',
  color: 'var(--secondary-text)',
  margin: '0'
};

const previewImageStyle = {
  width: '100%',
  maxHeight: '200px',
  objectFit: 'cover',
  borderRadius: '6px'
};

const primaryButtonStyle = {
  backgroundColor: 'var(--accent-primary)',
  color: 'white',
  border: 'none',
  padding: '14px 24px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: 'var(--font-family)'
};

const listSectionStyle = {
  backgroundColor: 'var(--background)',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid var(--card-border)'
};

const listTitleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: 'var(--primary-text)',
  margin: '0 0 20px 0'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '48px 24px',
  color: 'var(--secondary-text)'
};

const emptyTextStyle = {
  fontSize: '16px',
  margin: '12px 0 0 0'
};

const itemsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '16px'
};

const itemCardStyle = {
  backgroundColor: 'var(--card-background)',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid var(--card-border)',
  position: 'relative',
  transition: 'transform 0.2s ease'
};

const removeButtonStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: '#EF4444',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '28px',
  height: '28px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1
};

const itemImageStyle = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '6px',
  marginBottom: '8px'
};

const itemNameStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: 'var(--primary-text)',
  margin: '0'
};

const errorTextStyle = {
  fontSize: '12px',
  color: '#EF4444',
  margin: '4px 0 0 0'
};

const spinnerStyle = {
  width: '16px',
  height: '16px',
  border: '2px solid transparent',
  borderTop: '2px solid currentColor',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

export default AddItems;