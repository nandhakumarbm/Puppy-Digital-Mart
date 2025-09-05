import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Store, Phone, MapPin, Calendar, X, Check, AlertTriangle, Upload, Filter } from 'lucide-react';
import { Snackbar, Alert } from '@mui/material';
import { useGetStoreQuery, useEditStoreMutation, useDeleteStoreMutation } from '../../utils/apiSlice';

const MultiStoreManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStore, setSelectedStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    storeName: '',
    storeImgUrl: '',
    address: '',
    phoneNo: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });

  // RTK Query hooks
  const { data: storesData, isLoading, error, refetch } = useGetStoreQuery();
  const [editStore, { isLoading: isEditLoading }] = useEditStoreMutation();
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

  console.log(storesData);

  // Convert single store response to array format for consistency
  const stores = storesData ? (Array.isArray(storesData) ? storesData : [storesData]) : [];

  // Filter stores based on search and status
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.phoneNo.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && store.isActive) ||
                         (filterStatus === 'inactive' && !store.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleEdit = (store) => {
    setSelectedStore(store);
    setFormData({
      storeName: store.storeName,
      storeImgUrl: store.storeImgUrl,
      address: store.address,
      phoneNo: store.phoneNo
    });
    setImagePreview(store.storeImgUrl);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'storeImgUrl') {
      setImagePreview(value);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setFormData(prev => ({
          ...prev,
          storeImgUrl: base64String
        }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedStore) return;

    try {
      await editStore({
        storeId: selectedStore._id,
        ...formData
      }).unwrap();

      setIsEditing(false);
      setSelectedStore(null);
      refetch();
      showSnackbar('Store updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating store:', error);
      showSnackbar('Failed to update store. Please try again.', 'error');
    }
  };

  const handleDelete = async (storeId) => {
    try {
      await deleteStore({ storeId }).unwrap();
      setShowDeleteConfirm(null);
      refetch();
      showSnackbar('Store deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting store:', error);
      showSnackbar('Failed to delete store. Please try again.', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedStore(null);
    setFormData({
      storeName: '',
      storeImgUrl: '',
      address: '',
      phoneNo: ''
    });
    setImagePreview('');
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading stores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-container">
          <AlertTriangle className="error-icon" />
          <h2>Error Loading Stores</h2>
          <p>Unable to load store data. Please try again later.</p>
          <button onClick={refetch} className="retry-button">
            <Plus size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="store-management-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-content">
            <div className="header-text">
              <h1>
                <Store className="header-icon" />
                Store Management
              </h1>
              <p>Manage all your stores in one place</p>
            </div>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-number">{stores.length}</div>
                <div className="stat-label">Total Stores</div>
              </div>
              <div className="stat-card active">
                <div className="stat-number">{stores.filter(s => s.isActive).length}</div>
                <div className="stat-label">Active</div>
              </div>
              <div className="stat-card inactive">
                <div className="stat-number">{stores.filter(s => !s.isActive).length}</div>
                <div className="stat-label">Inactive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="controls-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, address, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-container">
            <Filter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Stores</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="stores-grid">
          {filteredStores.length === 0 ? (
            <div className="no-stores-message">
              <Store className="no-stores-icon" />
              <h3>No Stores Found</h3>
              <p>
                {searchTerm || filterStatus !== 'all' 
                  ? 'No stores match your current search or filter criteria.'
                  : 'No stores available to display.'
                }
              </p>
              {(searchTerm || filterStatus !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="clear-filters-button"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            filteredStores.map((store) => (
              <div key={store._id} className="store-card">
                <div className="store-image-container">
                  {store.storeImgUrl ? (
                    <img
                      src={store.storeImgUrl}
                      alt={store.storeName}
                      className="store-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="store-image-placeholder" style={{ display: store.storeImgUrl ? 'none' : 'flex' }}>
                    <Store size={32} />
                  </div>
                  
                  <div className={`status-badge ${store.isActive ? 'active' : 'inactive'}`}>
                    {store.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="store-content">
                  <h3 className="store-name">{store.storeName}</h3>
                  
                  <div className="store-info">
                    <div className="info-item">
                      <MapPin size={16} />
                      <span className="info-text">{store.address}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={16} />
                      <span className="info-text">{store.phoneNo}</span>
                    </div>
                    <div className="info-item">
                      <Calendar size={16} />
                      <span className="info-text">Updated {formatDate(store.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="store-actions">
                  <button
                    onClick={() => handleEdit(store)}
                    className="action-button edit-button"
                    title="Edit Store"
                    disabled={isEditLoading}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(store)}
                    className="action-button delete-button"
                    title="Delete Store"
                    disabled={isDeleting}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        {isEditing && selectedStore && (
          <div className="modal-overlay">
            <div className="modal-content edit-modal">
              <div className="modal-header">
                <h3>
                  <Edit size={20} />
                  Edit Store
                </h3>
                <button onClick={resetForm} className="close-button">
                  <X size={20} />
                </button>
              </div>

              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="storeName">Store Name</label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      placeholder="Enter store name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phoneNo">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNo"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter store address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Store Image</label>
                  <div className="image-upload-section">
                    <div className="image-preview">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="preview-image" />
                      ) : (
                        <div className="preview-placeholder">
                          <Upload size={24} />
                          <span>No image selected</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="upload-controls">
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                      <label htmlFor="imageUpload" className="file-upload-button">
                        <Upload size={16} />
                        Upload Image
                      </label>
                      
                      <div className="url-input-group">
                        <input
                          type="url"
                          name="storeImgUrl"
                          value={formData.storeImgUrl}
                          onChange={handleInputChange}
                          placeholder="Or paste image URL"
                          className="url-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    onClick={resetForm}
                    className="cancel-button"
                    disabled={isEditLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="save-button"
                    disabled={isEditLoading}
                  >
                    {isEditLoading ? (
                      <>
                        <div className="button-spinner"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <div className="modal-header danger">
                <h3>
                  <AlertTriangle size={20} />
                  Confirm Delete
                </h3>
                <button onClick={() => setShowDeleteConfirm(null)} className="close-button">
                  <X size={20} />
                </button>
              </div>

              <div className="delete-content">
                <div className="delete-icon">
                  <Trash2 size={48} />
                </div>
                <h4>Delete "{showDeleteConfirm.storeName}"?</h4>
                <p>This action cannot be undone. The store and all its data will be permanently removed.</p>
              </div>

              <div className="delete-actions">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="cancel-delete-button"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm._id)}
                  className="confirm-delete-button"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="button-spinner"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Material-UI Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>

      <style jsx>{`
        .app-container {
          background: '#E5E7EB';
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .store-management-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* Header Section */
        .header-section {
          margin-bottom: 2rem;
        }

        .header-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-text {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header-text h1 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .header-icon {
          color: #667eea;
        }

        .header-text p {
          color: #718096;
          font-size: 1.1rem;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #f7fafc, #edf2f7);
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-card.active {
          background: linear-gradient(135deg, #c6f6d5, #9ae6b4);
          color: #22543d;
        }

        .stat-card.inactive {
          background: linear-gradient(135deg, #fed7d7, #feb2b2);
          color: #742a2a;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          font-weight: 500;
        }

        /* Controls Section */
        .controls-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: none;
          border-radius: 16px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          border-color: #667eea;
        }

        .filter-container {
          position: relative;
          min-width: 180px;
        }

        .filter-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          z-index: 1;
        }

        .filter-select {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: none;
          border-radius: 16px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          border-color: #667eea;
        }

        /* Stores Grid */
        .stores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .store-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          position: relative;
        }

        .store-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        }

        .store-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .store-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .store-card:hover .store-image {
          transform: scale(1.05);
        }

        .store-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .status-badge.active {
          background: rgba(72, 187, 120, 0.9);
          color: white;
        }

        .status-badge.inactive {
          background: rgba(229, 62, 62, 0.9);
          color: white;
        }

        .store-content {
          padding: 1.5rem;
        }

        .store-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .store-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .info-item svg {
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        .info-text {
          line-height: 1.4;
        }

        .store-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          background: rgba(248, 250, 252, 0.5);
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .edit-button {
          background: linear-gradient(135deg, #38b2ac, #319795);
          color: white;
        }

        .edit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(56, 178, 172, 0.4);
        }

        .delete-button {
          background: linear-gradient(135deg, #e53e3e, #c53030);
          color: white;
        }

        .delete-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(229, 62, 62, 0.4);
        }

        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* No Stores Message */
        .no-stores-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .no-stores-icon {
          color: #a0aec0;
          margin-bottom: 1rem;
        }

        .no-stores-message h3 {
          color: #2d3748;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .no-stores-message p {
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .clear-filters-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .clear-filters-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
          padding: 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideIn 0.3s ease-out;
          max-height: 90vh;
          overflow-y: auto;
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-32px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .modal-header.danger {
          background: linear-gradient(135deg, #fed7d7, #feb2b2);
          color: #742a2a;
          border-bottom-color: rgba(196, 48, 43, 0.2);
        }

        .modal-header h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .close-button:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #2d3748;
        }

        /* Edit Modal */
        .edit-modal {
          width: 100%;
          max-width: 600px;
        }

        .edit-form {
          padding: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2d3748;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: rgba(255, 255, 255, 1);
        }

        .image-upload-section {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 1rem;
          align-items: start;
        }

        .image-preview {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-placeholder {
          width: 100%;
          height: 100%;
          background: #f7fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #a0aec0;
          font-size: 0.8rem;
          gap: 0.5rem;
        }

        .upload-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .file-input {
          display: none;
        }

        .file-upload-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          text-align: center;
          justify-content: center;
          font-size: 0.9rem;
        }

        .file-upload-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .url-input {
          margin-top: 0.5rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .cancel-button,
        .save-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .cancel-button {
          background: #f7fafc;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .cancel-button:hover:not(:disabled) {
          background: #edf2f7;
          color: #2d3748;
          transform: translateY(-1px);
        }

        .save-button {
          background: linear-gradient(135deg, #38b2ac, #319795);
          color: white;
        }

        .save-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(56, 178, 172, 0.4);
        }

        .save-button:disabled,
        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Delete Modal */
        .delete-modal {
          width: 100%;
          max-width: 400px;
        }

        .delete-content {
          padding: 2rem;
          text-align: center;
        }

        .delete-icon {
          color: #e53e3e;
          margin-bottom: 1rem;
        }

        .delete-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .delete-content p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .delete-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          padding: 1.5rem 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        .cancel-delete-button,
        .confirm-delete-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .cancel-delete-button {
          background: #f7fafc;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .cancel-delete-button:hover:not(:disabled) {
          background: #edf2f7;
          color: #2d3748;
          transform: translateY(-1px);
        }

        .confirm-delete-button {
          background: linear-gradient(135deg, #e53e3e, #c53030);
          color: white;
        }

        .confirm-delete-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(229, 62, 62, 0.4);
        }

        .confirm-delete-button:disabled,
        .cancel-delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Loading and Error States */
        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
          padding: 3rem;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }

        .error-icon {
          color: #e53e3e;
          margin-bottom: 1.5rem;
        }

        .error-container h2 {
          color: #2d3748;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .error-container p {
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .retry-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .app-container {
            padding: 1rem;
          }

          .header-content {
            padding: 1.5rem;
          }

          .header-text h1 {
            font-size: 2rem;
          }

          .controls-section {
            flex-direction: column;
          }

          .search-container,
          .filter-container {
            min-width: unset;
          }

          .stores-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .image-upload-section {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .image-preview {
            margin: 0 auto;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .delete-actions {
            flex-direction: column-reverse;
          }

          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }
        }

        @media (max-width: 480px) {
          .app-container {
            padding: 0.5rem;
          }

          .header-content {
            padding: 1rem;
          }

          .header-text h1 {
            font-size: 1.75rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .stats-cards {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }

          .stat-card {
            padding: 1rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .store-actions {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .action-button {
            flex: 1;
            min-width: 44px;
          }

          .edit-form,
          .delete-content {
            padding: 1.5rem;
          }

          .modal-header {
            padding: 1rem 1.5rem;
          }

          .delete-actions {
            padding: 1rem 1.5rem;
          }
        }`}</style>
    </div>
  );
}

export default MultiStoreManagement;