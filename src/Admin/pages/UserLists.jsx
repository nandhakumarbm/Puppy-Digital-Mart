import React, { useState, useMemo } from "react";
import { Search, Phone, Wallet } from "lucide-react";

function UserLists() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const users = [
        { id: 1, name: "Arun Kumar", phone: "9876543210", wallet: 1200 },
        { id: 2, name: "Priya Sharma", phone: "9876501234", wallet: 800 },
        { id: 3, name: "Ravi Raj", phone: "9123456780", wallet: 1500 },
        { id: 4, name: "Sneha Patel", phone: "9988776655", wallet: 600 },
        { id: 5, name: "Karthik", phone: "9090909090", wallet: 2200 },
    ];

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
    }, [searchTerm, sortBy, sortOrder]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <div style={containerStyle}>
            <div style={maxWidthStyle}>

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
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p style={userNameStyle}>{user.name}</p>
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
                                                <p style={emptySubtitleStyle}>Try adjusting your search criteria</p>
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

export default UserLists;