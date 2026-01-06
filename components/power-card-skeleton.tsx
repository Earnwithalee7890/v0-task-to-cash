import { Skeleton } from "@/components/ui/skeleton"

export function PowerCardSkeleton() {
    return (
        <div className="mt-8">
            <div className="h-5 w-48 mx-auto mb-4 bg-white/10 rounded animate-pulse" />

            <div className="relative aspect-[3/4] max-w-[280px] mx-auto rounded-3xl p-1 bg-white/5 border border-white/10 shadow-2xl">
                <div className="h-full bg-black/80 backdrop-blur-sm rounded-[20px] p-4 flex flex-col relative overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <Skeleton className="h-5 w-16 rounded" />
                        <Skeleton className="h-5 w-12 rounded" />
                    </div>

                    {/* Image */}
                    <Skeleton className="aspect-square rounded-xl w-full mb-4" />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-auto">
                        <Skeleton className="h-12 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                        <Skeleton className="h-4 w-20 rounded" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                </div>
            </div>

            <Skeleton className="h-10 w-[280px] mx-auto mt-4 rounded" />
        </div>
    )
}
