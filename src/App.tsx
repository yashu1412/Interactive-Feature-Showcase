import React from 'react';
import FeatureShowcase from './components/FeatureShowcase';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header Section */}
      <div className="pt-20 pb-12 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">
          Discover Amazing Features
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto px-4">
          Experience our cutting-edge application with interactive feature showcase
        </p>
      </div>
      
      {/* Feature Showcase */}
      <div className="flex-1">
        <FeatureShowcase />
      </div>
    </div>
  );
}

export default App;