"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

interface ThemeToggleProps {
  theme: "light" | "dark"
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="h-10 w-10 rounded-full bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-105"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-foreground transition-transform duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-foreground transition-transform duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
