import { http, createConfig } from "wagmi"
import { base, celo, mainnet } from "wagmi/chains"
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"

// Define Monad testnet
const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" },
  },
} as const

export const config = createConfig({
  chains: [base, celo, mainnet, monadTestnet],
  transports: {
    [base.id]: http(),
    [celo.id]: http(),
    [mainnet.id]: http(),
    [monadTestnet.id]: http(),
  },
  connectors: [farcasterMiniApp()],
})
