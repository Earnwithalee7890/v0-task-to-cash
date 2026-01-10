/**
 * In-memory storage for notification tokens
 * TODO: Upgrade to database (Supabase) for production
 */

interface NotificationToken {
    fid: string;
    token: string;
    url: string;
    enabledAt: number;
}

// In-memory store (use database in production)
const tokenStore = new Map<string, NotificationToken>();

export const notificationStorage = {
    /**
     * Store a notification token for a user
     */
    storeToken: (fid: string, token: string, url: string) => {
        tokenStore.set(fid, {
            fid,
            token,
            url,
            enabledAt: Date.now(),
        });
        console.log(`[Notifications] Stored token for FID ${fid}`);
    },

    /**
     * Get notification token for a user
     */
    getToken: (fid: string): NotificationToken | undefined => {
        return tokenStore.get(fid);
    },

    /**
     * Remove notification token for a user
     */
    removeToken: (fid: string): boolean => {
        const deleted = tokenStore.delete(fid);
        if (deleted) {
            console.log(`[Notifications] Removed token for FID ${fid}`);
        }
        return deleted;
    },

    /**
     * Get all stored tokens
     */
    getAllTokens: (): NotificationToken[] => {
        return Array.from(tokenStore.values());
    },

    /**
     * Get tokens for multiple users
     */
    getTokens: (fids: string[]): string[] => {
        return fids
            .map(fid => tokenStore.get(fid)?.token)
            .filter((token): token is string => !!token);
    },

    /**
     * Get count of stored tokens
     */
    getCount: (): number => {
        return tokenStore.size;
    },

    /**
     * Check if user has notifications enabled
     */
    hasNotifications: (fid: string): boolean => {
        return tokenStore.has(fid);
    },
};
