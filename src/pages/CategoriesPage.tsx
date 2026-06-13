import { useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import { NewsCard } from '../components/NewsCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { Pagination } from '../components/Pagination'
import { GridSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'
import { useTopHeadlines, useBookmarks, usePagination } from '../hooks'
import type { Category } from '../types'
import { CATEGORY_LABELS } from '../types'

const PAGE_SIZE = 12

export function CategoriesPage() {
  const [category, setCategory] = useState<Category>('technology')
  const { isBookmarked, toggle } = useBookmarks()

  const { data, isLoading, isError, refetch } = useTopHeadlines({
    category,
    pageSize: PAGE_SIZE,
  })

  const { page, totalPages, goNext, goPrev, setPage } = usePagination(
    data?.totalResults ?? 0,
    PAGE_SIZE
  )

  const articles = data?.articles ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <LayoutGrid className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
          Categories
        </h1>
      </div>

      {/* Category Tabs */}
      <CategoryFilter
        selected={category}
        onChange={(cat) => { if (cat !== 'all') setCategory(cat) }}
        showAll={false}
      />

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
          {CATEGORY_LABELS[category]} News
        </h2>
        {data && (
          <span className="text-sm text-slate-400 dark:text-slate-500">
            {data.totalResults?.toLocaleString()} articles
          </span>
        )}
      </div>

      {/* Articles */}
      {isLoading ? (
        <GridSkeleton count={12} />
      ) : isError ? (
        <ErrorState variant="network" onRetry={() => refetch()} />
      ) : articles.length === 0 ? (
        <ErrorState variant="notfound" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {articles.map((article, i) => (
            <NewsCard
              key={`${article.url}-${i}`}
              article={article}
              category={category}
              isBookmarked={isBookmarked(article.url)}
              onToggleBookmark={toggle}
              className="animate-slide-up"
            />
          ))}
        </div>
      )}

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
