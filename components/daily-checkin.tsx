"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarCheck, Loader2, Check, ExternalLink, Zap } from "lucide-react"
import { useAccount, useConnect, useSendTransaction, useSwitchChain, useChainId } from "wagmi"
import { base, celo, mainnet } from "wagmi/chains"

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
  const { switchChainAsync } = useSwitchChain()
  const currentChainId = useChainId()

  const selectedNetwork = NETWORKS.find((n) => n.id === network)

  const sendCheckinTransaction = async () => {
    if (!address || !selectedNetwork) return

    try {
      setStatus("loading")

      // Reset any previous transaction state
      resetTransaction()

      // Send self-transaction as check-in proof (0 value to self)
      const result = await sendTransactionAsync({
        to: address,
        value: BigInt(0),
        data: "0x436865636b496e" as `0x${string}`, // "CheckIn" in hex
        chainId: selectedNetwork.chainId, // Explicitly pass chainId
      })

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
