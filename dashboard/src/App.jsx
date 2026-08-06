import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './pages/DashboardHome';
import IssueManagement from './pages/IssueManagement';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome searchTerm={searchTerm} />;
      case 'issues':
      case 'map':
        return <IssueManagement searchTerm={searchTerm} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardHome searchTerm={searchTerm} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
