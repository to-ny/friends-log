import type { Friend, Status } from '../types';
import { getStatus, daysSinceLastInteraction } from '../types';
import { FriendCard } from './FriendCard';

interface FriendListProps {
  friends: Friend[];
  onUpdate: (id: string, updates: Partial<Omit<Friend, 'id'>>) => void;
  onDelete: (id: string) => void;
  onDeleteInteraction: (friendId: string, interactionId: string) => void;
}

const statusOrder: Record<Status, number> = {
  overdue: 0,
  warning: 1,
  unknown: 2,
  ok: 3,
};

export function FriendList({ friends, onUpdate, onDelete, onDeleteInteraction }: FriendListProps) {
  const sortedFriends = [...friends].sort((a, b) => {
    const statusA = getStatus(a);
    const statusB = getStatus(b);

    // First sort by status
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    // Then by days since last interaction (descending)
    const daysA = daysSinceLastInteraction(a) ?? Infinity;
    const daysB = daysSinceLastInteraction(b) ?? Infinity;
    return daysB - daysA;
  });

  if (friends.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No friends added yet</p>
        <p className="text-sm">Add your first friend using the form above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedFriends.map(friend => (
        <FriendCard
          key={friend.id}
          friend={friend}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onDeleteInteraction={onDeleteInteraction}
        />
      ))}
    </div>
  );
}
