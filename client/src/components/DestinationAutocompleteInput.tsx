import React, { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';
import { Search } from 'lucide-react';

type Suggestion = { name: string; lat: number; lon: number };

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (s: Suggestion) => void;
  placeholder?: string;
};

export const DestinationAutocompleteInput: React.FC<Props> = ({ value, onChange, onSelect, placeholder }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const controller = useRef<AbortController | null>(null);

  const debouncedValue = useDebounce(value, 200);

  useEffect(() => {
    const run = async () => {
      if (!debouncedValue || debouncedValue.length < 2) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      try {
        controller.current?.abort();
        controller.current = new AbortController();
        setLoading(true);
        const res = await api.autocomplete(debouncedValue);
        setSuggestions(res.suggestions || []);
        setOpen(true);
        setHighlight(0);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const s = suggestions[highlight];
      if (s) {
        onChange(s.name);
        onSelect(s);
        setOpen(false);
      }
    }
  };

  return (
    <div className="relative">
      <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => value.length >= 2 && suggestions.length > 0 && setOpen(true)}
        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder={placeholder || 'Where are you going?'}
      />
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-auto">
          {loading && <div className="px-3 py-2 text-sm text-gray-500">Searching…</div>}
          {!loading && suggestions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No suggestions</div>
          )}
          {!loading && suggestions.map((s, idx) => (
            <button
              key={`${s.lat}-${s.lon}-${idx}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(s.name);
                onSelect(s);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlight(idx)}
              className={`block w-full text-left px-3 py-2 text-sm ${idx === highlight ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default DestinationAutocompleteInput;

