"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Shield } from "lucide-react"

interface TOSModalProps {
    isOpen: boolean
    onClose: () => void
}

export function TOSModal({ isOpen, onClose }: TOSModalProps) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-sm glass-card-strong p-6 rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/20 max-h-[80vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Terms of Service</h2>
                    </div>

                    <div className="overflow-y-auto pr-2 space-y-4 text-sm text-gray-300 custom-scrollbar">
                        <p>Welcome to TrueScore. By using this mini-app, you agree to the following terms:</p>

                        <section>
                            <h3 className="font-bold text-cyan-300 mb-1">1. Data Usage</h3>
                            <p>We use public data from Farcaster and Neynar to calculate your reputation score. We do not store sensitive personal data.</p>
                        </section>

                        <section>
                            <h3 className="font-bold text-cyan-300 mb-1">2. Disclaimer</h3>
                            <p>TrueScore metrics are for informational purposes only. "Reputation" is a derived metric and does not guarantee trust or financial value.</p>
                        </section>

                        <section>
                            <h3 className="font-bold text-cyan-300 mb-1">3. Privacy</h3>
                            <p>We respect your privacy. All analysis is performed on-chain or via public APIs.</p>
                        </section>

                        <section>
                            <h3 className="font-bold text-cyan-300 mb-1">4. Changes</h3>
                            <p>We reserve the right to modify these terms at any time.</p>
                        </section>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <button
                            onClick={onClose}
                            className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                        >
                            I Agree
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
