import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { Dashboard } from './pages/Dashboard';
import { UserPage } from './pages/UserPage';
import { BrowsePage } from './pages/BrowsePage';
import { AuthCallback } from './pages/AuthCallback';
import { PricingPage } from './pages/PricingPage';
import { ActivatePage } from './pages/ActivatePage';
import { DocumentationPage } from './pages/DocumentationPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/activate" element={<ActivatePage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/u/:username" element={<UserPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;