import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  Grid, 
  TextField, 
  InputAdornment,
  CircularProgress,
  Alert,
  Container,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  LinearProgress
} from '@mui/material';
import { 
  Search as SearchIcon, 
  LocalOffer as CouponIcon,
  CalendarToday as DateIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  AutoAwesome as GenerateIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useGetLiveCouponsQuery, useGenerateCouponMutation } from '../../utils/apiSlice';

const LiveCoupons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'redeemed', 'available'
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Generation form state
  const [generationForm, setGenerationForm] = useState({
    tierKey: 'H',
    count: 1
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch live coupons from API
  const { data: couponsData, isLoading, error, refetch } = useGetLiveCouponsQuery();
  
  // Generate coupon mutation
  const [generateCoupon, { isLoading: isGenerating }] = useGenerateCouponMutation();

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setGenerationForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!generationForm.tierKey || generationForm.tierKey.trim() === '') {
      errors.tierKey = 'Tier key is required';
    } else if (generationForm.tierKey.length !== 1) {
      errors.tierKey = 'Tier key must be exactly 1 character';
    }
    
    if (!generationForm.count || generationForm.count < 1) {
      errors.count = 'Count must be at least 1';
    } else if (generationForm.count > 100) {
      errors.count = 'Count cannot exceed 100 coupons';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setGenerationForm({
      tierKey: 'H',
      count: 1
    });
    setFormErrors({});
  };

  // Handle generate coupons
  const handleGenerateCoupons = async () => {
    // Validate form first
    if (!validateForm()) {
      showSnackbar('Please fix the form errors', 'error');
      return;
    }

    try {
      const response = await generateCoupon({
        tierKey: generationForm.tierKey.toUpperCase(),
        count: parseInt(generationForm.count)
      }).unwrap();
      
      if (response.message && response.coupons) {
        const couponCount = response.coupons.length;
        const totalValue = response.coupons.reduce((sum, coupon) => sum + coupon.value, 0);
        
        showSnackbar(
          `Successfully generated ${couponCount} new coupons (Tier: ${generationForm.tierKey}) with total value of ${totalValue} orbits!`, 
          'success'
        );
        
        // Close dialog, reset form and refresh data
        setShowGenerateDialog(false);
        resetForm();
        refetch(); // Refresh the coupons list
        
        console.log('Generated coupons:', response.coupons);
      } else {
        showSnackbar('Coupons generated successfully!', 'success');
        setShowGenerateDialog(false);
        resetForm();
        refetch();
      }
    } catch (error) {
      console.error('Failed to generate coupons:', error);
      
      let errorMessage = 'Failed to generate coupons. Please try again.';
      if (error.data && error.data.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
    }
  };

  // Copy coupon code to clipboard
  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showSnackbar('Coupon code copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy: ', err);
      showSnackbar('Failed to copy coupon code', 'error');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter coupons based on search term and status
  const filteredCoupons = couponsData?.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.value.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'redeemed' && coupon.redeemed) ||
                         (filterStatus === 'available' && !coupon.redeemed);
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Statistics
  const totalCoupons = couponsData?.length || 0;
  const redeemedCoupons = couponsData?.filter(coupon => coupon.redeemed).length || 0;
  const availableCoupons = totalCoupons - redeemedCoupons;
  const totalValue = couponsData?.reduce((sum, coupon) => sum + coupon.value, 0) || 0;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load coupons. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <CouponIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              Live Coupons Dashboard
            </Typography>
          </Box>
          
          {/* Generate Coupons Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowGenerateDialog(true)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 'bold'
            }}
          >
            Generate Coupons
          </Button>
        </Box>
        
        {/* Statistics */}
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                {totalCoupons}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Total Coupons
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                {availableCoupons}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Available
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h3" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                {redeemedCoupons}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Redeemed
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                {totalValue}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Total Value
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Search and Filter */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by coupon code or value..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1}>
              <Chip
                label="All"
                color={filterStatus === 'all' ? 'primary' : 'default'}
                onClick={() => setFilterStatus('all')}
                clickable
              />
              <Chip
                label="Available"
                color={filterStatus === 'available' ? 'success' : 'default'}
                onClick={() => setFilterStatus('available')}
                clickable
              />
              <Chip
                label="Redeemed"
                color={filterStatus === 'redeemed' ? 'error' : 'default'}
                onClick={() => setFilterStatus('redeemed')}
                clickable
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Info */}
      <Box mb={2}>
        <Typography variant="h6" color="text.secondary">
          Showing {filteredCoupons.length} of {totalCoupons} coupons
        </Typography>
      </Box>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <CouponIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No coupons found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Try adjusting your search or filter criteria
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredCoupons.map((coupon) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={coupon._id}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  border: coupon.redeemed ? '2px solid #f44336' : '2px solid #4caf50',
                  position: 'relative',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                {/* Status Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1
                  }}
                >
                  {coupon.redeemed ? (
                    <Chip
                      icon={<CancelIcon />}
                      label="Redeemed"
                      size="small"
                      color="error"
                      variant="filled"
                    />
                  ) : (
                    <Chip
                      icon={<CheckIcon />}
                      label="Available"
                      size="small"
                      color="success"
                      variant="filled"
                    />
                  )}
                </Box>

                <CardContent sx={{ pt: 5 }}>
                  {/* Coupon Code */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        color: coupon.redeemed ? 'text.disabled' : 'primary.main',
                        flexGrow: 1
                      }}
                    >
                      {coupon.code}
                    </Typography>
                    <Tooltip title="Copy code">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(coupon.code)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Value */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Value:
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: coupon.redeemed ? 'text.disabled' : 'success.main'
                      }}
                    >
                      {coupon.value} Orbits
                    </Typography>
                  </Box>

                  {/* Created Date */}
                  <Box display="flex" alignItems="center" mb={1}>
                    <DateIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Created: {formatDate(coupon.createdAt)}
                    </Typography>
                  </Box>

                  {/* Updated Date (if different from created) */}
                  {coupon.updatedAt !== coupon.createdAt && (
                    <Box display="flex" alignItems="center">
                      <DateIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Updated: {formatDate(coupon.updatedAt)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Generate Coupons Dialog */}
      <Dialog
        open={showGenerateDialog}
        onClose={() => {
          if (!isGenerating) {
            setShowGenerateDialog(false);
            resetForm();
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '8px'
          }
        }}
        disableEscapeKeyDown={isGenerating}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <SettingsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Generate New Coupons
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Configure the parameters for coupon generation
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          {/* Loading Progress */}
          {isGenerating && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: 'primary.50'
                }} 
              />
              <Typography 
                variant="body2" 
                color="primary.main" 
                textAlign="center" 
                mt={1}
                fontWeight="medium"
              >
                Generating coupons... Please wait
              </Typography>
            </Box>
          )}

          <Stack spacing={3}>
            {/* Tier Key Selection */}
            <FormControl fullWidth error={!!formErrors.tierKey}>
              <InputLabel id="tier-select-label">Tier Key</InputLabel>
              <Select
                labelId="tier-select-label"
                value={generationForm.tierKey}
                label="Tier Key"
                onChange={(e) => handleFormChange('tierKey', e.target.value)}
                disabled={isGenerating}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="H">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip label="H" size="small" color="error" />
                    <Typography>High Tier (Premium Rewards)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="M">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip label="M" size="small" color="warning" />
                    <Typography>Medium Tier (Standard Rewards)</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="L">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip label="L" size="small" color="success" />
                    <Typography>Low Tier (Basic Rewards)</Typography>
                  </Box>
                </MenuItem>
              </Select>
              {formErrors.tierKey && (
                <FormHelperText>{formErrors.tierKey}</FormHelperText>
              )}
            </FormControl>

            {/* Count Input */}
            <TextField
              fullWidth
              label="Number of Coupons"
              type="number"
              value={generationForm.count}
              onChange={(e) => handleFormChange('count', parseInt(e.target.value) || '')}
              error={!!formErrors.count}
              helperText={formErrors.count || 'How many coupons to generate (1-100)'}
              disabled={isGenerating}
              inputProps={{ 
                min: 1, 
                max: 100,
                step: 1
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            {/* Preview Info */}
            {generationForm.tierKey && generationForm.count > 0 && (
              <Box 
                sx={{ 
                  backgroundColor: 'primary.50', 
                  p: 2.5, 
                  borderRadius: 2, 
                  border: '1px solid',
                  borderColor: 'primary.200'
                }}
              >
                <Typography variant="body2" color="primary.main" fontWeight="medium" mb={1}>
                  📋 Generation Preview:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Tier:</strong> {generationForm.tierKey} ({
                    generationForm.tierKey === 'H' ? 'High - Premium Rewards' :
                    generationForm.tierKey === 'M' ? 'Medium - Standard Rewards' :
                    'Low - Basic Rewards'
                  })
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Count:</strong> {generationForm.count} coupon{generationForm.count > 1 ? 's' : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Format:</strong> {generationForm.tierKey}-[BATCH]-[SERIAL]-[HASH]
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 2 }}>
          <Button
            onClick={() => {
              setShowGenerateDialog(false);
              resetForm();
            }}
            variant="outlined"
            disabled={isGenerating}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              py: 1,
              minWidth: 100
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateCoupons}
            variant="contained"
            disabled={isGenerating || !generationForm.tierKey || !generationForm.count}
            startIcon={isGenerating ? <CircularProgress size={16} /> : <GenerateIcon />}
            sx={{ 
              borderRadius: 2, 
              px: 4,
              py: 1,
              minWidth: 140,
              background: isGenerating ? undefined : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: isGenerating ? undefined : 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              }
            }}
          >
            {isGenerating ? 'Generating...' : `Generate ${generationForm.count || ''} Coupon${generationForm.count > 1 ? 's' : ''}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LiveCoupons;