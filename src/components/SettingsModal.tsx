import { useState } from 'react';
import { X, Bell, BellOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../services/firebase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserSettings {
  notifications: boolean;
  displayName: string;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { currentUser, updateUserProfile } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    displayName: currentUser?.displayName || '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update display name if changed
      if (settings.displayName !== currentUser.displayName) {
        await updateUserProfile(settings.displayName);
      }

      // Update user settings in Firestore
      await updateDoc(doc(firestore, 'users', currentUser.uid), {
        'preferences.notifications': settings.notifications,
      });

      toast.success('Settings updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Notifications Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notifications
            </label>
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                settings.notifications
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              {settings.notifications ? (
                <>
                  <Bell className="w-4 h-4" />
                  Enabled
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4" />
                  Disabled
                </>
              )}
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}