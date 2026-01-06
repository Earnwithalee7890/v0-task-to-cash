import { Card } from "@/components/ui/card"

export function SearchSkeleton() {
    return (
        <div className="space-y-4 opacity-0 animate-slide-up stagger-2">
            <Card className="glass-card-strong p-5 border-2 border-white/5 bg-gradient-to-br from-white/5 to-transparent shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-white/10 animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <div className="h-5 w-32 bg-white/10 rounded animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
                        </div>
                        <div className="h-3 w-20 bg-white/10 rounded animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-10 w-full bg-white/10 rounded-lg animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
                        </div>
                    ))}
                </div>
            </Card>
            <div className="h-32 rounded-full bg-white/5 animate-pulse mx-auto opacity-50 blur-xl" />

            {/* Additional Score Skeleton */}
            <div className="h-24 w-full rounded-2xl bg-white/5 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
            </div>
        </div>
    )
}
