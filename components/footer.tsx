export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/60 text-sm">Rayvolution Pakistan © 2025 | AI for a Brighter Future</p>
          <div className="flex gap-6 text-sm text-foreground/60">
            <a href="#privacy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#terms" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
