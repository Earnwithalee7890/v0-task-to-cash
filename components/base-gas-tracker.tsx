"use client"

import { useGasPrice } from "wagmi"
import { Fuel, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { base } from "wagmi/chains"

export function BaseGasTracker() {
    const { data: gasPrice, isLoading, refetch } = useGasPrice({
        chainId: base.id,
    })

    // Fallback Mock Gas if API fails/loads too long
    const [displayGas, setDisplayGas] = useState<string>("0.00")

    useEffect(() => {
        if (gasPrice) {
            setDisplayGas((Number(gasPrice) / 1e9).toFixed(2))
        } else {
            // Mock reasonable Base gas (0.05 gwei) if data missing
            if (!isLoading) setDisplayGas("0.05")
        }
    }, [gasPrice, isLoading])

    // Auto-refresh every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 15000)
        return () => clearInterval(interval)
    }, [refetch])

    // Convert wei to gwei (1 gwei = 1e9 wei)
    // Format to 2 decimal places
    const formattedGas = gasPrice ? (Number(gasPrice) / 1e9).toFixed(2) : "0.00"

    // Dynamic color based on congestion
    const getGasColor = (gwei: number) => {
        if (gwei < 0.1) return "text-green-400"
        if (gwei < 1) return "text-yellow-400"
        return "text-red-400"
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
            <Fuel className="h-3 w-3 text-blue-400" />
            <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Base Gas:</span>
                {isLoading && displayGas === "0.00" ? (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                ) : (
                    <span className={`text-xs font-mono font-bold ${getGasColor(Number(displayGas))}`}>
                        {displayGas} Gwei
                    </span>
                )}
            </div>
        </div>
    )
}
