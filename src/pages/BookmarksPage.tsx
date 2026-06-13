import { useState } from 'react'
import { Bookmark, Trash2, Clock } from 'lucide-react'
import { NewsCard } from '../components/NewsCard'
import { useBookmarks } from '../hooks'
import { bookmarkService } from '../services/storage'
import { formatDate } from '../utils'

export function BookmarksPage() {
  const { bookmarks, toggle, isBookmarked, refresh } = useBookmarks()
  const [filter, setFilter] = useState<'all' | 'recent'>('all')

  const displayedBookmarks = filter === 'recent'
    ? [...bookmarks].sort((a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()).slice(0, 10)
    : bookmarks

  const handleClearAll = () => {
    if (window.confirm('Clear all bookmarks? This cannot be undone.')) {
      bookmarks.forEach((b) => bookmarkService.remove(b.url))
      refresh()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-accent-500" />
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
            Bookmarks
          </h1>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-3 py-2 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Bookmarks Yet
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs mx-auto">
            Save articles you want to read later by clicking the bookmark icon on any news card.
          </p>
        </div>
      ) : (
        <>
          {/* Stats + Filter */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{bookmarks.length}</span>{' '}
              saved {bookmarks.length === 1 ? 'article' : 'articles'}
            </p>
            <div className="flex gap-2">
              {(['all', 'recent'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f === 'all' ? 'All' : 'Recent'}
                </button>
              ))}
            </div>
          </div>

          {/* Bookmarks grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedBookmarks.map((article, i) => (
              <div key={`${article.url}-${i}`} className="relative">
                <NewsCard
                  article={article}
                  isBookmarked={isBookmarked(article.url)}
                  onToggleBookmark={toggle}
                  className="animate-slide-up"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white/80 text-xs px-2 py-1 rounded-full pointer-events-none">
                  <Clock className="w-3 h-3" />
                  {formatDate(article.bookmarkedAt)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
