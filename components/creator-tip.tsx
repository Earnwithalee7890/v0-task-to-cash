"use client"

import { useCallback, useState } from "react"
import { Card } from "@/components/ui/card"
import { Coins, Copy, Check } from "lucide-react"
import { useAccount, useConnect, useSendTransaction } from "wagmi"
import { parseUnits } from "viem"

const OWNER_WALLET = "0xcf74BbBDDBB7ed5129a715F20d1cC34Fe1124fe4" as const
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const // Base USDC
const tipAmounts = [3, 5, 10, 20, 50]

export function CreatorTip() {
    const [copied, setCopied] = useState(false)
    const [customAmount, setCustomAmount] = useState("")
    const { isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { sendTransactionAsync } = useSendTransaction()

    const handleTip = useCallback(async (amount: number) => {
        if (!isConnected) {
            try {
                connect({ connector: connectors[0] })
                return
            } catch (err) {
                console.error("Connection failed:", err)
                return
            }
        }

        try {
            // Send USDC (6 decimals for USDC)
            await sendTransactionAsync({
                to: USDC_ADDRESS,
                data: `0xa9059cbb${OWNER_WALLET.slice(2).padStart(64, '0')}${parseUnits(amount.toString(), 6).toString(16).padStart(64, '0')}` as `0x${string}`
            })
            setCustomAmount("")
        } catch (error) {
            console.error(`Tip $${amount} USDC failed:`, error)
        }
    }, [isConnected, connect, connectors, sendTransactionAsync])

    const handleCustomTip = useCallback(() => {
        const amount = parseFloat(customAmount)
        if (amount && amount > 0) {
            handleTip(amount)
        }
    }, [customAmount, handleTip])

    const copyAddress = async () => {
        await navigator.clipboard.writeText(OWNER_WALLET)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

    return (
        <Card className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-chart-3/30 to-chart-3/10 flex items-center justify-center">
                        <Coins className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Tip the Creator</h3>
                        <p className="text-xs text-muted-foreground">Support with USDC</p>
                    </div>
                </div>

                {/* Goal Circle */}
                <div className="relative h-14 w-14">
                    <svg className="transform -rotate-90" viewBox="0 0 56 56">
                        {/* Background circle */}
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-secondary/30"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="url(#tipGradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2.4 * Math.PI * 24} ${2.4 * Math.PI * 24}`}
                            strokeDashoffset={2.4 * Math.PI * 24 * (1 - 0.35)}
                            className="transition-all duration-500"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="tipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-foreground">$35</span>
                    </div>
                </div>
            </div>

            {/* Wallet Address Display */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                <code className="flex-1 text-xs text-muted-foreground font-mono">{shortenAddress(OWNER_WALLET)}</code>
                <button
                    onClick={copyAddress}
                    className="h-8 w-8 p-0 flex items-center justify-center hover:bg-secondary rounded transition-colors"
                >
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
            </div>

            {/* USDC Tip Buttons */}
            <div className="grid grid-cols-3 gap-2">
                {tipAmounts.map((amt) => (
                    <button
                        key={amt}
                        onClick={() => handleTip(amt)}
                        className="h-12 rounded-xl bg-gradient-to-br from-chart-3/20 to-primary/20 border border-chart-3/30 text-foreground font-semibold hover:from-chart-3/30 hover:to-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        ${amt}
                    </button>
                ))}
            </div>

            {/* Manual Tip Input */}
            <div className="grid grid-cols-3 gap-2">
                <input
                    type="number"
                    placeholder="Amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="col-span-2 h-12 px-4 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    min="0"
                    step="0.01"
                />
                <button
                    onClick={handleCustomTip}
                    disabled={!customAmount || parseFloat(customAmount) <= 0}
                    className="h-12 rounded-xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </Card>
    )
}

