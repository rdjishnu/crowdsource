import React from 'react';
import { Eye, Edit3, MapPin, ExternalLink, Calendar } from 'lucide-react';
import { getImageUrl } from '../services/api';

const IssueTable = ({
  issues = [],
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  onOpenImageModal,
  onOpenStatusModal,
  loading
}) => {
  const categories = ['All', 'Pothole', 'Garbage', 'Streetlight', 'Water Leak', 'Sewage'];
  const statuses = ['All', 'Reported', 'In Progress', 'Resolved', 'Rejected'];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Reported': return 'reported';
      case 'In Progress': return 'in-progress';
      case 'Resolved': return 'resolved';
      case 'Rejected': return 'rejected';
      default: return 'reported';
    }
  };

  return (
    <div className="card-section">
      <div className="section-header">
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Civic Complaints Register</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Real-time citizen submitted reports and action workflows
          </p>
        </div>

        <div className="filters-row">
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '6px' }}>Category:</span>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '6px' }}>Status:</span>
            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID & Photo</th>
              <th>Category</th>
              <th>Description</th>
              <th>GPS Location</th>
              <th>Reported On</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  Loading issues database...
                </td>
              </tr>
            ) : issues.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No civic issues found matching the selected filters.
                </td>
              </tr>
            ) : (
              issues.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={getImageUrl(issue.photoPath)}
                        alt={`Thumbnail #${issue.id}`}
                        className="image-preview-thumb"
                        onClick={() => onOpenImageModal(issue)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80?text=Photo';
                        }}
                      />
                      <span style={{ fontWeight: 700, color: 'var(--primary-500)' }}>#{issue.id}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{issue.category}</span>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'var(--text-muted)',
                      fontSize: '0.88rem'
                    }} title={issue.description}>
                      {issue.description}
                    </div>
                  </td>
                  <td>
                    <a
                      href={`https://maps.google.com/?q=${issue.latitude},${issue.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--accent-cyan)',
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      <MapPin size={14} />
                      {issue.latitude?.toFixed(4)}, {issue.longitude?.toFixed(4)}
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      {formatDate(issue.createdAt)}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(issue.status)}`}>
                      ● {issue.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        title="View Photo"
                        onClick={() => onOpenImageModal(issue)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        onClick={() => onOpenStatusModal(issue)}
                      >
                        <Edit3 size={14} />
                        Update Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueTable;
