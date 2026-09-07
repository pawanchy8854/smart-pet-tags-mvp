"use client";

import React, { useState } from 'react';
import { Save, ShieldAlert, ToggleRight, ToggleLeft } from 'lucide-react';

export default function Dashboard() {
  const [isLost, setIsLost] = useState(false);
  const [privacy, setPrivacy] = useState({ showPhone: true, showAddress: false });

  const handleToggle = (key: 'showPhone' | 'showAddress') => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Max's Profile</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Save size={16} />
          Save
        </button>
      </div>

      <div className={`p-5 rounded-xl mb-8 border-2 transition-colors ${
        isLost ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert size={20} className={isLost ? "text-red-600" : "text-gray-400"} />
              Lost Pet Mode
            </h2>
            <p className="text-sm text-gray-500 mt-1">Override privacy settings to broadcast emergency data.</p>
          </div>
          <button onClick={() => setIsLost(!isLost)}>
            {isLost ? <ToggleRight size={40} className="text-red-600" /> : <ToggleLeft size={40} className="text-gray-300" />}
          </button>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-4">Public Scan Visibility</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Show Phone Number</p>
            <p className="text-xs text-gray-500">Allow finders to call you directly</p>
          </div>
          <button onClick={() => handleToggle('showPhone')}>
             {privacy.showPhone ? <ToggleRight size={32} className="text-blue-600" /> : <ToggleLeft size={32} className="text-gray-300" />}
          </button>
        </div>
      </div>
    </div>
  );
}