import React, { useState } from 'react';
import { api } from '../lib/api';

export const SuggestionsPanel: React.FC = () => {
  const [budget, setBudget] = useState<'low'|'medium'|'high'>('medium');
  const [tripType, setTripType] = useState<'adventure'|'leisure'|'culture'>('leisure');
  const [origin, setOrigin] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const run = async () => {
    try {
      setLoading(true);
      const res = await api.suggestDestinations({ budget, tripType, origin, month });
      setSuggestions(res.suggestions || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Get Destination Suggestions</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <select value={budget} onChange={(e) => setBudget(e.target.value as any)} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
          <option value="low">Budget: Low</option>
          <option value="medium">Budget: Medium</option>
          <option value="high">Budget: High</option>
        </select>
        <select value={tripType} onChange={(e) => setTripType(e.target.value as any)} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
          <option value="leisure">Trip: Leisure</option>
          <option value="adventure">Trip: Adventure</option>
          <option value="culture">Trip: Culture</option>
        </select>
        <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin (optional)" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
        <input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month (e.g., May)" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white" />
      </div>
      <button onClick={run} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
        {loading ? 'Thinking…' : 'Suggest Destinations'}
      </button>
      {suggestions.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestions.map((s, i) => (
            <div key={i} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="font-medium text-gray-900 dark:text-white">{s}</div>
              <div className="text-xs text-gray-500">Click to plan a trip</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;

