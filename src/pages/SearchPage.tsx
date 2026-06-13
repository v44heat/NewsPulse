import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Clock, Filter, SlidersHorizontal } from 'lucide-react'
import { NewsCard } from '../components/NewsCard'
import { Pagination } from '../components/Pagination'
import { GridSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'
import { useSearchArticles, useBookmarks, useDebounce, usePagination } from '../hooks'
import { searchService } from '../services/storage'
import type { Category } from '../types'
import { CATEGORIES, CATEGORY_LABELS } from '../types'
import { cn } from '../utils'

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'Latest' },
  { value: 'relevancy', label: 'Relevance' },
  { value: 'popularity', label: 'Popularity' },
]

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [inputValue, setInputValue] = useState(initialQuery)
  const [sortBy, setSortBy] = useState<'publishedAt' | 'relevancy' | 'popularity'>('publishedAt')
  const [filterCategory, setFilterCategory] = useState<Category | ''>('')
  const [showFilters, setShowFilters] = useState(false)
  const [recentSearches, setRecentSearches] = useState(searchService.getRecent())
  const [showSuggestions, setShowSuggestions] = useState(false)

  const debouncedQuery = useDebounce(inputValue, 400)
  const { isBookmarked, toggle } = useBookmarks()

  const filters = {
    query: debouncedQuery,
    sortBy,
    category: filterCategory || undefined,
  }

  const { data, isLoading, isError, refetch } = useSearchArticles(filters, !!debouncedQuery)

  const { page, totalPages, goNext, goPrev, setPage, reset } = usePagination(
    data?.totalResults ?? 0,
    PAGE_SIZE
  )

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery })
      searchService.add(debouncedQuery)
      setRecentSearches(searchService.getRecent())
      reset()
    }
  }, [debouncedQuery])

  const handleClearInput = () => {
    setInputValue('')
    setSearchParams({})
  }

  const handleRecentSearch = (q: string) => {
    setInputValue(q)
    setShowSuggestions(false)
  }

  const handleRemoveRecent = (q: string) => {
    searchService.remove(q)
    setRecentSearches(searchService.getRecent())
  }

  const articles = data?.articles ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Search News
        </h1>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search articles, topics, sources..."
                className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary-400 dark:focus:border-primary-500 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all shadow-sm text-base"
                aria-label="Search news"
              />
              {inputValue && (
                <button
                  onClick={handleClearInput}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'p-3.5 rounded-2xl border transition-all',
                showFilters
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
              )}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && recentSearches.length > 0 && !inputValue && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-10 animate-fade-in overflow-hidden">
              <div className="p-3">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2 px-2">
                  Recent Searches
                </p>
                {recentSearches.map((q) => (
                  <div key={q} className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl px-2 py-1.5 group">
                    <button
                      className="flex items-center gap-2 flex-1 text-left text-sm text-slate-700 dark:text-slate-300"
                      onMouseDown={() => handleRecentSearch(q)}
                    >
                      <Clock className="w-4 h-4 text-slate-400" />
                      {q}
                    </button>
                    <button
                      onMouseDown={() => handleRemoveRecent(q)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                  <Filter className="w-3 h-3 inline mr-1" />
                  Sort By
                </label>
                <div className="flex gap-2 flex-wrap">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value as typeof sortBy)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm transition-all',
                        sortBy === opt.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as Category | '')}
                  className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm outline-none border border-transparent focus:border-primary-400"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {!debouncedQuery ? (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Enter a keyword to search for news articles</p>
        </div>
      ) : isLoading ? (
        <GridSkeleton count={12} />
      ) : isError ? (
        <ErrorState variant="network" onRetry={() => refetch()} />
      ) : articles.length === 0 ? (
        <ErrorState variant="notfound" message={`No results found for "${debouncedQuery}"`} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {data?.totalResults?.toLocaleString()}
              </span>{' '}
              results for <span className="text-primary-600 dark:text-primary-400">"{debouncedQuery}"</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map((article, i) => (
              <NewsCard
                key={`${article.url}-${i}`}
                article={article}
                isBookmarked={isBookmarked(article.url)}
                onToggleBookmark={toggle}
                className="animate-slide-up"
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onNext={goNext}
            onPrev={goPrev}
            onPage={setPage}
          />
        </>
      )}
    </div>
  )
}
