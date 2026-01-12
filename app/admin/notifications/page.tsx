'use client';

import { NotificationAdmin } from '@/components/notification-admin';

export default function NotificationsAdminPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">📣 Notification Control Panel</h1>
                    <p className="text-gray-300">Send push notifications to your TrueScore users</p>
                </div>

                <NotificationAdmin />

                <div className="mt-6 p-4 bg-black/40 rounded-lg border border-blue-500/20">
                    <h2 className="text-lg font-semibold text-white mb-2">📖 Quick Guide</h2>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Click "Refresh Status" to see how many users have enabled notifications</li>
                        <li>• Click "Check Score 🎯" to send the Neynar Score notification</li>
                        <li>• Click "Claim Rewards 🎁" to remind users about rewards</li>
                        <li>• Notifications are sent instantly to all enabled users</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
