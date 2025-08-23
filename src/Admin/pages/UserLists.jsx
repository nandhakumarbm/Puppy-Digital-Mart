import React, { useState, useMemo } from "react";
import { Search, Phone, Wallet } from "lucide-react";
import { useGetAllUsersQuery } from "../../utils/apiSlice";

function UserLists() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // Fetch users from API
    const { data: usersData, error, isLoading } = useGetAllUsersQuery();

    // Transform API response to match component structure
    const users = useMemo(() => {
        if (!usersData || !Array.isArray(usersData)) return [];

        return usersData.map(user => ({
            id: user._id,
            name: user.username,
            phone: user.phone,
            wallet: user.walletId?.walletBalance || 0
        }));
    }, [usersData]);

    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users.filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm)
        );

        return filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'wallet') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [users, searchTerm, sortBy, sortOrder]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div style={containerStyle}>
                <div style={maxWidthStyle}>
                    <div style={loadingStyle}>
                        <p>Loading users...</p>
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
                        <p style={errorTitleStyle}>Error loading users</p>
                        <p style={errorSubtitleStyle}>
                            {error?.data?.message || error?.message || 'Failed to fetch users'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={maxWidthStyle}>
                {/* Header */}
                <div style={headerStyle}>
                    <h1 style={titleStyle}>User Management</h1>
                    <p style={subtitleStyle}>Manage and view all registered users</p>
                </div>

                {/* Search */}
                <div style={filterSectionStyle}>
                    <div style={searchWrapperStyle}>
                        <div style={searchInputWrapperStyle}>
                            <Search style={searchIconStyle} size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or phone number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={searchInputStyle}
                            />
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div style={tableWrapperStyle}>
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead style={tableHeaderStyle}>
                                <tr>
                                    <th
                                        style={thStyle}
                                        onClick={() => handleSort('name')}
                                    >
                                        <div style={thContentStyle}>
                                            Name
                                            {sortBy === 'name' && (
                                                <span style={sortIndicatorStyle}>
                                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th style={thStyle}>
                                        <div style={thContentStyle}>
                                            <Phone size={16} />
                                            <span style={{ marginLeft: '8px' }}>Phone Number</span>
                                        </div>
                                    </th>
                                    <th
                                        style={thStyle}
                                        onClick={() => handleSort('wallet')}
                                    >
                                        <div style={thContentStyle}>
                                            <Wallet size={16} />
                                            <span style={{ marginLeft: '8px' }}>Wallet Balance</span>
                                            {sortBy === 'wallet' && (
                                                <span style={sortIndicatorStyle}>
                                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={tbodyStyle}>
                                {filteredAndSortedUsers.length > 0 ? (
                                    filteredAndSortedUsers.map((user) => (
                                        <tr key={user.id} style={trStyle}>
                                            <td style={tdStyle}>
                                                <div style={userCellStyle}>
                                                    <div style={avatarStyle}>
                                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <p style={userNameStyle}>{user.name || 'Unknown User'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={phoneCellStyle}>
                                                    {user.phone}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={balanceCellStyle}>
                                                    <span style={balanceStyle}>
                                                        ₹{user.wallet.toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={emptyStateStyle}>
                                            <div style={emptyContentStyle}>
                                                <p style={emptyTitleStyle}>No users found</p>
                                                <p style={emptySubtitleStyle}>
                                                    {searchTerm ? 'Try adjusting your search criteria' : 'No users registered yet'}
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
                    <p>Showing {filteredAndSortedUsers.length} of {users.length} users</p>
                </div>
            </div>
        </div>
    );
}

// Styles using your global CSS variables
const containerStyle = {
    backgroundColor: 'var(--background)',
    padding: '24px',
    fontFamily: 'var(--font-family)'
};

const maxWidthStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
};

const headerStyle = {
    marginBottom: '24px'
};

const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--primary-text)',
    margin: '0 0 8px 0'
};

const subtitleStyle = {
    fontSize: '16px',
    color: 'var(--secondary-text)',
    margin: '0'
};

const filterSectionStyle = {
    backgroundColor: 'var(--card-background)',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
};

const searchWrapperStyle = {
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

const tableWrapperStyle = {
    backgroundColor: 'var(--card-background)',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
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
    padding: '16px 24px',
    fontWeight: '600',
    color: 'var(--primary-text)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: '1px solid var(--card-border)',
    fontSize: '14px'
};

const thContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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
    borderBottom: '1px solid var(--card-border)',
    cursor: 'pointer'
};

const tdStyle = {
    padding: '16px 24px',
    color: 'var(--primary-text)'
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
    fontSize: '16px'
};

const userNameStyle = {
    fontWeight: '500',
    color: 'var(--primary-text)',
    margin: '0',
    fontSize: '15px'
};

const phoneCellStyle = {
    color: 'var(--secondary-text)',
    fontFamily: 'monospace',
    fontSize: '14px'
};

const balanceCellStyle = {
    display: 'flex',
    alignItems: 'center'
};

const balanceStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--success-currency)'
};

const emptyStateStyle = {
    padding: '48px 0',
    textAlign: 'center'
};

const emptyContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
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
    fontSize: '14px',
    color: 'var(--secondary-text)'
};

const loadingStyle = {
    backgroundColor: 'var(--card-background)',
    padding: '48px',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    textAlign: 'center',
    color: 'var(--secondary-text)',
    fontSize: '16px'
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

export default UserLists;