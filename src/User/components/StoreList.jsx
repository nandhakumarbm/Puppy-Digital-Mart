import React from 'react';
import { useGetStoresQuery } from '../../utils/apiSlice';

const StoreList = () => {
  const { data: stores, error, isLoading } = useGetStoresQuery();

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    },
    header: {
      marginBottom: '24px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
      margin: '0'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      color: '#6b7280'
    },
    errorContainer: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      color: '#dc2626',
      textAlign: 'center'
    },
    noStoresContainer: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6b7280'
    },
    storeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    storeCard: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    storeCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    storeImageContainer: {
      width: '100%',
      height: '150px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '16px',
      backgroundColor: '#f3f4f6'
    },
    storeImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    storeName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px'
    },
    storeDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#6b7280'
    },
    icon: {
      fontSize: '16px'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      marginTop: '12px'
    },
    activeBadge: {
      backgroundColor: '#dcfce7',
      color: '#15803d'
    },
    inactiveBadge: {
      backgroundColor: '#fef2f2',
      color: '#dc2626'
    },
    dateText: {
      fontSize: '12px',
      color: '#9ca3af',
      marginTop: '8px'
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStoreCardHover = (e, isHover) => {
    if (isHover) {
      Object.assign(e.target.style, styles.storeCardHover);
    } else {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Loading stores...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h3>Error loading stores</h3>
          <p>{error.message || 'Something went wrong while fetching stores.'}</p>
        </div>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Store Management</h1>
          <p style={styles.subtitle}>Manage all your stores from here</p>
        </div>
        <div style={styles.noStoresContainer}>
          <h3>No stores found</h3>
          <p>There are currently no stores in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Store Management</h1>
        <p style={styles.subtitle}>
          {stores.length} store{stores.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div style={styles.storeGrid}>
        {stores.map((store) => (
          <div
            key={store._id}
            style={styles.storeCard}
            onMouseEnter={(e) => handleStoreCardHover(e, true)}
            onMouseLeave={(e) => handleStoreCardHover(e, false)}
          >
            {store.storeImgUrl && (
              <div style={styles.storeImageContainer}>
                <img
                  src={store.storeImgUrl}
                  alt={store.storeName}
                  style={styles.storeImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.backgroundColor = '#f3f4f6';
                    e.target.parentNode.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af;">No Image</div>';
                  }}
                />
              </div>
            )}

            <h3 style={styles.storeName}>{store.storeName}</h3>

            <div style={styles.storeDetails}>
              <div style={styles.detailRow}>
                <span style={styles.icon}>📍</span>
                <span>{store.address}</span>
              </div>
              
              <div style={styles.detailRow}>
                <span style={styles.icon}>📞</span>
                <span>{store.phoneNo}</span>
              </div>
            </div>

            <div
              style={{
                ...styles.statusBadge,
                ...(store.isActive ? styles.activeBadge : styles.inactiveBadge)
              }}
            >
              <span>{store.isActive ? '✅' : '❌'}</span>
              <span>{store.isActive ? 'Active' : 'Inactive'}</span>
            </div>

            <div style={styles.dateText}>
              Created: {formatDate(store.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;