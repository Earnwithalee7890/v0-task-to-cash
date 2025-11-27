"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Coins, Loader2, Sparkles, Copy, Check } from "lucide-react"
import { useAccount, useConnect, useSendTransaction } from "wagmi"
import { parseEther } from "viem"

const WALLET_ADDRESS = "0xBC74eA115f4f30Ce737F394a93701Abd1642d7D1" as const

export function TipButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [copied, setCopied] = useState(false)

  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { sendTransactionAsync } = useSendTransaction()

  const handleTip = async () => {
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

    setStatus("loading")

    try {
      await sendTransactionAsync({
        to: WALLET_ADDRESS,
        value: parseEther("0.001"),
      })
      setStatus("success")
      setTimeout(() => setStatus("idle"), 3000)
    } catch (error) {
      console.error("Tip failed:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(WALLET_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <Card className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-chart-3/30 to-chart-3/10 flex items-center justify-center">
          <Coins className="h-5 w-5 text-chart-3" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Tip the Creator</h3>
          <p className="text-xs text-muted-foreground">Support with 0.001 ETH</p>
        </div>
      </div>

      {/* Wallet Address Display */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
        <code className="flex-1 text-xs text-muted-foreground font-mono">{shortenAddress(WALLET_ADDRESS)}</code>
        <Button variant="ghost" size="sm" onClick={copyAddress} className="h-8 w-8 p-0">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
        </Button>
      </div>

      <Button
        onClick={handleTip}
        disabled={status === "loading"}
        className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
          status === "success"
            ? "bg-primary text-primary-foreground"
            : status === "error"
              ? "bg-destructive text-destructive-foreground"
              : "bg-gradient-to-r from-chart-3 to-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {status === "loading" && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {status === "success" && <Sparkles className="mr-2 h-5 w-5" />}
        {status === "idle" && <Coins className="mr-2 h-5 w-5" />}
        {status === "error" && <Coins className="mr-2 h-5 w-5" />}
        {status === "loading"
          ? "Sending..."
          : status === "success"
            ? "Tip Sent!"
            : status === "error"
              ? "Failed - Try Again"
              : isConnected
                ? "Send Tip"
                : "Connect & Tip"}
      </Button>
    </Card>
  )
}
