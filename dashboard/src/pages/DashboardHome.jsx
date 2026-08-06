import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import IssueTable from '../components/IssueTable';
import MapWidget from '../components/MapWidget';
import StatusModal from '../components/StatusModal';
import ImageModal from '../components/ImageModal';
import { fetchIssues, fetchStats, updateIssueStatus } from '../services/api';
import { RefreshCw } from 'lucide-react';

const DashboardHome = ({ searchTerm }) => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [activeImageModal, setActiveImageModal] = useState(null);
  const [activeStatusModal, setActiveStatusModal] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchTerm) params.search = searchTerm;

      const [issuesData, statsData] = await Promise.all([
        fetchIssues(params),
        fetchStats()
      ]);

      setIssues(issuesData.content || issuesData || []);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus, searchTerm]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateIssueStatus(id, newStatus);
      await loadData();
    } catch (err) {
      alert('Failed to update status. Make sure backend is running.');
    }
  };

  return (
    <div className="page-body">
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Executive Operations Dashboard</h1>
          <p className="page-subtitle">
            SIH25031 • Jharkhand Government Crowdsourced Civic Issue Management Portal
          </p>
        </div>
        <button className="btn btn-outline" onClick={loadData}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Refresh Data
        </button>
      </div>

      <StatsCards stats={stats} />

      <MapWidget issues={issues} />

      <IssueTable
        issues={issues}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onOpenImageModal={(issue) => setActiveImageModal(issue)}
        onOpenStatusModal={(issue) => setActiveStatusModal(issue)}
        loading={loading}
      />

      {activeStatusModal && (
        <StatusModal
          issue={activeStatusModal}
          onClose={() => setActiveStatusModal(null)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}

      {activeImageModal && (
        <ImageModal
          photoPath={activeImageModal.photoPath}
          category={activeImageModal.category}
          issueId={activeImageModal.id}
          onClose={() => setActiveImageModal(null)}
        />
      )}
    </div>
  );
};

export default DashboardHome;
