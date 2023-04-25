import React, { useState } from 'react';

export default function Journal({ goal }) {
  const [journalEntry, setJournalEntry] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState([]);

  const handleJournalSubmit = () => {
    // Simulate NLP analysis and prompt generation based on the journal entry
    const prompts = [
      'What challenges did you face while working towards this goal?',
      'What successes have you experienced along the way?',
      'How can you overcome the obstacles you encountered?',
    ];
    setGeneratedPrompts(prompts);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Journaling for Goal: {goal.title}</h2>
        <textarea
          placeholder="Write about your progress..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded h-40"
        ></textarea>
        <button
          onClick={handleJournalSubmit}
          className="w-full py-2 mt-4 bg-gray-800 text-white font-semibold rounded"
        >
          Generate Prompts
        </button>
        {generatedPrompts.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold mb-2">Personalized Prompts:</h3>
            <ul className="list-disc pl-6">
              {generatedPrompts.map((prompt, index) => (
                <li key={index}>{prompt}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
