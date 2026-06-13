import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio, ExternalLink, Search } from 'lucide-react'
import { useNewsSources } from '../hooks'
import { ErrorState } from '../components/ErrorState'
import { CategoryFilter } from '../components/CategoryFilter'
import { cn } from '../utils'
import type { Category } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types'

const SOURCE_LOGOS: Record<string, string> = {
  'bbc-news': '🇬🇧',
  'cnn': '📺',
  'reuters': '📡',
  'al-jazeera-english': '🌍',
  'techcrunch': '💻',
  'bloomberg': '💹',
  'espn': '⚽',
  'the-guardian': '📰',
  'the-verge': '🔮',
  'wired': '⚡',
  'national-geographic': '🌿',
  'medical-news-today': '❤️',
}

export function SourcesPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, isError, refetch } = useNewsSources(
    category !== 'all' ? category : undefined
  )

  const sources = (data?.sources ?? []).filter((s) =>
    !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Radio className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
          News Sources
        </h1>
      </div>
      <p className="text-slate-500 dark:text-slate-400 -mt-4">
        Browse and filter articles from trusted news providers worldwide
      </p>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter sources..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-primary-400 transition-all"
          />
        </div>
      </div>

      <CategoryFilter selected={category} onChange={setCategory} showAll />

      {/* Sources Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState variant="network" onRetry={() => refetch()} />
      ) : sources.length === 0 ? (
        <ErrorState variant="notfound" message="No sources found for the selected filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <div
              key={source.id}
              className="card p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(`/search?q=${encodeURIComponent(source.name)}`)}
            >
              <div className="flex items-start gap-3">
                {/* Logo placeholder */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {SOURCE_LOGOS[source.id] || '📰'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm leading-snug">
                      {source.name}
                    </h3>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <span className={cn('badge text-xs mt-1', CATEGORY_COLORS[source.category as Category] || CATEGORY_COLORS.general)}>
                    {CATEGORY_LABELS[source.category as Category] || source.category}
                  </span>
                  {source.description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 line-clamp-2">
                      {source.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <button className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  Browse articles from {source.name} →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
