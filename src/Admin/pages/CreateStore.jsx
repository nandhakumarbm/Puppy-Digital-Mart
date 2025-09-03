import React, { useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { useCreateStoreMutation } from '../../utils/apiSlice'

const CreateStore = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    shopAddress: '',
    phoneNo: '',
    shopImage: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const [createStore, { isLoading }] = useCreateStoreMutation()

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#F9FAFB'
    },
    formCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '40px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      border: '1px solid #E5E7EB',
      width: '100%',
      maxWidth: '500px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#1F2937',
      textAlign: 'center',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: '32px'
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1F2937',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #C7D2FE',
      borderRadius: '8px',
      fontSize: '16px',
      color: '#1F2937',
      backgroundColor: '#FFFFFF',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontFamily: 'Poppins'
    },
    inputFocus: {
      borderColor: '#7C3AED',
      boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #C7D2FE',
      borderRadius: '8px',
      fontSize: '16px',
      color: '#1F2937',
      backgroundColor: '#FFFFFF',
      outline: 'none',
      transition: 'all 0.2s ease',
      fontFamily: 'Poppins',
      resize: 'vertical',
      minHeight: '100px'
    },
    fileInputContainer: {
      position: 'relative',
      display: 'inline-block',
      width: '100%'
    },
    fileInput: {
      position: 'absolute',
      opacity: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer'
    },
    fileInputLabel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 16px',
      border: '2px dashed #C7D2FE',
      borderRadius: '8px',
      fontSize: '16px',
      color: '#6B7280',
      backgroundColor: '#FFFFFF',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '50px'
    },
    fileInputLabelHover: {
      borderColor: '#7C3AED',
      backgroundColor: '#F8F7FF'
    },
    imagePreview: {
      marginTop: '16px',
      textAlign: 'center'
    },
    previewImage: {
      maxWidth: '200px',
      maxHeight: '200px',
      borderRadius: '8px',
      border: '2px solid #E5E7EB',
      objectFit: 'cover'
    },
    error: {
      color: '#DC2626',
      fontSize: '14px',
      marginTop: '4px'
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px'
    },
    button: {
      flex: 1,
      padding: '14px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      fontFamily: 'Poppins'
    },
    primaryButton: {
      backgroundColor: '#7C3AED',
      color: '#FFFFFF'
    },
    primaryButtonHover: {
      backgroundColor: '#6D28D9'
    },
    primaryButtonDisabled: {
      backgroundColor: '#9CA3AF',
      cursor: 'not-allowed'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#6B7280',
      border: '2px solid #E5E7EB'
    },
    secondaryButtonHover: {
      backgroundColor: '#F9FAFB',
      borderColor: '#C7D2FE'
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        shopImage: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Clear error
      if (errors.shopImage) {
        setErrors(prev => ({
          ...prev,
          shopImage: ''
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required'
    }

    if (!formData.shopAddress.trim()) {
      newErrors.shopAddress = 'Shop address is required'
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phoneNo.trim())) {
      newErrors.phoneNo = 'Phone number must be 10 digits'
    }

    if (!formData.shopImage) {
      newErrors.shopImage = 'Shop image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      let storeImgUrl = ''
      
      // Convert image to base64 if image is provided
      if (formData.shopImage) {
        storeImgUrl = await convertImageToBase64(formData.shopImage)
      }

      const payload = {
        storeName: formData.shopName,
        address: formData.shopAddress,
        phoneNo: formData.phoneNo,
        storeImgUrl: storeImgUrl
      }

      const response = await createStore(payload).unwrap()
      
      setAlert({
        open: true,
        message: 'Store created successfully!',
        severity: 'success'
      })

      // Reset form on success
      handleReset()
      
    } catch (error) {
      console.error('Error creating store:', error)
      
      setAlert({
        open: true,
        message: error?.data?.message || 'Failed to create store. Please try again.',
        severity: 'error'
      })
    }
  }

  const handleReset = () => {
    setFormData({
      shopName: '',
      shopAddress: '',
      phoneNo: '',
      shopImage: null
    })
    setImagePreview(null)
    setErrors({})
  }

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }))
  }

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Create New Store</h1>
        <p style={styles.subtitle}>Fill in the details to create your shop</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="shopName" style={styles.label}>
              Shop Name *
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              placeholder="Enter your shop name"
              style={{
                ...styles.input,
                borderColor: errors.shopName ? '#DC2626' : '#C7D2FE'
              }}
              disabled={isLoading}
            />
            {errors.shopName && <div style={styles.error}>{errors.shopName}</div>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="shopAddress" style={styles.label}>
              Shop Address *
            </label>
            <textarea
              id="shopAddress"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleInputChange}
              placeholder="Enter complete shop address"
              style={{
                ...styles.textarea,
                borderColor: errors.shopAddress ? '#DC2626' : '#C7D2FE'
              }}
              disabled={isLoading}
            />
            {errors.shopAddress && <div style={styles.error}>{errors.shopAddress}</div>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="phoneNo" style={styles.label}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              style={{
                ...styles.input,
                borderColor: errors.phoneNo ? '#DC2626' : '#C7D2FE'
              }}
              disabled={isLoading}
            />
            {errors.phoneNo && <div style={styles.error}>{errors.phoneNo}</div>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="shopImage" style={styles.label}>
              Shop Image *
            </label>
            <div style={styles.fileInputContainer}>
              <input
                type="file"
                id="shopImage"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
                disabled={isLoading}
              />
              <label
                htmlFor="shopImage"
                style={{
                  ...styles.fileInputLabel,
                  borderColor: errors.shopImage ? '#DC2626' : '#C7D2FE',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {formData.shopImage ? formData.shopImage.name : '📷 Click to upload shop image'}
              </label>
            </div>
            {errors.shopImage && <div style={styles.error}>{errors.shopImage}</div>}

            {imagePreview && (
              <div style={styles.imagePreview}>
                <img
                  src={imagePreview}
                  alt="Shop preview"
                  style={styles.previewImage}
                />
              </div>
            )}
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              style={{
                ...styles.button,
                ...styles.secondaryButton,
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = styles.secondaryButtonHover.backgroundColor
                  e.target.style.borderColor = styles.secondaryButtonHover.borderColor
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = styles.secondaryButton.backgroundColor
                  e.target.style.borderColor = styles.secondaryButton.border?.split(' ')[2] || '#E5E7EB'
                }
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(isLoading ? styles.primaryButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = styles.primaryButtonHover.backgroundColor
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = styles.primaryButton.backgroundColor
                }
              }}
            >
              {isLoading ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>

      {/* MUI Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default CreateStore