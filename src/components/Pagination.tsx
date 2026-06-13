import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../utils'

interface PaginationProps {
  page: number
  totalPages: number
  onNext: () => void
  onPrev: () => void
  onPage: (p: number) => void
}

export function Pagination({ page, totalPages, onNext, onPrev, onPage }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400 dark:text-slate-500">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={cn(
              'min-w-[36px] h-9 px-3 rounded-xl text-sm font-medium transition-all',
              p === page
                ? 'bg-primary-600 text-white shadow-md'
                : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <span className="ml-2 text-sm text-slate-400 dark:text-slate-500">
        Page {page} of {totalPages}
      </span>
    </div>
  )
}
