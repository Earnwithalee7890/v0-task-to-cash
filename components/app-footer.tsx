export function AppFooter() {
  return (
    <footer className="w-full py-6 mt-8 text-center border-t border-white/5">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-xs text-muted-foreground/50">
          TrueScore v1.0.2 • Built on Farcaster
        </p>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-green-500/80">Systems Online</span>
        </div>
      </div>
    </footer>
  )
}
