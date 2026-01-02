import { useState } from 'react';
import type { Friend } from '../types';

interface QuickLogProps {
  friends: Friend[];
  onAddInteraction: (friendId: string, date: string, note: string) => void;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function QuickLog({ friends, onAddInteraction }: QuickLogProps) {
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriendId || !date || !note.trim()) return;

    onAddInteraction(selectedFriendId, date, note.trim());
    setNote('');
    setDate(getTodayString());
  };

  if (friends.length === 0) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg"
    >
      <span className="text-sm text-gray-600 font-medium">Quick log:</span>

      <select
        value={selectedFriendId}
        onChange={e => setSelectedFriendId(e.target.value)}
        className="px-2 py-1.5 border rounded text-sm bg-white max-w-40 truncate"
        required
      >
        <option value="">Select friend</option>
        {friends.map(f => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="px-2 py-1.5 border rounded text-sm shrink-0"
        required
      />

      <input
        type="text"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="What did you do?"
        className="flex-1 px-2 py-1.5 border rounded text-sm"
        required
      />

      <button
        type="submit"
        disabled={!selectedFriendId || !date || !note.trim()}
        className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Save
      </button>
    </form>
  );
}
