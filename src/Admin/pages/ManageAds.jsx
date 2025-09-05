import React, { useState, useMemo } from 'react';
import { Plus, AlertCircle, CheckCircle, Video, Image, Trash2, Eye, Play, Upload } from 'lucide-react';
import {
  useCreateAdMutation,
  useGetAllAdsQuery,
  useDeleteAdMutation
} from '../../utils/apiSlice';

const ManageAds = () => {
  // API hooks
  const [createAd, { isLoading: isCreatingAd }] = useCreateAdMutation();
  const [deleteAd, { isLoading: isDeletingAd }] = useDeleteAdMutation();
  const { data: allAds = [], isLoading: isLoadingAds, refetch: refetchAds } = useGetAllAdsQuery();

  // Filter only active ads
  const ads = useMemo(() => {
    return allAds.filter(ad => ad.isActive === true);
  }, [allAds]);

  // Form state
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    type: 'image',
    imageFile: null,
    imagePreviewUrl: null // Add preview URL for display
  });

  // UI state
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: '', title: '' });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle file input change - no base64 conversion
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      showNotification('Please select a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showNotification('File size must be less than 5MB', 'error');
      return;
    }

    // Create preview URL for display
    const previewUrl = URL.createObjectURL(file);

    setAdForm(prev => ({
      ...prev,
      imageFile: file,
      imagePreviewUrl: previewUrl
    }));
  };

  // Create advertisement function with FormData for image uploads
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

    // Different validation based on type
    if (adForm.type === 'video') {
      if (!adForm.mediaUrl.trim()) {
        showNotification('Please enter a video URL', 'error');
        return;
      }
      if (!isValidUrl(adForm.mediaUrl)) {
        showNotification('Please enter a valid video URL', 'error');
        return;
      }
    } else {
      if (!adForm.imageFile) {
        showNotification('Please upload an image', 'error');
        return;
      }
    }

    try {
      let adData;

      if (adForm.type === 'image') {
        const formData = new FormData();
        formData.append('type', adForm.type);
        formData.append('title', adForm.title.trim());
        formData.append('description', adForm.description.trim());
        formData.append('mediaUrl', adForm.imageFile); // ✅ must match multer.single("mediaUrl")
      
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(
            pair[0] + ': ' + 
            (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
          );
        }
      
        adData = formData;
      } else {
        adData = {
          type: adForm.type,
          title: adForm.title.trim(),
          description: adForm.description.trim(),
          mediaUrl: adForm.mediaUrl, // ✅ for videos, backend expects string URL
        };
        console.log('Video ad data:', adData);
      }
      

      const res = await createAd(adData);

      if (res.error) {
        throw res.error;
      }

      // Clean up preview URL
      if (adForm.imagePreviewUrl) {
        URL.revokeObjectURL(adForm.imagePreviewUrl);
      }

      // Reset form on success
      setAdForm({
        title: '',
        description: '',
        mediaUrl: '',
        type: 'image',
        imageFile: null,
        imagePreviewUrl: null
      });

      // Clear file input
      const fileInput = document.getElementById('imageUpload');
      if (fileInput) fileInput.value = '';

      showNotification('Advertisement created successfully');
      refetchAds();
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to create advertisement';
      showNotification(errorMessage, 'error');
    }
  };

  // Soft delete ad function
  const handleDeleteAd = async (adId) => {
    try {
      await deleteAd({ adId }).unwrap();
      showNotification('Advertisement deactivated successfully');
      refetchAds();
      setDeleteConfirm({ show: false, id: '', title: '' });
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to deactivate advertisement';
      showNotification(errorMessage, 'error');
    }
  };

  // Show delete confirmation
  const confirmDelete = (id, title) => {
    setDeleteConfirm({ show: true, id, title });
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle type change - reset media when switching types
  const handleTypeChange = (newType) => {
    // Clean up previous preview URL
    if (adForm.imagePreviewUrl) {
      URL.revokeObjectURL(adForm.imagePreviewUrl);
    }

    setAdForm(prev => ({
      ...prev,
      type: newType,
      mediaUrl: '',
      imageFile: null,
      imagePreviewUrl: null
    }));

    // Clear file input
    const fileInput = document.getElementById('imageUpload');
    if (fileInput) fileInput.value = '';
  };

  // Cleanup function for preview URLs
  React.useEffect(() => {
    return () => {
      if (adForm.imagePreviewUrl) {
        URL.revokeObjectURL(adForm.imagePreviewUrl);
      }
    };
  }, [adForm.imagePreviewUrl]);

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

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <h3 style={modalTitleStyle}>Confirm Deactivate</h3>
              <p style={modalTextStyle}>
                Are you sure you want to deactivate this advertisement "{deleteConfirm.title}"?
                This will hide it from the active advertisements list.
              </p>
              <div style={modalButtonsStyle}>
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: '', title: '' })}
                  style={cancelButtonStyle}
                  disabled={isDeletingAd}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAd(deleteConfirm.id)}
                  style={deleteButtonStyle}
                  disabled={isDeletingAd}
                >
                  {isDeletingAd ? 'Deactivating...' : 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Ad Form */}
        <div style={cardStyle}>
          <div style={contentStyle}>
            <h2 style={sectionTitleStyle}>
              <Video size={24} />
              Upload Advertisement
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
                  onChange={(e) => handleTypeChange(e.target.value)}
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

              {/* Conditional media input based on type */}
              {adForm.type === 'image' ? (
                <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Upload Image *</label>
                  <div style={fileUploadContainerStyle}>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={hiddenFileInputStyle}
                    />
                    <label htmlFor="imageUpload" style={fileUploadButtonStyle}>
                      <Upload size={20} />
                      {adForm.imageFile ? 'Change Image' : 'Choose Image'}
                    </label>
                    {adForm.imageFile && (
                      <div style={fileInfoStyle}>
                        <Image size={16} />
                        <span>{adForm.imageFile.name}</span>
                        <span style={fileSizeStyle}>
                          ({(adForm.imageFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                  <p style={helpTextStyle}>
                    Supported formats: JPEG, PNG, GIF, WebP (Max: 5MB)
                  </p>
                </div>
              ) : (
                <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Video URL *</label>
                  <input
                    type="url"
                    value={adForm.mediaUrl}
                    onChange={(e) => setAdForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=example"
                    style={{
                      ...inputStyle,
                      borderColor: adForm.mediaUrl && !isValidUrl(adForm.mediaUrl) ? '#EF4444' : 'var(--input-border)'
                    }}
                  />
                  {adForm.mediaUrl && !isValidUrl(adForm.mediaUrl) && (
                    <p style={errorTextStyle}>Please enter a valid URL</p>
                  )}
                </div>
              )}

              {/* Media Preview */}
              {((adForm.type === 'image' && adForm.imagePreviewUrl) || (adForm.type === 'video' && adForm.mediaUrl && isValidUrl(adForm.mediaUrl))) && (
                <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Media Preview</label>
                  <div style={previewContainerStyle}>
                    {adForm.type === 'image' ? (
                      <img
                        src={adForm.imagePreviewUrl}
                        alt="Ad preview"
                        style={previewImageStyle}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={videoPreviewStyle}>
                        <Video size={48} style={{ color: 'var(--secondary-text)' }} />
                        <p style={videoPreviewTextStyle}>Video URL provided</p>
                        <p style={videoPreviewSubtextStyle}>{adForm.mediaUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
                    Uploading Ad...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Upload Advertisement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Active Ads List */}
        <div style={cardStyle}>
          <div style={contentStyle}>
            <div style={headerStyle}>
              <h2 style={sectionTitleStyle}>
                <Eye size={24} />
                Active Advertisements ({ads.length})
              </h2>
              <div style={activeIndicatorStyle}>
                <div style={activeDotStyle}></div>
                <span style={activeTextStyle}>Showing only active ads</span>
              </div>
            </div>

            {isLoadingAds ? (
              <div style={loadingStyle}>Loading advertisements...</div>
            ) : ads.length === 0 ? (
              <div style={emptyStateStyle}>
                <Video size={48} style={{ color: 'var(--secondary-text)' }} />
                <p>No active advertisements found</p>
                <p style={emptySubtextStyle}>
                  {allAds.length > 0
                    ? `${allAds.length} inactive advertisement(s) are hidden`
                    : 'Create your first advertisement above'
                  }
                </p>
              </div>
            ) : (
              <div style={adsGridStyle}>
                {ads.map((ad) => (
                  <div key={ad._id} style={adCardStyle}>
                    <div style={adMediaContainerStyle}>
                      {/* Active status indicator */}
                      <div style={activeStatusStyle}>
                        <div style={activeStatusDotStyle}></div>
                        <span style={activeStatusTextStyle}>Active</span>
                      </div>

                      {ad.type === 'image' ? (
                        <img
                          src={ad.mediaUrl}
                          alt={ad.title}
                          style={adImageStyle}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBDOTQuNDc3MiA4MCA5MCA4NC40NzcyIDkwIDkwQzkwIDk1LjUyMjggOTQuNDc3MiAxMDAgMTAwIDEwMEMxMDUuNTIzIDEwMCAxMTAgOTUuNTIyOCAxMTAgOTBDMTEwIDg0LjQ3NzIgMTA1LjUyMyA4MCAxMDAgODBaIiBmaWxsPSIjOUI5Qzk4Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzk0LjQ3NzIgMTIwIDkwIDEyNC40NzcgOTAgMTMwQzkwIDEzNS41MjMgOTQuNDc3MiAxNDAgMTAwIDE0MEMxMDUuNTIzIDE0MCAxMTAgMTM1LjUyMyAxMTAgMTMwQzExMCAxMjQuNDc3IDEwNS41MjMgMTIwIDEwMCAxMjBaIiBmaWxsPSIjOUI5Qzk4Ii8+Cjwvc3ZnPgo=';
                          }}
                        />
                      ) : (
                        <div style={videoThumbnailStyle}>
                          <Play size={32} style={{ color: 'white' }} />
                          <div style={videoTypeIndicatorStyle}>Video</div>
                        </div>
                      )}
                    </div>
                    <div style={adContentStyle}>
                      <h3 style={adTitleStyle}>{ad.title}</h3>
                      <p style={adDescriptionStyle}>{ad.description}</p>
                      <div style={adMetaStyle}>
                        <span style={adTypeStyle}>
                          {ad.type === 'image' ? (
                            <>
                              <Image size={14} />
                              Image
                            </>
                          ) : (
                            <>
                              <Video size={14} />
                              Video
                            </>
                          )}
                        </span>
                        <button
                          onClick={() => confirmDelete(ad._id, ad.title)}
                          style={deleteAdButtonStyle}
                          title="Deactivate advertisement"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={adUrlStyle}>
                        <a
                          href={ad.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={adLinkStyle}
                        >
                          View Media
                        </a>
                      </div>
                      <div style={adDateStyle}>
                        Created: {new Date(ad.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles with added spinner animation keyframes
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

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: 'var(--card-background)',
  borderRadius: '12px',
  padding: '24px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
};

const modalTitleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: 'var(--primary-text)',
  margin: '0 0 12px 0'
};

const modalTextStyle = {
  fontSize: '14px',
  color: 'var(--secondary-text)',
  margin: '0 0 20px 0',
  lineHeight: '1.5'
};

const modalButtonsStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end'
};

const cancelButtonStyle = {
  padding: '8px 16px',
  border: '1px solid var(--card-border)',
  borderRadius: '6px',
  backgroundColor: 'var(--card-background)',
  color: 'var(--secondary-text)',
  cursor: 'pointer',
  fontSize: '14px'
};

const deleteButtonStyle = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#EF4444',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px'
};

const cardStyle = {
  backgroundColor: 'var(--card-background)',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  border: '1px solid var(--card-border)',
  marginBottom: '24px'
};

const contentStyle = {
  padding: '32px'
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

const fileUploadContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const hiddenFileInputStyle = {
  display: 'none'
};

const fileUploadButtonStyle = {
  padding: '12px 16px',
  border: '2px dashed var(--input-border)',
  borderRadius: '8px',
  backgroundColor: 'var(--card-background)',
  color: 'var(--primary-text)',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '500'
};

const fileInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: '#F3F4F6',
  borderRadius: '6px',
  fontSize: '14px',
  color: 'var(--primary-text)'
};

const fileSizeStyle = {
  color: 'var(--secondary-text)',
  fontSize: '12px'
};

const helpTextStyle = {
  fontSize: '12px',
  color: 'var(--secondary-text)',
  fontStyle: 'italic'
};

const errorTextStyle = {
  fontSize: '12px',
  color: '#EF4444',
  margin: '4px 0 0 0'
};

const previewContainerStyle = {
  border: '1px solid var(--card-border)',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: '#f9f9f9'
};

const previewImageStyle = {
  width: '100%',
  maxHeight: '200px',
  objectFit: 'cover',
  display: 'block'
};

const videoPreviewStyle = {
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#f9f9f9'
};

const videoPreviewTextStyle = {
  fontSize: '14px',
  color: 'var(--primary-text)',
  margin: '8px 0 4px 0',
  fontWeight: '500'
};

const videoPreviewSubtextStyle = {
  fontSize: '12px',
  color: 'var(--secondary-text)',
  margin: '0',
  wordBreak: 'break-all'
};

const spinnerStyle = {
  width: '16px',
  height: '16px',
  border: '2px solid transparent',
  borderTop: '2px solid currentColor',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const loadingStyle = {
  textAlign: 'center',
  padding: '40px',
  color: 'var(--secondary-text)'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '60px 20px',
  color: 'var(--secondary-text)'
};

const adsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px'
};

const adCardStyle = {
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: 'var(--background)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const adMediaContainerStyle = {
  height: '160px',
  overflow: 'hidden',
  position: 'relative'
};

const adImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const videoThumbnailStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#1a1a1a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
};

const videoTypeIndicatorStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px'
};

const adContentStyle = {
  padding: '16px'
};

const adTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: 'var(--primary-text)',
  margin: '0 0 8px 0'
};

const adDescriptionStyle = {
  fontSize: '14px',
  color: 'var(--secondary-text)',
  margin: '0 0 12px 0',
  lineHeight: '1.4'
};

const adMetaStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const adTypeStyle = {
  fontSize: '12px',
  fontWeight: '500',
  color: 'var(--accent-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

const deleteAdButtonStyle = {
  padding: '6px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#FEE2E2',
  color: '#DC2626',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease'
};

const adUrlStyle = {
  marginTop: '8px'
};

const adLinkStyle = {
  fontSize: '12px',
  color: 'var(--accent-primary)',
  textDecoration: 'none',
  fontWeight: '500'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
  flexWrap: 'wrap',
  gap: '16px'
};

const activeIndicatorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  backgroundColor: '#F0FDF4',
  borderRadius: '20px',
  border: '1px solid #BBF7D0'
};

const activeDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#22C55E'
};

const activeTextStyle = {
  fontSize: '12px',
  color: '#166534',
  fontWeight: '500'
};

const activeStatusStyle = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  backgroundColor: 'rgba(34, 197, 94, 0.9)',
  borderRadius: '12px',
  zIndex: 1
};

const activeStatusDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'white'
};

const activeStatusTextStyle = {
  fontSize: '10px',
  color: 'white',
  fontWeight: '600'
};

const emptySubtextStyle = {
  fontSize: '12px',
  color: 'var(--secondary-text)',
  marginTop: '8px',
  fontStyle: 'italic'
};

const adDateStyle = {
  fontSize: '11px',
  color: 'var(--secondary-text)',
  marginTop: '8px',
  fontStyle: 'italic'
};

export default ManageAds; 