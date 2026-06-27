import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DocViewer from './components/DocViewer';
import LandingPage from './components/LandingPage';
import { loadDocsRegistry } from './utils/docsRegistry';

function App() {
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocsRegistry().then((loadedDocs) => {
      setDocs(loadedDocs);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="orb-loader"></div>
        <p>Loading Documentation...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<Layout docs={docs} />}>
          <Route index element={<Navigate to="/docs/index" replace />} />
          <Route path=":slug" element={<DocViewer docs={docs} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
