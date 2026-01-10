'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Send, Users, CheckCircle } from 'lucide-react';

export function NotificationAdmin() {
    const [status, setStatus] = useState<any>(null);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Fetch notification status
    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/notifications/send');
            const data = await res.json();
            setStatus(data);
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    };

    // Send notification
    const sendNotification = async (type: string) => {
        setSending(true);
        setResult(null);

        try {
            const res = await fetch('/api/notifications/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            });

            const data = await res.json();
            setResult(data);

            if (data.success) {
                fetchStatus(); // Refresh status
            }
        } catch (error) {
            setResult({ success: false, error: 'Failed to send notification' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-black/40 border-blue-500/20">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-400" />
                        <CardTitle>Notification System</CardTitle>
                    </div>
                    <CardDescription>
                        Send push notifications to your mini app users
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-400" />
                            <div>
                                <p className="text-sm font-medium">Users with notifications enabled</p>
                                <p className="text-xs text-gray-400">Total notification tokens stored</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                            {status?.totalUsers || 0}
                        </div>
                    </div>

                    <Button
                        onClick={fetchStatus}
                        variant="outline"
                        className="w-full"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Refresh Status
                    </Button>

                    {/* Send Notifications */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Send Notifications</h3>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                onClick={() => sendNotification('checkScore')}
                                disabled={sending}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Check Score 🎯
                            </Button>

                            <Button
                                onClick={() => sendNotification('claimRewards')}
                                disabled={sending}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Claim Rewards 🎁
                            </Button>
                        </div>
                    </div>

                    {/* Result */}
                    {result && (
                        <div className={`p-4 rounded-lg border ${result.success
                                ? 'bg-green-500/10 border-green-500/20'
                                : 'bg-red-500/10 border-red-500/20'
                            }`}>
                            <p className={`text-sm font-medium ${result.success ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {result.success ? '✓ Notification sent!' : '✗ Failed to send'}
                            </p>
                            {result.success && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Sent to {result.sentTo} user{result.sentTo !== 1 && 's'}
                                </p>
                            )}
                            {result.error && (
                                <p className="text-xs text-red-400 mt-1">{result.error}</p>
                            )}
                        </div>
                    )}

                    {/* User List */}
                    {status?.users && status.users.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Enabled Users</h3>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                {status.users.map((user: any) => (
                                    <div
                                        key={user.fid}
                                        className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/10"
                                    >
                                        <span className="text-sm">FID: {user.fid}</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(user.enabledAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="text-xs text-gray-400 border-t border-white/10 pt-4">
                        <p>💡 <strong>Tip:</strong> Users must enable notifications in the app first.</p>
                        <p className="mt-1">
                            Test URL: <code className="text-blue-400">/api/notifications/test</code>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
