import { useState } from 'react';
import type { Friend, Status } from '../types';
import { getStatus, daysSinceLastInteraction } from '../types';

interface FriendCardProps {
  friend: Friend;
  onUpdate: (id: string, updates: Partial<Omit<Friend, 'id'>>) => void;
  onDelete: (id: string) => void;
  onDeleteInteraction: (friendId: string, interactionId: string) => void;
}

const statusColors: Record<Status, string> = {
  overdue: 'bg-red-500',
  warning: 'bg-yellow-500',
  ok: 'bg-green-500',
  unknown: 'bg-gray-400',
};

const statusBorders: Record<Status, string> = {
  overdue: 'border-red-200 bg-red-50',
  warning: 'border-yellow-200 bg-yellow-50',
  ok: 'border-green-200 bg-green-50',
  unknown: 'border-gray-200 bg-gray-50',
};

export function FriendCard({ friend, onUpdate, onDelete, onDeleteInteraction }: FriendCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(friend.name);
  const [editMaxDelay, setEditMaxDelay] = useState(friend.maxDelayDays);

  const status = getStatus(friend);
  const daysSince = daysSinceLastInteraction(friend);

  const sortedInteractions = [...friend.interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSave = () => {
    onUpdate(friend.id, { name: editName, maxDelayDays: editMaxDelay });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditName(friend.name);
    setEditMaxDelay(friend.maxDelayDays);
    setEditing(false);
  };

  return (
    <div className={`border rounded-lg p-3 ${statusBorders[status]}`}>
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => !editing && setExpanded(!expanded)}
      >
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />

        {editing ? (
          <div className="flex-1 flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm"
              autoFocus
            />
            <input
              type="number"
              value={editMaxDelay}
              onChange={e => setEditMaxDelay(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded text-sm"
              min={1}
            />
            <span className="text-xs text-gray-500">days</span>
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <span className="flex-1 font-medium text-gray-800">{friend.name}</span>
            <span className="text-sm text-gray-600">
              {daysSince !== null ? (
                <>
                  last: <span className="font-medium">{daysSince}d</span> ago
                  <span className="text-gray-400 ml-1">(max: {friend.maxDelayDays}d)</span>
                </>
              ) : (
                <span className="text-gray-400">no interactions yet</span>
              )}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </div>

      {expanded && !editing && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex gap-2 mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${friend.name}?`)) {
                  onDelete(friend.id);
                }
              }}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-2">Interactions:</div>
          {sortedInteractions.length === 0 ? (
            <div className="text-sm text-gray-400 italic">No interactions recorded</div>
          ) : (
            <ul className="space-y-1">
              {sortedInteractions.map(interaction => (
                <li key={interaction.id} className="flex items-center gap-2 text-sm group">
                  <span className="text-gray-500 font-mono">{new Date(interaction.date).toLocaleDateString()}</span>
                  <span className="text-gray-700">{interaction.note}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteInteraction(friend.id, interaction.id);
                    }}
                    className="ml-auto text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
