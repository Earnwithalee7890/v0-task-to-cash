"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarCheck, Loader2, Check, ExternalLink, Zap, Shield, Gift, Lock } from "lucide-react"
import { useAccount, useConnect, useSendTransaction, useSwitchChain, useChainId, useWriteContract, useReadContract, usePublicClient } from "wagmi"
import { base, celo, mainnet } from "wagmi/chains"
import { formatEther } from "viem"

// Base Check-In Contract Configuration (Production - Mainnet)
const BASE_CHECKIN_CONTRACT = {
  address: "0x911603d80C689564B638d418a15f9EE438294a2a" as `0x${string}`,
  checkInFee: BigInt(1000_000_000_000), // 0.000001 ETH (1000 Gwei)
  abi: [
    {
      inputs: [],
      name: "checkIn",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "claimReward",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "checkInFee",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_user", type: "address" }],
      name: "getUserStats",
      outputs: [
        { internalType: "uint256", name: "totalCheckIns", type: "uint256" },
        { internalType: "uint256", name: "lastCheckInTime", type: "uint256" },
        { internalType: "uint256", name: "nextCheckInTime", type: "uint256" },
        { internalType: "uint256", name: "claimableReward", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
} as const

const NETWORKS = [
  {
    id: "base",
    name: "Base",
    chainId: base.id,
    explorerUrl: "https://basescan.org/tx/",
  },
]

export function DailyCheckin() {
  const [network, setNetwork] = useState("base")
  const [status, setStatus] = useState<"idle" | "switching" | "loading" | "success" | "claiming" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)

  // Contract State
  const [nextCheckIn, setNextCheckIn] = useState<number>(0)
  const [claimableReward, setClaimableReward] = useState<bigint>(BigInt(0))
  const [canCheckIn, setCanCheckIn] = useState(true)

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { writeContractAsync } = useWriteContract()
  const { switchChainAsync } = useSwitchChain()
  const currentChainId = useChainId()
  const publicClient = usePublicClient()

  const selectedNetwork = NETWORKS.find((n) => n.id === network)

  // Fetch User Stats
  const fetchStats = useCallback(async () => {
    if (!address || !publicClient) return

    try {
      const data = await publicClient.readContract({
        address: BASE_CHECKIN_CONTRACT.address,
        abi: BASE_CHECKIN_CONTRACT.abi,
        functionName: "getUserStats",
        args: [address],
      }) as [bigint, bigint, bigint, bigint]

      const nextTime = Number(data[2]) * 1000
      const reward = data[3]

      setNextCheckIn(nextTime)
      setClaimableReward(reward)
      setCanCheckIn(Date.now() >= nextTime)
    } catch (e) {
      console.error("Error fetching stats:", e)
    }
  }, [address, publicClient])

  useEffect(() => {
    if (isConnected && address) {
      fetchStats()
      // Refresh every minute
      const interval = setInterval(fetchStats, 60000)
      return () => clearInterval(interval)
    }
  }, [isConnected, address, fetchStats])


  const handleCheckin = async () => {
    if (!isConnected) {
      try {
        connect({ connector: connectors[0] })
        return
      } catch (err) {
        console.error("Connection failed:", err)
        return
      }
    }

    if (!address || !selectedNetwork) return

    setTxHash(null)

    try {
      if (currentChainId !== selectedNetwork.chainId) {
        setStatus("switching")
        await switchChainAsync({ chainId: selectedNetwork.chainId })
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setStatus("loading")

      const hash = await writeContractAsync({
        address: BASE_CHECKIN_CONTRACT.address,
        abi: BASE_CHECKIN_CONTRACT.abi,
        functionName: "checkIn",
        chainId: selectedNetwork.chainId,
        value: BASE_CHECKIN_CONTRACT.checkInFee,
      })

      setTxHash(hash)
      setStatus("success")

      // Refresh stats after short delay
      setTimeout(fetchStats, 2000)
      setTimeout(fetchStats, 5000)

    } catch (error) {
      console.error("Check-in failed:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const handleClaim = async () => {
    if (!address) return

    try {
      setStatus("claiming")
      const hash = await writeContractAsync({
        address: BASE_CHECKIN_CONTRACT.address,
        abi: BASE_CHECKIN_CONTRACT.abi,
        functionName: "claimReward",
        chainId: base.id,
      })

      setTxHash(hash)
      setStatus("success")
      setTimeout(fetchStats, 2000)
    } catch (error) {
      console.error("Claim failed:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const getExplorerUrl = () => {
    if (!txHash) return ""
    return `https://basescan.org/tx/${txHash}`
  }

  // Format countdown
  const getCountdown = () => {
    if (canCheckIn) return null
    const diff = nextCheckIn - Date.now()
    if (diff <= 0) return null
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="glass-card-strong p-5 space-y-4 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-fuchsia-500/20 border-2 border-purple-400/40 box-glow-aqua">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg neon-glow-purple">
          <CalendarCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">Daily Reward</h3>
          <p className="text-xs text-purple-200">Check in & Earn USDC 💰</p>
        </div>
        {network === "base" && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 ml-auto">
            <Zap className="h-3 w-3 text-cyan-400" />
            <span className="text-[10px] font-semibold text-cyan-300">0.000001 ETH</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Status Box */}
        <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
          {canCheckIn ? (
            <span className="text-green-400 font-bold text-sm flex items-center justify-center gap-1">
              <Check className="h-3 w-3" /> Ready
            </span>
          ) : (
            <span className="text-orange-400 font-bold text-sm flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> {getCountdown()}
            </span>
          )}
        </div>

        {/* Reward Box */}
        <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center relative overflow-hidden">
          {claimableReward > 0 && <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />}
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Claimable</span>
          <span className="text-yellow-400 font-bold text-sm">
            {claimableReward > 0 ? "0.005 USDC" : "0.00 USDC"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {/* Main Action Button */}
        {claimableReward > 0 ? (
          <Button
            onClick={handleClaim}
            disabled={status === "claiming" || status === "loading"}
            className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-pulse"
          >
            {status === "claiming" ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Claiming...</>
            ) : (
              <><Gift className="mr-2 h-5 w-5" /> Claim Reward</>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleCheckin}
            disabled={!canCheckIn || status === "loading" || status === "success"}
            className={`w-full h-12 font-semibold transition-all duration-300 ${canCheckIn
                ? "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90 hover:scale-[1.02]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
          >
            {status === "loading" || status === "switching" ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : !canCheckIn ? (
              "Available in " + getCountdown()
            ) : (
              "Check In Now"
            )}
          </Button>
        )}
      </div>

      {status === "success" && txHash && (
        <div className="text-center animate-fade-in">
          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 hover:underline transition-all"
          >
            <span>Transaction Successful! View on Explorer</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </Card>
  )
}
