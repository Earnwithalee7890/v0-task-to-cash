"use client"

import { Twitter, Linkedin } from "lucide-react"

interface SocialShareButtonsProps {
    userData: {
        score: number
        fid: number
    }
    onShareLinkedIn?: () => void
}

export function SocialShareButtons({ userData, onShareLinkedIn }: SocialShareButtonsProps) {
    const shareUrl = "https://v0-task-to-cash-seven.vercel.app"
    const shareText = `I just checked my Farcaster Reputation on TrueScore! 🎯\n\nMy Score: ${userData.score}\n\nCheck yours here: ${shareUrl}`

    return (
        <div className="grid grid-cols-3 gap-3">
            {/* Twitter / X */}
            <button
                onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')
                }}
                className="group relative flex items-center justify-center gap-2 h-11 rounded-xl bg-black border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Twitter className="h-4 w-4 text-white fill-white" />
                <span className="text-xs font-semibold text-white/90">Post</span>
            </button>

            {/* WhatsApp */}
            <button
                onClick={() => {
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
                }}
                className="group relative flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 hover:border-[#25D366]/40 transition-all overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#25D366]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="text-xs font-semibold text-[#25D366]">Share</span>
            </button>

            {/* LinkedIn - Replaces Facebook if available, else generic or conditional */}
            {onShareLinkedIn ? (
                <button
                    onClick={onShareLinkedIn}
                    className="group relative flex items-center justify-center gap-2 h-11 rounded-xl bg-[#0077B5]/10 border border-[#0077B5]/20 hover:bg-[#0077B5]/20 hover:border-[#0077B5]/40 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0077B5]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <Linkedin className="h-4 w-4 text-[#0077B5] fill-[#0077B5]" />
                    <span className="text-xs font-semibold text-[#0077B5]">Post</span>
                </button>
            ) : (
                <button
                    onClick={() => {
                        // Fallback to copying link
                        navigator.clipboard.writeText(shareUrl)
                    }}
                    className="group relative flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="text-xs font-semibold text-white/70">Copy Link</span>
                </button>
            )}
        </div>
    )
}
