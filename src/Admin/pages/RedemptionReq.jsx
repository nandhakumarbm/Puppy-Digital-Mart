import React, { useState, useMemo } from 'react';
import { Search, Clock, CheckCircle, User, Gift, Calendar } from 'lucide-react';
import { useGetAdminRedemptionsQuery } from '../../utils/apiSlice';

const RedemptionReq = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("requestDate");
    const [sortOrder, setSortOrder] = useState("desc");

    // Fetch redemption requests from API
    const { data: redemptionData, error, isLoading } = useGetAdminRedemptionsQuery();

    // Transform API response to match component structure
    const redemptionRequests = useMemo(() => {
        if (!redemptionData || !Array.isArray(redemptionData)) return [];

        return redemptionData.map(request => ({
            id: request._id,
            userId: request.userId?._id,
            userName: request.userId?.username || 'Unknown User',
            userPhone: request.userId?.phone || 'N/A',
            rewardTitle: request.offerId?.title || 'Unknown Offer',
            rewardImage: request.offerId?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yNCAyOEwyNCAyNCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjQgMjBIMjQiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+',
            orbitsUsed: request.amount || 0,
            requestDate: request.createdAt,
            status: request.status || 'pending',
            userAddress: "Address not provided", // API doesn't include address
            description: request.offerId?.description || '',
            orbitCost: request.offerId?.orbitCost || 0
        }));
    }, [redemptionData]);

    const filteredAndSortedRequests = useMemo(() => {
        let filtered = redemptionRequests.filter((request) => {
            const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.userPhone.includes(searchTerm) ||
                request.rewardTitle.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || request.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        return filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'orbitsUsed') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (sortBy === 'requestDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [redemptionRequests, searchTerm, statusFilter, sortBy, sortOrder]);

    const handleStatusUpdate = (requestId, newStatus) => {
        alert(`Request #${requestId} status updated to: ${newStatus}`);
        // TODO: Implement actual API call to update status
        // You would typically call an update mutation here
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { backgroundColor: '#FFF3CD', color: '#856404', border: '1px solid #FFEAA7' },
            approved: { backgroundColor: '#D4EDDA', color: '#155724', border: '1px solid #C3E6CB' },
            rejected: { backgroundColor: '#F8D7DA', color: '#721C24', border: '1px solid #F5C6CB' }
        };

        const icons = {
            pending: <Clock size={12} style={{ marginRight: '4px' }} />,
            approved: <CheckCircle size={12} style={{ marginRight: '4px' }} />,
            rejected: <User size={12} style={{ marginRight: '4px' }} />
        };

        return (
            <span style={{
                ...statusBadgeStyle,
                ...styles[status]
            }}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div style={containerStyle}>
                <div style={maxWidthStyle}>
                    <div style={loadingStyle}>
                        <Gift size={48} style={{ color: 'var(--secondary-text)' }} />
                        <p>Loading redemption requests...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={containerStyle}>
                <div style={maxWidthStyle}>
                    <div style={errorStyle}>
                        <p style={errorTitleStyle}>Error loading redemption requests</p>
                        <p style={errorSubtitleStyle}>
                            {error?.data?.message || error?.message || 'Failed to fetch redemption requests'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const pendingCount = redemptionRequests.filter(req => req.status === 'pending').length;
    const approvedCount = redemptionRequests.filter(req => req.status === 'approved').length;
    const rejectedCount = redemptionRequests.filter(req => req.status === 'rejected').length;

    return (
        <div style={containerStyle}>
            <div style={maxWidthStyle}>
                {/* Header */}
                <div style={headerSectionStyle}>
                    <h1 style={titleStyle}>Redemption Requests</h1>
                    <p style={subtitleStyle}>Manage and approve user reward redemption requests</p>
                </div>

                {/* Stats Cards */}
                <div style={statsGridStyle}>
                    <div style={statCardStyle}>
                        <div style={statContentStyle}>
                            <div>
                                <p style={statLabelStyle}>Pending Requests</p>
                                <p style={{ ...statValueStyle, color: 'var(--accent-secondary)' }}>{pendingCount}</p>
                            </div>
                            <div style={{ ...iconWrapperStyle, backgroundColor: '#FFF3CD' }}>
                                <Clock style={{ color: '#856404' }} size={24} />
                            </div>
                        </div>
                    </div>

                    <div style={statCardStyle}>
                        <div style={statContentStyle}>
                            <div>
                                <p style={statLabelStyle}>Approved Requests</p>
                                <p style={{ ...statValueStyle, color: '#16a34a' }}>{approvedCount}</p>
                            </div>
                            <div style={{ ...iconWrapperStyle, backgroundColor: '#D4EDDA' }}>
                                <CheckCircle style={{ color: '#155724' }} size={24} />
                            </div>
                        </div>
                    </div>

                    <div style={statCardStyle}>
                        <div style={statContentStyle}>
                            <div>
                                <p style={statLabelStyle}>Total Requests</p>
                                <p style={{ ...statValueStyle, color: 'var(--accent-primary)' }}>{redemptionRequests.length}</p>
                            </div>
                            <div style={{ ...iconWrapperStyle, backgroundColor: '#E3F2FD' }}>
                                <Gift style={{ color: 'var(--accent-primary)' }} size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div style={filterSectionStyle}>
                    <div style={filterContentStyle}>
                        <div style={searchWrapperStyle}>
                            <div style={searchInputWrapperStyle}>
                                <Search style={searchIconStyle} size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by user name, phone, or reward..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={searchInputStyle}
                                />
                            </div>
                        </div>

                        <div style={buttonGroupStyle}>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={selectStyle}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={selectStyle}
                            >
                                <option value="requestDate">Sort by Date</option>
                                <option value="userName">Sort by User</option>
                                <option value="orbitsUsed">Sort by Orbits</option>
                            </select>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                style={filterButtonStyle}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div style={tableWrapperStyle}>
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead style={tableHeaderStyle}>
                                <tr>
                                    <th style={thStyle}>Request Details</th>
                                    <th style={thStyle} onClick={() => handleSort('userName')}>
                                        User Info
                                        {sortBy === 'userName' && (
                                            <span style={sortIndicatorStyle}>
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th style={thStyle} onClick={() => handleSort('orbitsUsed')}>
                                        Orbits Used
                                        {sortBy === 'orbitsUsed' && (
                                            <span style={sortIndicatorStyle}>
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th style={thStyle} onClick={() => handleSort('requestDate')}>
                                        Request Date
                                        {sortBy === 'requestDate' && (
                                            <span style={sortIndicatorStyle}>
                                                {sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                            </thead>
                            <tbody style={tbodyStyle}>
                                {filteredAndSortedRequests.length > 0 ? (
                                    filteredAndSortedRequests.map((request) => (
                                        <tr key={request.id} style={trStyle}>
                                            <td style={tdStyle}>
                                                <div style={requestCellStyle}>
                                                    <div style={rewardImageStyle}>
                                                        <img
                                                            src={request.rewardImage}
                                                            alt={request.rewardTitle}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                            onError={(e) => {
                                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yNCAyOEwyNCAyNCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjQgMjBIMjQiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                                                                e.target.onerror = null; // Prevent infinite loop
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p style={rewardTitleStyle}>{request.rewardTitle}</p>
                                                        <p style={requestIdStyle}>Request #{request.id.slice(-8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={userCellStyle}>
                                                    <div style={avatarStyle}>
                                                        {request.userName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p style={userNameStyle}>{request.userName}</p>
                                                        <p style={userPhoneStyle}>{request.userPhone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={orbitsCellStyle}>
                                                    <Gift size={16} style={{ color: 'var(--success-currency)' }} />
                                                    <span style={orbitsValueStyle}>{request.orbitsUsed}</span>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={dateCellStyle}>
                                                    <Calendar size={14} style={{ color: 'var(--secondary-text)' }} />
                                                    <span>{formatDate(request.requestDate)}</span>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                {getStatusBadge(request.status)}
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={actionsCellStyle}>
                                                    {request.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(request.id, 'approved')}
                                                                style={{ ...actionButtonStyle, backgroundColor: '#16a34a', marginRight: '8px' }}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                                                style={{ ...actionButtonStyle, backgroundColor: '#dc2626' }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={approvedLabelStyle}>
                                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={emptyStateStyle}>
                                            <div style={emptyContentStyle}>
                                                <Gift size={48} style={{ color: '#d1d5db' }} />
                                                <p style={emptyTitleStyle}>No redemption requests found</p>
                                                <p style={emptySubtitleStyle}>
                                                    {searchTerm || statusFilter !== 'all'
                                                        ? 'Try adjusting your search or filter criteria'
                                                        : 'No redemption requests have been made yet'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div style={footerStyle}>
                    <p>Showing {filteredAndSortedRequests.length} of {redemptionRequests.length} requests</p>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

// Styles using CSS variables
const containerStyle = {
    backgroundColor: 'var(--background)',
    padding: '24px',
    fontFamily: 'var(--font-family)'
};

const maxWidthStyle = {
    maxWidth: '1400px',
    margin: '0 auto'
};

const headerSectionStyle = {
    marginBottom: '32px'
};

const titleStyle = {
    fontSize: '32px',
    fontWeight: '600',
    color: 'var(--primary-text)',
    margin: '0 0 8px 0'
};

const subtitleStyle = {
    color: 'var(--secondary-text)',
    margin: '0',
    fontSize: '16px'
};

const loadingStyle = {
    backgroundColor: 'var(--card-background)',
    padding: '48px',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    textAlign: 'center',
    color: 'var(--secondary-text)',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
};

const errorStyle = {
    backgroundColor: 'var(--card-background)',
    padding: '48px',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    textAlign: 'center'
};

const errorTitleStyle = {
    color: 'var(--primary-text)',
    fontWeight: '500',
    margin: '0 0 8px 0',
    fontSize: '18px'
};

const errorSubtitleStyle = {
    color: 'var(--secondary-text)',
    fontSize: '14px',
    margin: '0'
};

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
};

const statCardStyle = {
    backgroundColor: 'var(--card-background)',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const statContentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
};

const statLabelStyle = {
    fontSize: '14px',
    color: 'var(--secondary-text)',
    marginBottom: '4px',
    margin: '0 0 4px 0'
};

const statValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--primary-text)',
    margin: '0'
};

const iconWrapperStyle = {
    padding: '12px',
    borderRadius: '8px'
};

const filterSectionStyle = {
    backgroundColor: 'var(--card-background)',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    marginBottom: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const filterContentStyle = {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
};

const searchWrapperStyle = {
    flex: '1',
    maxWidth: '400px'
};

const searchInputWrapperStyle = {
    position: 'relative',
    width: '100%'
};

const searchIconStyle = {
    position: 'absolute',
    left: '12px',
    top: '12px',
    color: 'var(--secondary-text)'
};

const searchInputStyle = {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid var(--input-border)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-family)',
    backgroundColor: 'var(--card-background)',
    color: 'var(--primary-text)'
};

const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
};

const selectStyle = {
    padding: '10px 16px',
    border: '1px solid var(--input-border)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'var(--card-background)',
    color: 'var(--primary-text)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)'
};

const filterButtonStyle = {
    padding: '10px 16px',
    border: '1px solid var(--input-border)',
    borderRadius: '8px',
    backgroundColor: 'var(--card-background)',
    color: 'var(--primary-text)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
};

const tableWrapperStyle = {
    backgroundColor: 'var(--card-background)',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const tableContainerStyle = {
    overflowX: 'auto'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const tableHeaderStyle = {
    backgroundColor: 'var(--background)'
};

const thStyle = {
    textAlign: 'left',
    padding: '16px 20px',
    fontWeight: '600',
    color: 'var(--primary-text)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: '1px solid var(--card-border)',
    fontSize: '14px'
};

const sortIndicatorStyle = {
    color: 'var(--accent-primary)',
    marginLeft: '4px',
    fontWeight: 'bold'
};

const tbodyStyle = {
    backgroundColor: 'var(--card-background)'
};

const trStyle = {
    transition: 'all 0.2s ease',
    borderBottom: '1px solid var(--card-border)'
};

const tdStyle = {
    padding: '16px 20px',
    color: 'var(--primary-text)',
    verticalAlign: 'top'
};

const requestCellStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};

const rewardImageStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '1px solid var(--card-border)'
};

const rewardTitleStyle = {
    fontWeight: '500',
    color: 'var(--primary-text)',
    margin: '0 0 2px 0',
    fontSize: '14px'
};

const requestIdStyle = {
    fontSize: '12px',
    color: 'var(--secondary-text)',
    margin: '0'
};

const userCellStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};

const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--button-text)',
    fontWeight: '600',
    fontSize: '14px'
};

const userNameStyle = {
    fontWeight: '500',
    color: 'var(--primary-text)',
    margin: '0 0 2px 0',
    fontSize: '14px'
};

const userPhoneStyle = {
    fontSize: '12px',
    color: 'var(--secondary-text)',
    margin: '0',
    fontFamily: 'monospace'
};

const orbitsCellStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const orbitsValueStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--success-currency)'
};

const dateCellStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--secondary-text)'
};

const statusBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500'
};

const actionsCellStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
};

const actionButtonStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const approvedLabelStyle = {
    color: '#16a34a',
    fontSize: '12px',
    fontWeight: '500',
    padding: '6px 12px'
};

const emptyStateStyle = {
    padding: '48px 0',
    textAlign: 'center'
};

const emptyContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
};

const emptyTitleStyle = {
    color: 'var(--secondary-text)',
    fontWeight: '500',
    margin: '0',
    fontSize: '16px'
};

const emptySubtitleStyle = {
    color: 'var(--secondary-text)',
    fontSize: '14px',
    margin: '0',
    opacity: '0.7'
};

const footerStyle = {
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'var(--secondary-text)',
    flexWrap: 'wrap',
    gap: '16px'
};

export default RedemptionReq;