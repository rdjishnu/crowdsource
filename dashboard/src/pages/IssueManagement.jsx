import React, { useState, useEffect } from 'react';
import IssueTable from '../components/IssueTable';
import StatusModal from '../components/StatusModal';
import ImageModal from '../components/ImageModal';
import { fetchIssues, updateIssueStatus } from '../services/api';

const IssueManagement = ({ searchTerm }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [activeImageModal, setActiveImageModal] = useState(null);
  const [activeStatusModal, setActiveStatusModal] = useState(null);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchTerm) params.search = searchTerm;

      const data = await fetchIssues(params);
      setIssues(data.content || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [selectedCategory, selectedStatus, searchTerm]);

  const handleStatusUpdate = async (id, newStatus) => {
    await updateIssueStatus(id, newStatus);
    await loadIssues();
  };

  return (
    <div className="page-body">
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Issue Resolution Workflows</h1>
          <p className="page-subtitle">Inspect, assign, and update official status for reported complaints</p>
        </div>
      </div>

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

export default IssueManagement;
