import { useFriendsData } from './hooks/useFriendsData';
import { FriendList } from './components/FriendList';
import { QuickLog } from './components/QuickLog';
import { AddFriend } from './components/AddFriend';

function App() {
  const {
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
  } = useFriendsData();

  // Show folder picker if no file path is set
  if (!filePath) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Friends Log</h1>
          <p className="text-gray-600 mb-6">
            Select a folder where your friends.json file will be stored.
            This folder can be synced with your favorite sync app.
          </p>
          <button
            onClick={pickFolder}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Choose Folder
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-gray-800">Friends Log</h1>
          <button
            onClick={pickFolder}
            className="text-sm text-gray-500 hover:text-gray-700"
            title={filePath}
          >
            Change folder
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="mx-4 mb-2 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Add friend form */}
        <div className="px-4 mb-2">
          <AddFriend onAdd={addFriend} />
        </div>

        {/* Friends list - scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <FriendList
            friends={data.friends}
            onUpdate={updateFriend}
            onDelete={deleteFriend}
            onDeleteInteraction={deleteInteraction}
          />
        </div>

        {/* Quick log bar - fixed at bottom */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <QuickLog friends={data.friends} onAddInteraction={addInteraction} />
        </div>
      </div>
    </div>
  );
}

export default App;
