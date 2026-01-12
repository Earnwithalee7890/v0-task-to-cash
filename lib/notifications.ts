/**
 * Farcaster Mini App Notification Service
 */

const FARCASTER_NOTIFICATIONS_API = 'https://api.farcaster.xyz/v1/miniapps/notifications';

export interface SendNotificationParams {
    notificationId: string;
    title: string;
    body: string;
    targetUrl: string;
    tokens: string[];
}

export interface NotificationResponse {
    success: boolean;
    message?: string;
    error?: string;
}

/**
 * Send notification to Farcaster users
 */
export async function sendNotification(
    params: SendNotificationParams
): Promise<NotificationResponse> {
    try {
        const response = await fetch(FARCASTER_NOTIFICATIONS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notificationId: params.notificationId,
                title: params.title.slice(0, 32), // Max 32 chars
                body: params.body.slice(0, 128), // Max 128 chars
                targetUrl: params.targetUrl,
                tokens: params.tokens.slice(0, 100), // Max 100 tokens
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('[Notifications] Send failed:', error);
            return {
                success: false,
                error: `HTTP ${response.status}: ${error}`,
            };
        }

        const result = await response.json();
        console.log('[Notifications] Sent successfully:', params.notificationId);

        return {
            success: true,
            message: result.message || 'Notification sent',
        };
    } catch (error) {
        console.error('[Notifications] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Notification Templates
 */

export const NotificationTemplates = {
    /**
     * Check your Neynar score notification
     */
    checkScore: (appUrl: string) => ({
        title: 'Check Your Neynar Score! 🎯',
        body: 'Open and see your latest reputation score',
        targetUrl: `${appUrl}`,
        notificationId: `score-check-${Date.now()}`,
    }),

    /**
     * Claim rewards notification
     */
    claimRewards: (appUrl: string) => ({
        title: 'Claim Your Rewards! 🎁',
        body: 'Check in now and claim your daily rewards',
        targetUrl: `${appUrl}`,
        notificationId: `claim-rewards-${Date.now()}`,
    }),

    /**
     * Score updated notification
     */
    scoreUpdated: (newScore: number, appUrl: string) => ({
        title: 'Score Updated! 🎯',
        body: `Your Neynar score is now ${newScore}!`,
        targetUrl: `${appUrl}`,
        notificationId: `score-update-${Date.now()}`,
    }),

    /**
     * Achievement unlocked notification
     */
    achievementUnlocked: (achievement: string, appUrl: string) => ({
        title: 'Achievement Unlocked! 🏆',
        body: `You earned: ${achievement}`,
        targetUrl: `${appUrl}`,
        notificationId: `achievement-${Date.now()}`,
    }),

    /**
     * Daily reminder notification
     */
    dailyReminder: (streak: number, appUrl: string) => ({
        title: "Don't Break Your Streak! 🔥",
        body: `Keep your ${streak}-day streak going!`,
        targetUrl: `${appUrl}`,
        notificationId: `reminder-${Date.now()}`,
    }),

    /**
     * Daily check-in notification
     */
    dailyCheckIn: (appUrl: string) => ({
        title: "Don't break your streak! 🔥",
        body: "Check in now and earn your daily rewards",
        targetUrl: `${appUrl}`,
        notificationId: `daily-checkin-${Date.now()}`,
    }),

    /**
     * Morning Neynar engagement notification
     */
    neynarEngagementMorning: (appUrl: string) => ({
        title: "Boost Your Score! 🎯",
        body: "Follow quality users to improve your Neynar reputation",
        targetUrl: `${appUrl}`,
        notificationId: `neynar-morning-${Date.now()}`,
    }),

    /**
     * Afternoon Neynar engagement notification
     */
    neynarEngagementAfternoon: (appUrl: string) => ({
        title: "Like & Engage! 💙",
        body: "Engage with content to boost your Neynar score",
        targetUrl: `${appUrl}`,
        notificationId: `neynar-afternoon-${Date.now()}`,
    }),

    /**
     * Evening Neynar engagement notification
     */
    neynarEngagementEvening: (appUrl: string) => ({
        title: "Recast & Share! 🔄",
        body: "Share quality content to increase your reputation",
        targetUrl: `${appUrl}`,
        notificationId: `neynar-evening-${Date.now()}`,
    }),

    /**
     * Weekly Neynar score summary
     */
    weeklyScoreSummary: (appUrl: string) => ({
        title: "Your Weekly Score is Ready! 📊",
        body: "Check your Neynar reputation and see how you rank",
        targetUrl: `${appUrl}`,
        notificationId: `weekly-score-${Date.now()}`,
    }),

    /**
     * Scheduled reminder notification
     */
    scheduledReminder: (message: string, appUrl: string) => ({
        title: 'Reminder! ⏰',
        body: message,
        targetUrl: `${appUrl}`,
        notificationId: `scheduled-reminder-${Date.now()}`,
    }),

    /**
     * Scheduled event notification
     */
    scheduledEvent: (eventName: string, eventTime: string, appUrl: string) => ({
        title: `Event: ${eventName} is starting soon! 🗓️`,
        body: `Join us for ${eventName} at ${eventTime}`,
        targetUrl: `${appUrl}`,
        notificationId: `scheduled-event-${Date.now()}`,
    }),
};

/**
 * Send notification using a template
 */
export async function sendTemplateNotification(
    template: ReturnType<typeof NotificationTemplates[keyof typeof NotificationTemplates]>,
    tokens: string[]
): Promise<NotificationResponse> {
    return sendNotification({
        ...template,
        tokens,
    });
}
