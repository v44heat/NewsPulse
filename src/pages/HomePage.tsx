import { useState } from 'react'
import { HeroNewsCard } from '../components/HeroNewsCard'
import { NewsCard } from '../components/NewsCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { Pagination } from '../components/Pagination'
import { HeroSkeleton, GridSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'
import { useTopHeadlines, useBookmarks, usePagination } from '../hooks'
import type { Category } from '../types'
import { TrendingUp, Flame } from 'lucide-react'

const PAGE_SIZE = 8

export function HomePage() {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const { isBookmarked, toggle } = useBookmarks()

  const { data, isLoading, isError, refetch } = useTopHeadlines({
    category: category === 'all' ? undefined : category,
    pageSize: PAGE_SIZE + 1, // +1 for hero
  })

  const articles = data?.articles ?? []
  const heroArticle = articles[0]
  const gridArticles = articles.slice(1)

  const { page, totalPages, goNext, goPrev, setPage } = usePagination(
    data?.totalResults ?? 0,
    PAGE_SIZE
  )

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorState variant="network" onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
            Today's News
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Stay informed with the latest headlines
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <Flame className="w-4 h-4 text-accent-500" />
          <span>{data?.totalResults?.toLocaleString() ?? '–'} articles today</span>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter selected={category} onChange={setCategory} showAll />

      {/* Hero Article */}
      {isLoading ? (
        <HeroSkeleton />
      ) : heroArticle ? (
        <HeroNewsCard
          article={heroArticle}
          isBookmarked={isBookmarked(heroArticle.url)}
          onToggleBookmark={toggle}
        />
      ) : null}

      {/* Headlines Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
            Latest Headlines
          </h2>
        </div>

        {isLoading ? (
          <GridSkeleton count={8} />
        ) : gridArticles.length === 0 ? (
          <ErrorState variant="notfound" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {gridArticles.map((article, i) => (
              <NewsCard
                key={`${article.url}-${i}`}
                article={article}
                category={category !== 'all' ? category : undefined}
                isBookmarked={isBookmarked(article.url)}
                onToggleBookmark={toggle}
                className="animate-slide-up"
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onNext={goNext}
          onPrev={goPrev}
          onPage={setPage}
        />
      )}
    </div>
  )
}
