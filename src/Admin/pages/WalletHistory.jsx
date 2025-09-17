import React, { useState, useEffect, useMemo } from "react";
import { Search, Calendar, DollarSign, User, Phone, Tag, Download, RefreshCw } from "lucide-react";
import { useGetWalletHistoryQuery } from "../../utils/apiSlice";

function WalletHistory() {
  const { data, isLoading, isError, refetch } = useGetWalletHistoryQuery();
  const [histories, setHistories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dateRange, setDateRange] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (data && data.histories) {
      setHistories(data.histories);
    }
  }, [data]);

  const filteredHistories = useMemo(() => {
    return histories
      .filter(history => {
        const matchesSearch =
          history.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history.phone.includes(searchTerm) ||
          history.couponCode.toLowerCase().includes(searchTerm.toLowerCase());

        const transactionDate = new Date(history.timestamp);
        const now = new Date();
        let matchesDateRange = true;

        if (dateRange === "today") {
          matchesDateRange = transactionDate.toDateString() === now.toDateString();
        } else if (dateRange === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDateRange = transactionDate >= weekAgo;
        } else if (dateRange === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDateRange = transactionDate >= monthAgo;
        }

        return matchesSearch && matchesDateRange;
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [histories, searchTerm, dateRange, sortOrder]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Username', 'Phone', 'Amount', 'Date', 'Coupon Code', 'User ID', 'Wallet ID'],
      ...filteredHistories.map(history => [
        history.username,
        history.phone,
        history.amount,
        new Date(history.timestamp).toISOString(),
        history.couponCode,
        history.userId,
        history.walletId
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount);
    return amount >= 0 ? `${formatted}` : `${formatted}`;
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading wallet history...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="app-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to load wallet history</h2>
          <p>Please try again later or contact support if the problem persists.</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="wallet-history-container">
        <div className="header-section">
          <div className="title-section">
            <h1 className="page-title">
              Wallet History
            </h1>
          </div>
        </div>

        <div className="controls-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by username, phone, or coupon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <Calendar className="filter-icon" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="sort-button"
            >
              <Calendar className="sort-icon" />
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </button>
            <button
              onClick={handleRefresh}
              className="action-button refresh-button"
              disabled={isRefreshing}
            >
              <RefreshCw className={`action-icon ${isRefreshing ? 'spinning' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="action-button export-button"
              disabled={filteredHistories.length === 0}
            >
              <Download className="action-icon" />
              Export CSV
            </button>
          </div>
        </div>

        {filteredHistories.length === 0 && !isLoading && !isError ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3>No transactions found</h3>
            <p>
              {searchTerm || dateRange !== "all"
                ? "Try adjusting your search or filters"
                : "Your wallet history will appear here"}
            </p>
          </div>
        ) : (
          <>
            <div className="desktop-table">
              <table className="history-table">
                <thead>
                  <tr>
                    <th><User className="th-icon" /> Username</th>
                    <th><Phone className="th-icon" /> Phone</th>
                    <th>Orbits</th>
                    <th><Calendar className="th-icon" /> Date</th>
                    <th><Tag className="th-icon" /> Coupon Code</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistories.map((history) => (
                    <tr key={history._id} className="table-row">
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {history.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="username">{history.username}</span>
                        </div>
                      </td>
                      <td className="phone-cell">{history.phone}</td>
                      <td>
                        <span className={`amount ${history.amount >= 0 ? 'credit' : 'debit'}`}>
                          {formatAmount(history.amount)}
                        </span>
                      </td>
                      <td className="date-cell">{formatDate(history.timestamp)}</td>
                      <td>
                        <span className="coupon-badge">{history.couponCode}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-cards">
              {filteredHistories.map((history) => (
                <div key={history._id} className="transaction-card">
                  <div className="card-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        {history.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <h4 className="card-username">{history.username}</h4>
                        <p className="card-phone">{history.phone}</p>
                      </div>
                    </div>
                    <div className={`card-amount ${history.amount >= 0 ? 'credit' : 'debit'}`}>
                      {formatAmount(history.amount)}
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="card-info">
                      <Calendar className="info-icon" />
                      <span>{formatDate(history.timestamp)}</span>
                    </div>
                    <div className="card-coupon">
                      <Tag className="info-icon" />
                      <span className="coupon-text">{history.couponCode}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .wallet-history-container {
          background: var(--card-background);
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 1400px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--card-border);
        }

        .header-section {
          margin-bottom: 32px;
        }

        .title-section {
          text-align: center;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--primary-text);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          width: 32px;
          height: 32px;
          color: var(--accent-primary);
        }

        .page-subtitle {
          color: var(--secondary-text);
          font-size: 16px;
        }

        .controls-section {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: var(--secondary-text);
        }

        .search-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 2px solid var(--input-border);
          border-radius: 12px;
          font-size: 16px;
          background: var(--card-background);
          transition: all 0.2s ease;
          font-family: var(--font-family);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .filter-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-family);
        }

        .refresh-button {
          background: var(--accent-secondary);
          color: var(--button-text);
        }

        .refresh-button:hover:not(:disabled) {
          background: var(--accent-hover);
        }

        .export-button {
          background: var(--success-currency);
          color: var(--button-text);
        }

        .export-button:hover:not(:disabled) {
          background: #DAA520;
        }

        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-icon {
          width: 16px;
          height: 16px;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--background);
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid var(--card-border);
        }

        .filter-icon {
          width: 18px;
          height: 18px;
          color: var(--secondary-text);
        }

        .filter-select {
          border: none;
          background: transparent;
          font-size: 14px;
          color: var(--primary-text);
          cursor: pointer;
          font-family: var(--font-family);
        }

        .sort-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--accent-primary);
          color: var(--button-text);
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-family);
        }

        .sort-button:hover {
          background: var(--accent-hover);
        }

        .sort-icon {
          width: 16px;
          height: 16px;
        }

        .desktop-table {
          display: block;
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid var(--card-border);
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--card-background);
        }

        .history-table th {
          background: var(--background);
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          color: var(--accent-primary);
          font-size: 14px;
          border-bottom: 2px solid var(--card-border);
        }

        .th-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          vertical-align: middle;
        }

        .history-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--card-border);
          font-size: 14px;
          color: var(--primary-text);
        }

        .table-row:hover {
          background: var(--background);
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: var(--button-text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .username {
          font-weight: 500;
        }

        .phone-cell {
          color: var(--secondary-text);
        }

        .amount {
          font-weight: 600;
          font-size: 16px;
          padding: 6px 12px;
          border-radius: 6px;
        }

        .amount.credit {
          color: var(--success-currency);
          background: rgba(251, 191, 36, 0.1);
        }

        .amount.debit {
          color: #DC2626;
          background: rgba(239, 68, 68, 0.1);
        }

        .date-cell {
          color: var(--secondary-text);
          font-size: 13px;
        }

        .coupon-badge {
          background: var(--accent-secondary);
          color: var(--button-text);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .mobile-cards {
          display: none;
        }

        .transaction-card {
          background: var(--card-background);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        .transaction-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-details h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text);
        }

        .user-details p {
          margin: 2px 0 0 0;
          font-size: 14px;
          color: var(--secondary-text);
        }

        .card-amount {
          font-weight: 700;
          font-size: 18px;
        }

        .card-amount.credit {
          color: var(--success-currency);
        }

        .card-amount.debit {
          color: #DC2626;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--card-border);
        }

        .card-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--secondary-text);
        }

        .info-icon {
          width: 14px;
          height: 14px;
        }

        .card-coupon {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .coupon-text {
          background: var(--accent-secondary);
          color: var(--button-text);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--card-border);
          border-top: 4px solid var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: var(--secondary-text);
          font-size: 16px;
        }

        .error-container {
          text-align: center;
          padding: 60px 20px;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
          color: #DC2626;
        }

        .error-container h2 {
          color: var(--primary-text);
          margin-bottom: 8px;
        }

        .error-container p {
          color: var(--secondary-text);
          margin-bottom: 24px;
        }

        .retry-button {
          background: var(--accent-primary);
          color: var(--button-text);
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
          font-family: var(--font-family);
        }

        .retry-button:hover {
          background: var(--accent-hover);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          color: var(--secondary-text);
        }

        .empty-state h3 {
          color: var(--primary-text);
          margin-bottom: 8px;
        }

        .empty-state p {
          color: var(--secondary-text);
        }

        @media (max-width: 1024px) {
          .wallet-history-container {
            padding: 24px;
          }

          .controls-section {
            flex-direction: column;
          }

          .search-container {
            min-width: 100%;
          }

          .filter-controls {
            justify-content: space-between;
          }
        }

        @media (max-width: 768px) {
          .wallet-history-container {
            margin: 16px;
            padding: 20px;
          }

          .page-title {
            font-size: 24px;
          }

          .title-icon {
            width: 24px;
            height: 24px;
          }

          .desktop-table {
            display: none;
          }

          .mobile-cards {
            display: block;
          }

          .filter-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .sort-button {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .wallet-history-container {
            margin: 12px;
            padding: 16px;
          }

          .page-title {
            font-size: 20px;
            flex-direction: column;
            gap: 8px;
          }

          .search-container {
            min-width: auto;
          }

          .search-input {
            padding: 12px 16px 12px 44px;
            font-size: 14px;
          }

          .transaction-card {
            padding: 12px;
          }

          .user-info {
            gap: 8px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .user-details h4 {
            font-size: 14px;
          }

          .user-details p {
            font-size: 12px;
          }

          .card-amount {
            font-size: 16px;
          }

          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default WalletHistory;   