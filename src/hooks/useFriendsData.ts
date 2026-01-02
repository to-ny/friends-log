import { useState, useEffect, useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs';
import type { Friend, FriendsData, Interaction } from '../types';
import { generateId } from '../types';

const STORAGE_KEY = 'friends-log-file-path';

const emptyData: FriendsData = { friends: [] };

export function useFriendsData() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [data, setData] = useState<FriendsData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved file path on mount
  useEffect(() => {
    const savedPath = localStorage.getItem(STORAGE_KEY);
    if (savedPath) {
      setFilePath(savedPath);
    } else {
      setLoading(false);
    }
  }, []);

  // Load data when file path changes
  useEffect(() => {
    if (!filePath) return;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const fileExists = await exists(filePath!);
        if (fileExists) {
          const content = await readTextFile(filePath!);
          const parsed = JSON.parse(content) as FriendsData;
          setData(parsed);
        } else {
          // Create new file with empty data
          await writeTextFile(filePath!, JSON.stringify(emptyData, null, 2));
          setData(emptyData);
        }
      } catch (e) {
        setError(`Failed to load data: ${e}`);
        setData(emptyData);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [filePath]);

  // Save data to file
  const saveData = useCallback(async (newData: FriendsData) => {
    if (!filePath) return;
    try {
      await writeTextFile(filePath, JSON.stringify(newData, null, 2));
      setData(newData);
      setError(null);
    } catch (e) {
      setError(`Failed to save data: ${e}`);
    }
  }, [filePath]);

  // Pick a folder and set the file path
  const pickFolder = useCallback(async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select folder for friends.json',
      });
      if (selected) {
        const newPath = `${selected}/friends.json`;
        localStorage.setItem(STORAGE_KEY, newPath);
        setFilePath(newPath);
      }
    } catch (e) {
      setError(`Failed to pick folder: ${e}`);
    }
  }, []);

  // Add a new friend
  const addFriend = useCallback(async (name: string, maxDelayDays: number) => {
    const newFriend: Friend = {
      id: generateId(),
      name,
      maxDelayDays,
      interactions: [],
    };
    const newData = { ...data, friends: [...data.friends, newFriend] };
    await saveData(newData);
  }, [data, saveData]);

  // Update a friend
  const updateFriend = useCallback(async (id: string, updates: Partial<Omit<Friend, 'id'>>) => {
    const newFriends = data.friends.map(f =>
      f.id === id ? { ...f, ...updates } : f
    );
    await saveData({ ...data, friends: newFriends });
  }, [data, saveData]);

  // Delete a friend
  const deleteFriend = useCallback(async (id: string) => {
    const newFriends = data.friends.filter(f => f.id !== id);
    await saveData({ ...data, friends: newFriends });
  }, [data, saveData]);

  // Add an interaction to a friend
  const addInteraction = useCallback(async (friendId: string, date: string, note: string) => {
    const newInteraction: Interaction = {
      id: generateId(),
      date,
      note,
    };
    const newFriends = data.friends.map(f =>
      f.id === friendId
        ? { ...f, interactions: [...f.interactions, newInteraction] }
        : f
    );
    await saveData({ ...data, friends: newFriends });
  }, [data, saveData]);

  // Delete an interaction
  const deleteInteraction = useCallback(async (friendId: string, interactionId: string) => {
    const newFriends = data.friends.map(f =>
      f.id === friendId
        ? { ...f, interactions: f.interactions.filter(i => i.id !== interactionId) }
        : f
    );
    await saveData({ ...data, friends: newFriends });
  }, [data, saveData]);

  return {
    filePath,
    data,
    loading,
    error,
    pickFolder,
    addFriend,
    updateFriend,
    deleteFriend,
    addInteraction,
    deleteInteraction,
  };
}
