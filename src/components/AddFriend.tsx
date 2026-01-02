import { useState } from 'react';

interface AddFriendProps {
  onAdd: (name: string, maxDelayDays: number) => void;
}

export function AddFriend({ onAdd }: AddFriendProps) {
  const [name, setName] = useState('');
  const [maxDelayDays, setMaxDelayDays] = useState(30);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd(name.trim(), maxDelayDays);
    setName('');
    setMaxDelayDays(30);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + Add Friend
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Friend's name"
        className="flex-1 px-3 py-1.5 border rounded text-sm"
        autoFocus
      />

      <input
        type="number"
        value={maxDelayDays}
        onChange={e => setMaxDelayDays(Number(e.target.value))}
        min={1}
        className="w-20 px-2 py-1.5 border rounded text-sm"
      />
      <span className="text-sm text-gray-500">days max</span>

      <button
        type="submit"
        disabled={!name.trim()}
        className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300"
      >
        Add
      </button>

      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          setName('');
          setMaxDelayDays(30);
        }}
        className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded text-sm hover:bg-gray-300"
      >
        Cancel
      </button>
    </form>
  );
}
