import React, { useState } from 'react';
import { X, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../lib/store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    youtubeApiKey, setYoutubeApiKey 
  } = useAuthStore();

  const [yKey, setYKey] = useState(youtubeApiKey);

  const handleSave = () => {
    setYoutubeApiKey(yKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Key size={20} />
            API Configuration
          </div>
          <button onClick={onClose} className="hover:text-gray-300 transition"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100 flex gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              To enable real search, you need to provide your own API keys. 
              These are stored locally in your browser.
            </div>
          </div>

          {/* YouTube Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-900 border-b pb-2">YouTube Data API</h3>
            <div className="p-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-100">
               Required for "Direct Search". Get a free key from Google Cloud Console.
            </div>
             <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">API Key</label>
              <input 
                type="text" 
                value={yKey}
                onChange={(e) => setYKey(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                placeholder="AIzaSy..."
              />
            </div>
            </div>


          {/* SoundCloud Section (Future) */}
          <div className="space-y-3">
             <h3 className="font-bold text-sm text-gray-900 border-b pb-2">SoundCloud Integration</h3>
             <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Client ID (Optional)</label>
              <input 
                type="text" 
                value={useAuthStore.getState().soundCloudClientId}
                onChange={(e) => useAuthStore.getState().setSoundCloudClientId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
                placeholder="Enter Client ID..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
