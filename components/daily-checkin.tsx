"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarCheck, Loader2, Check, ExternalLink, Zap } from "lucide-react"
import { useAccount, useConnect, useSendTransaction, useSwitchChain, useChainId, useWriteContract } from "wagmi"
import { base, celo, mainnet } from "wagmi/chains"

// Base Check-In Contract Configuration (Production - Mainnet)
const BASE_CHECKIN_CONTRACT = {
  address: "0xBD3aDb162D1C5c211075C75DFe3dCD14b549433A" as `0x${string}`,
  checkInFee: BigInt(1_000_000_000_000), // 0.000001 ETH in wei
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
      name: "checkInFeeWei",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "users",
      outputs: [
        { internalType: "uint64", name: "totalCheckIns", type: "uint64" },
        { internalType: "uint64", name: "currentStreak", type: "uint64" },
        { internalType: "uint64", name: "lastCheckInDay", type: "uint64" },
        { internalType: "uint256", name: "reputation", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "user", type: "address" },
        { indexed: false, internalType: "uint64", name: "dayIndex", type: "uint64" },
        { indexed: false, internalType: "uint64", name: "totalCheckIns", type: "uint64" },
        { indexed: false, internalType: "uint64", name: "currentStreak", type: "uint64" },
        { indexed: false, internalType: "uint256", name: "reputation", type: "uint256" },
      ],
      name: "CheckedIn",
      type: "event",
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
  {
    id: "celo",
    name: "Celo",
    chainId: celo.id,
    explorerUrl: "https://celoscan.io/tx/",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    chainId: mainnet.id,
    explorerUrl: "https://etherscan.io/tx/",
  },
  {
    id: "monad",
    name: "Monad",
    chainId: 10143,
    explorerUrl: "https://testnet.monadexplorer.com/tx/",
  },
]

export function DailyCheckin() {
  const [network, setNetwork] = useState("base")
  const [status, setStatus] = useState<"idle" | "switching" | "loading" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [lastCheckin, setLastCheckin] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { sendTransactionAsync, reset: resetTransaction } = useSendTransaction()
  const { writeContractAsync } = useWriteContract()
  const { switchChainAsync } = useSwitchChain()
  const currentChainId = useChainId()

  const selectedNetwork = NETWORKS.find((n) => n.id === network)

  const sendCheckinTransaction = async () => {
    if (!address || !selectedNetwork) return

    try {
      setStatus("loading")

      // Reset any previous transaction state
      resetTransaction()

      let result: `0x${string}` | undefined

      // For Base network, call the smart contract with fee
      if (selectedNetwork.id === "base") {
        result = await writeContractAsync({
          address: BASE_CHECKIN_CONTRACT.address,
          abi: BASE_CHECKIN_CONTRACT.abi,
          functionName: "checkIn",
          chainId: selectedNetwork.chainId,
          value: BASE_CHECKIN_CONTRACT.checkInFee, // 0.000001 ETH anti-spam fee
        })
      } else {
        // For other networks, send self-transaction as check-in proof (0 value to self)
        result = await sendTransactionAsync({
          to: address,
          value: BigInt(0),
          data: "0x436865636b496e" as `0x${string}`, // "CheckIn" in hex
          chainId: selectedNetwork.chainId,
        })
      }

      if (result) {
        setTxHash(result)
        setLastCheckin(new Date().toLocaleDateString())
        setStatus("success")
      } else {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 3000)
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const handleCheckin = async () => {
    if (!isConnected) {
      try {
        connect({ connector: connectors[0] })
        return
      } catch (err) {
        console.error("Connection failed:", err)
        setStatus("error")
        setTimeout(() => setStatus("idle"), 3000)
        return
      }
    }

    if (!address || !selectedNetwork) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
      return
    }

    setTxHash(null)

    try {
      if (currentChainId === selectedNetwork.chainId) {
        // Already on correct chain, send transaction directly
        await sendCheckinTransaction()
      } else {
        // Need to switch chain first
        setStatus("switching")
        await switchChainAsync({ chainId: selectedNetwork.chainId })
        // Small delay to ensure chain switch is propagated
        await new Promise((resolve) => setTimeout(resolve, 500))
        await sendCheckinTransaction()
      }
    } catch (error) {
      console.error("Check-in failed:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const getExplorerUrl = () => {
    if (!txHash) return ""
    const net = NETWORKS.find((n) => n.id === network)
    return net ? `${net.explorerUrl}${txHash}` : ""
  }

  const getButtonText = () => {
    if (!isConnected) return "Connect"
    if (status === "switching") return "Switching..."
    if (status === "loading") return "Sending..."
    if (status === "success") return "Done!"
    return "Check In"
  }

  return (
    <Card className="glass-card-strong p-5 space-y-4 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-fuchsia-500/20 border-2 border-purple-400/40 box-glow-aqua">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg neon-glow-purple">
            <CalendarCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">Daily Check-In</h3>
            <p className="text-xs text-purple-200">Earn on-chain proof 🎯</p>
          </div>
        </div>
        {network === "base" && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <Zap className="h-3 w-3 text-cyan-400" />
            <span className="text-[10px] font-semibold text-cyan-300">0.000001 ETH fee</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Select value={network} onValueChange={setNetwork}>
          <SelectTrigger className="flex-1 bg-secondary/50 border-border/50 h-12 transition-all hover:bg-secondary/70">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            {NETWORKS.map((net) => (
              <SelectItem key={net.id} value={net.id} className="cursor-pointer">
                <span className="font-medium">{net.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleCheckin}
          disabled={status === "loading" || status === "switching" || status === "success"}
          className={`h-12 px-6 font-semibold transition-all duration-300 ${status === "success"
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            }`}
        >
          {(status === "loading" || status === "switching") && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {status === "success" && <Check className="mr-2 h-4 w-4" />}
          {getButtonText()}
        </Button>
      </div>

      {status === "success" && txHash && (
        <a
          href={getExplorerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline transition-all hover:gap-2"
        >
          <span>View transaction</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      {status === "error" && (
        <p className="text-sm text-destructive flex items-center gap-2">Check-in failed. Please try again.</p>
      )}
    </Card>
  )
}
