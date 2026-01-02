export interface Interaction {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  note: string;
}

export interface Friend {
  id: string;
  name: string;
  maxDelayDays: number;
  interactions: Interaction[];
}

export interface FriendsData {
  friends: Friend[];
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function daysSinceLastInteraction(friend: Friend): number | null {
  if (friend.interactions.length === 0) return null;

  const sorted = [...friend.interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastDate = new Date(sorted[0].date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export type Status = 'overdue' | 'warning' | 'ok' | 'unknown';

export function getStatus(friend: Friend): Status {
  const days = daysSinceLastInteraction(friend);
  if (days === null) return 'unknown';
  if (days >= friend.maxDelayDays) return 'overdue';
  if (days >= friend.maxDelayDays * 0.8) return 'warning';
  return 'ok';
}
