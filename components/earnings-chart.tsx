"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { motion } from "framer-motion"
import { TrendingUp, DollarSign } from "lucide-react"

interface EarningsChartProps {
    data?: { month: string; income: number }[]
}

export function EarningsChart({ data }: EarningsChartProps) {
    if (!data || data.length === 0) return null

    const totalIncome = data.reduce((acc, curr) => acc + curr.income, 0)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-strong p-6 rounded-2xl neon-border-blue overflow-hidden relative"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-blue-300">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Farcaster Income (2025)</span>
                    </div>
                    <div className="text-[10px] text-white/40 font-medium">Monthly Reward Distribution Breakdown</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Total Rewards</div>
                    <div className="text-xl font-black text-white font-mono">${totalIncome.toLocaleString()}</div>
                </div>
            </div>

            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-2 rounded-lg shadow-xl">
                                            <div className="text-[10px] font-bold text-white/40 uppercase mb-1">{payload[0].payload.month}</div>
                                            <div className="text-sm font-black text-blue-400 font-mono">${payload[0].value} USDC</div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar
                            dataKey="income"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === data.length - 1 ? "#60a5fa" : "rgba(96, 165, 250, 0.3)"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <DollarSign className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                    <div className="text-xs font-bold text-blue-200">Consistency Bonus Active</div>
                    <div className="text-[10px] text-blue-300/60 leading-tight">Your rewards are higher than 85% of active Far-casters.</div>
                </div>
            </div>
        </motion.div>
    )
}
