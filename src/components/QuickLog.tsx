import { useState, useRef, useEffect } from 'react';
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
  const [friendInput, setFriendInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [date, setDate] = useState(getTodayString());
  const [note, setNote] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(friendInput.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFriendSelect = (friend: Friend) => {
    setSelectedFriendId(friend.id);
    setFriendInput(friend.name);
    setShowDropdown(false);
  };

  const handleInputChange = (value: string) => {
    setFriendInput(value);
    setShowDropdown(true);
    // Clear selection if input doesn't match
    const match = friends.find(f => f.name.toLowerCase() === value.toLowerCase());
    setSelectedFriendId(match?.id || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriendId || !date || !note.trim()) return;

    onAddInteraction(selectedFriendId, date, note.trim());
    setNote('');
    setDate(getTodayString());
    setFriendInput('');
    setSelectedFriendId('');
  };

  if (friends.length === 0) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg"
    >
      <span className="text-sm text-gray-600 font-medium">Quick log:</span>

      <div className="relative" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          value={friendInput}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Select friend"
          className="px-2 py-1.5 border rounded text-sm bg-white w-40"
          required
        />
        {showDropdown && filteredFriends.length > 0 && (
          <ul className="absolute z-10 w-full bottom-full mb-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
            {filteredFriends.map(f => (
              <li
                key={f.id}
                onClick={() => handleFriendSelect(f)}
                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-blue-50"
              >
                {f.name}
              </li>
            ))}
          </ul>
        )}
      </div>

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
