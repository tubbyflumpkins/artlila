"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicsData: string;
  constraintsData: string;
  topicsDataEn: string;
  constraintsDataEn: string;
  onSave: (topics: string, constraints: string, topicsEn: string, constraintsEn: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, topicsData, constraintsData, topicsDataEn, constraintsDataEn, onSave }) => {
  const [topics, setTopics] = useState(topicsData);
  const [constraints, setConstraints] = useState(constraintsData);
  const [topicsEn, setTopicsEn] = useState(topicsDataEn);
  const [constraintsEn, setConstraintsEn] = useState(constraintsDataEn);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>('fr');

  // Update state when props change (when modal opens with new data)
  React.useEffect(() => {
    setTopics(topicsData);
    setConstraints(constraintsData);
    setTopicsEn(topicsDataEn);
    setConstraintsEn(constraintsDataEn);
  }, [topicsData, constraintsData, topicsDataEn, constraintsDataEn]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(topics, constraints, topicsEn, constraintsEn);
    setIsSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-4 lg:inset-12 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Modifier le contenu des roues / Edit Wheel Content</h2>
              <p className="text-sm text-gray-600 mt-1">Format: Text Description, Emoji (one per line)</p>
              
              {/* Language Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setActiveTab('fr')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    activeTab === 'fr'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Français
                </button>
                <button
                  onClick={() => setActiveTab('en')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    activeTab === 'en'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
            
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-1 overflow-y-auto">
              {activeTab === 'fr' ? (
                <>
                  <div className="flex flex-col h-full">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Sujets (Quoi dessiner)
                    </label>
                    <textarea
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                      className="w-full flex-1 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Animaux sauvages, 🦁"
                    />
                  </div>
                  
                  <div className="flex flex-col h-full">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Contraintes (Comment dessiner)
                    </label>
                    <textarea
                      value={constraints}
                      onChange={(e) => setConstraints(e.target.value)}
                      className="w-full flex-1 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Une ligne continue, ✏️"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col h-full">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Topics (What to draw)
                    </label>
                    <textarea
                      value={topicsEn}
                      onChange={(e) => setTopicsEn(e.target.value)}
                      className="w-full flex-1 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Wild Animals, 🦁"
                    />
                  </div>
                  
                  <div className="flex flex-col h-full">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Constraints (How to draw)
                    </label>
                    <textarea
                      value={constraintsEn}
                      onChange={(e) => setConstraintsEn(e.target.value)}
                      className="w-full flex-1 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="One continuous line, ✏️"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isSaving}
              >
                {activeTab === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 
                  (activeTab === 'fr' ? 'Enregistrement...' : 'Saving...') : 
                  (activeTab === 'fr' ? 'Enregistrer les modifications' : 'Save changes')
                }
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const EditButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topicsData, setTopicsData] = useState('');
  const [constraintsData, setConstraintsData] = useState('');
  const [topicsDataEn, setTopicsDataEn] = useState('');
  const [constraintsDataEn, setConstraintsDataEn] = useState('');

  const handleEditClick = async () => {
    // Fetch current wheel data
    try {
      const response = await fetch('/api/wheel-data/raw');
      const data = await response.json();
      setTopicsData(data.topics);
      setConstraintsData(data.constraints);
      setTopicsDataEn(data.topicsEn || '');
      setConstraintsDataEn(data.constraintsEn || '');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Échec du chargement des données des roues:', error);
    }
  };

  const handleSave = async (topics: string, constraints: string, topicsEn: string, constraintsEn: string) => {
    try {
      const response = await fetch('/api/wheel-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics, constraints, topicsEn, constraintsEn }),
      });

      if (response.ok) {
        // Reload the page to reflect changes
        window.location.reload();
      } else {
        console.error('Échec de l\'enregistrement des données des roues');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des données des roues:', error);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleEditClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors z-40"
        title="Modifier le contenu des roues"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </motion.button>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topicsData={topicsData}
        constraintsData={constraintsData}
        topicsDataEn={topicsDataEn}
        constraintsDataEn={constraintsDataEn}
        onSave={handleSave}
      />
    </>
  );
};

export default EditButton;