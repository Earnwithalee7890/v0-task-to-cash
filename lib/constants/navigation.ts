export const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: 'Home' },
    { label: 'Score', href: '/score', icon: 'BarChart' },
    { label: 'AI Post', href: '/ai-post-maker', icon: 'Sparkles' },
    { label: 'Profile', href: '/profile', icon: 'User' },
] as const

export type NavItem = typeof NAV_ITEMS[number]

export const SOCIAL_LINKS = {
    farcaster: 'https://warpcast.com/aleekhoso',
    github: 'https://github.com/Earnwithalee7890/True-Score-Mini-app-Crypto',
} as const
