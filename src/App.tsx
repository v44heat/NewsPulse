import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'
import { TrendingPage } from './pages/TrendingPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { BookmarksPage } from './pages/BookmarksPage'
import { ArticleDetailsPage } from './pages/ArticleDetailsPage'
import { SourcesPage } from './pages/SourcesPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { Radio, BarChart2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1e] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="footer-logo-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1d4ed8"/>
                  <stop offset="100%" stopColor="#f97316"/>
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="16" fill="url(#footer-logo-bg)"/>
              <rect x="13" y="14" width="8" height="36" rx="3" fill="white" opacity="0.97"/>
              <polygon points="13,14 21,14 51,50 43,50" fill="white" opacity="0.97"/>
              <rect x="43" y="14" width="8" height="36" rx="3" fill="white" opacity="0.97"/>
              <circle cx="50" cy="15" r="5.5" fill="#fbbf24"/>
              <circle cx="50" cy="15" r="3" fill="white"/>
            </svg>
            <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
              News<span className="text-accent-500">Pulse</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500 italic">
            "Stay informed. Stay ahead."
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/sources" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors">
              <Radio className="w-4 h-4" /> Sources
            </Link>
            <Link to="/analytics" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors">
              <BarChart2 className="w-4 h-4" /> Analytics
            </Link>
            <span>© 2025 NewsPulse</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function DemoBanner() {
  const isDemo = !import.meta.env.VITE_NEWS_API_KEY || import.meta.env.VITE_NEWS_API_KEY === 'demo'
  if (!isDemo) return null
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-center text-sm text-amber-700 dark:text-amber-400">
      🔑 Demo mode — Set <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 px-1 rounded">VITE_NEWS_API_KEY</code> in <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/40 px-1 rounded">.env</code> for live news.{' '}
      <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">Get a free key →</a>
    </div>
  )
}

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/article" element={<ArticleDetailsPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}
