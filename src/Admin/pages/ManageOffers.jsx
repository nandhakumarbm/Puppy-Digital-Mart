import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle, Gift, Trash2, Eye } from 'lucide-react';
import {
    useCreateOfferMutation,
    useGetAllOffersQuery,
    useDeleteOfferMutation
} from '../../utils/apiSlice';

const ManageOffers = () => {
    // API hooks
    const [createOffer, { isLoading: isCreatingOffer }] = useCreateOfferMutation();
    const [deleteOffer, { isLoading: isDeletingOffer }] = useDeleteOfferMutation();
    const { data: allOffers = [], isLoading: isLoadingOffers, refetch: refetchOffers } = useGetAllOffersQuery();

    // Filter only active offers
    const offers = allOffers.filter(offer => offer.isActive === true).reverse();

    // Form state
    const [offerForm, setOfferForm] = useState({
        title: '',
        description: '',
        orbitCost: '',
        imageUrl: ''
    });

    // UI state
    const [notification, setNotification] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: '', title: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Create offer function
    const createOfferHandler = async () => {
        // Validation
        if (!offerForm.title.trim()) {
            showNotification('Please enter an offer title', 'error');
            return;
        }
        if (!offerForm.description.trim()) {
            showNotification('Please enter a description', 'error');
            return;
        }
        if (!offerForm.orbitCost || isNaN(offerForm.orbitCost) || parseFloat(offerForm.orbitCost) <= 0) {
            showNotification('Please enter a valid orbit cost', 'error');
            return;
        }
        if (!offerForm.imageUrl.trim()) {
            showNotification('Please enter an image URL', 'error');
            return;
        }

        // URL validation
        if (!isValidUrl(offerForm.imageUrl)) {
            showNotification('Please enter a valid image URL', 'error');
            return;
        }

        try {
            const offerData = {
                title: offerForm.title.trim(),
                description: offerForm.description.trim(),
                orbitCost: parseFloat(offerForm.orbitCost),
                imageUrl: offerForm.imageUrl.trim()
            };

            await createOffer(offerData).unwrap();

            // Reset form on success
            setOfferForm({
                title: '',
                description: '',
                orbitCost: '',
                imageUrl: ''
            });

            showNotification('Offer created successfully');
            refetchOffers();
        } catch (error) {
            const errorMessage = error?.data?.message || error?.message || 'Failed to create offer';
            showNotification(errorMessage, 'error');
        }
    };

    // Delete offer function
    const handleDeleteOffer = async (offerId) => {
        try {
            const res = await deleteOffer({ offerId }).unwrap();

            console.log(res);
            showNotification('Offer deleted successfully');
            refetchOffers();
            setDeleteConfirm({ show: false, id: '', title: '' });
        } catch (error) {
            const errorMessage = error?.data?.message || error?.message || 'Failed to delete offer';
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
                            <h3 style={modalTitleStyle}>Confirm Delete</h3>
                            <p style={modalTextStyle}>
                                Are you sure you want to delete this offer "{deleteConfirm.title}"?
                            </p>
                            <div style={modalButtonsStyle}>
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, id: '', title: '' })}
                                    style={cancelButtonStyle}
                                    disabled={isDeletingOffer}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteOffer(deleteConfirm.id)}
                                    style={deleteButtonStyle}
                                    disabled={isDeletingOffer}
                                >
                                    {isDeletingOffer ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Offer Form */}
                <div style={cardStyle}>
                    <div style={contentStyle}>
                        <h2 style={sectionTitleStyle}>
                            <Gift size={24} />
                            Create New Offer
                        </h2>

                        <div style={formGridStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Title *</label>
                                <input
                                    type="text"
                                    value={offerForm.title}
                                    onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter offer title"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Orbit Cost *</label>
                                <input
                                    type="number"
                                    value={offerForm.orbitCost}
                                    onChange={(e) => setOfferForm(prev => ({ ...prev, orbitCost: e.target.value }))}
                                    placeholder="Enter orbit cost"
                                    style={inputStyle}
                                    min="1"
                                    step="1"
                                />
                            </div>

                            <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Description *</label>
                                <textarea
                                    value={offerForm.description}
                                    onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter offer description"
                                    style={textareaStyle}
                                    rows={3}
                                />
                            </div>

                            <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Image URL *</label>
                                <input
                                    type="url"
                                    value={offerForm.imageUrl}
                                    onChange={(e) => setOfferForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    placeholder="https://example.com/image.jpg"
                                    style={{
                                        ...inputStyle,
                                        borderColor: offerForm.imageUrl && !isValidUrl(offerForm.imageUrl) ? '#EF4444' : 'var(--input-border)'
                                    }}
                                />
                                {offerForm.imageUrl && !isValidUrl(offerForm.imageUrl) && (
                                    <p style={errorTextStyle}>Please enter a valid URL</p>
                                )}
                            </div>

                            {/* Image Preview */}
                            {offerForm.imageUrl && isValidUrl(offerForm.imageUrl) && (
                                <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Image Preview</label>
                                    <div style={previewContainerStyle}>
                                        <img
                                            src={offerForm.imageUrl}
                                            alt="Offer preview"
                                            style={previewImageStyle}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={createOfferHandler}
                                disabled={isCreatingOffer}
                                style={{
                                    ...primaryButtonStyle,
                                    gridColumn: '1 / -1',
                                    opacity: isCreatingOffer ? 0.7 : 1,
                                    cursor: isCreatingOffer ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isCreatingOffer ? (
                                    <>
                                        <div style={spinnerStyle}></div>
                                        Creating Offer...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Create Offer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Offers List */}
                <div style={cardStyle}>
                    <div style={contentStyle}>
                        <div style={sectionHeaderStyle}>
                            <h2 style={sectionTitleStyle}>
                                <Eye size={24} />
                                Active Offers ({offers.length})
                            </h2>
                            <div style={showingActiveStyle}>
                                <span style={activeIndicatorStyle}>●</span>
                                Showing only active ads
                            </div>
                        </div>

                        {isLoadingOffers ? (
                            <div style={loadingStyle}>Loading offers...</div>
                        ) : offers.length === 0 ? (
                            <div style={emptyStateStyle}>
                                <Gift size={48} style={{ color: 'var(--secondary-text)' }} />
                                <p>No active offers found</p>
                                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                                    {allOffers.length > 0 ?
                                        `${allOffers.length} total offers, but none are active` :
                                        'No offers created yet'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div style={offersGridStyle}>
                                {offers.map((offer) => (
                                    <div key={offer._id} style={offerCardStyle}>
                                        <div style={offerImageContainerStyle}>
                                            <img
                                                src={offer.imageUrl}
                                                alt={offer.title}
                                                style={offerImageStyle}
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBDOTQuNDc3MiA4MCA5MCA4NC40NzcyIDkwIDkwQzkwIDk1LjUyMjggOTQuNDc3MiAxMDAgMTAwIDEwMEMxMDUuNTIzIDEwMCAxMTAgOTUuNTIyOCAxMTAgOTBDMTEwIDg0LjQ3NzIgMTA1LjUyMyA4MCAxMDAgODBaIiBmaWxsPSIjOUI5Qzk4Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzk0LjQ3NzIgMTIwIDkwIDEyNC40NzcgOTAgMTMwQzkwIDEzNS41MjMgOTQuNDc3MiAxNDAgMTAwIDE0MEMxMDUuNTIzIDE0MCAxMTAgMTM1LjUyMyAxMTAgMTMwQzExMCAxMjQuNDc3IDEwNS41MjMgMTIwIDEwMCAxMjBaIiBmaWxsPSIjOUI5Qzk4Ii8+Cjwvc3ZnPgo=';
                                                }}
                                            />
                                        </div>
                                        <div style={offerContentStyle}>
                                            <h3 style={offerTitleStyle}>{offer.title}</h3>
                                            <p style={offerDescriptionStyle}>{offer.description}</p>
                                            <div style={offerMetaStyle}>
                                                <span style={offerCostStyle}>{offer.orbitCost} Orbits</span>
                                                <button
                                                    onClick={() => confirmDelete(offer._id, offer.title)}
                                                    style={deleteOfferButtonStyle}
                                                    title="Delete offer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
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

// Styles remain the same...
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

const offersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
};

const offerCardStyle = {
    border: '1px solid var(--card-border)',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'var(--background)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const offerImageContainerStyle = {
    height: '160px',
    overflow: 'hidden',
    position: 'relative'
};

const activeBadgeStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#10B981',
    borderRadius: '16px',
    padding: '4px 12px',
    zIndex: 2
};

const activeBadgeTextStyle = {
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
};

const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
};

const showingActiveStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #D1FAE5'
};

const activeIndicatorStyle = {
    color: '#10B981',
    fontSize: '8px'
};

const offerActionsStyle = {
    borderTop: '1px solid var(--card-border)',
    paddingTop: '12px',
    marginTop: '12px'
};

const actionButtonsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px'
};

const viewMediaButtonStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#EBF4FF',
    color: '#3B82F6',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
};

const createdDateStyle = {
    fontSize: '12px',
    color: 'var(--secondary-text)',
    margin: '8px 0 0 0',
    fontStyle: 'italic'
};

const offerImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const offerContentStyle = {
    padding: '16px'
};

const offerTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--primary-text)',
    margin: '0 0 8px 0'
};

const offerDescriptionStyle = {
    fontSize: '14px',
    color: 'var(--secondary-text)',
    margin: '0 0 12px 0',
    lineHeight: '1.4'
};

const offerMetaStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
};

const offerCostStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--accent-primary)'
};

const deleteOfferButtonStyle = {
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

export default ManageOffers;