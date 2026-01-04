export function AppFooter() {
  return (
    <footer className="w-full py-6 mt-8 text-center border-t border-white/5 space-y-4">
      {/* Donation Section */}
      <div
        onClick={() => {
          navigator.clipboard.writeText("0xBD3aDb162D1C5c211075C75DFe3dCD14b549433A")
          // Assuming toast is available or use simple alert/console for now if not imported
          // importing toast from sonner if possible, else just copy
          import("sonner").then(({ toast }) => toast.success("Address copied! Thanks for support! 💖"))
        }}
        className="mx-auto max-w-[200px] py-1.5 px-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-pink-500/30 transition-all cursor-pointer group"
      >
        <p className="text-[10px] text-muted-foreground group-hover:text-pink-200 transition-colors">
          Support Dev <span className="text-pink-500">♥</span>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-xs text-muted-foreground/50">
          TrueScore v1.1.0 • Built on Farcaster
        </p>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-green-500/80">Systems Online</span>
        </div>
      </div>
    </footer>
  )
}
