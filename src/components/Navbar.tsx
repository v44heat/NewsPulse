import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Moon, Sun, Bookmark, TrendingUp, LayoutGrid, Home, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../utils'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/trending', label: 'Trending', icon: TrendingUp },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
      setSearchValue('')
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0a0f1e]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <svg width="34" height="34" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 drop-shadow-md group-hover:drop-shadow-lg transition-all">
              <defs>
                <linearGradient id="logo-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1d4ed8"/>
                  <stop offset="100%" stopColor="#f97316"/>
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="16" fill="url(#logo-bg)"/>
              <rect x="13" y="14" width="8" height="36" rx="3" fill="white" opacity="0.97"/>
              <polygon points="13,14 21,14 51,50 43,50" fill="white" opacity="0.97"/>
              <rect x="43" y="14" width="8" height="36" rx="3" fill="white" opacity="0.97"/>
              <circle cx="50" cy="15" r="5.5" fill="#fbbf24"/>
              <circle cx="50" cy="15" r="3" fill="white"/>
            </svg>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              News<span className="text-accent-500">Pulse</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search news, topics, sources..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/60 border border-transparent focus:border-primary-400 dark:focus:border-primary-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                  location.pathname === to
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1e] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search news..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
                />
              </div>
            </form>
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  location.pathname === to
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
