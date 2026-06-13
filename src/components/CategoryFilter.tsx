import { cn } from '../utils'
import type { Category } from '../types'
import { CATEGORIES, CATEGORY_LABELS } from '../types'

interface CategoryFilterProps {
  selected: Category | 'all'
  onChange: (cat: Category | 'all') => void
  showAll?: boolean
}

const CATEGORY_ICONS: Record<string, string> = {
  all: '📰',
  general: '🌐',
  business: '💼',
  technology: '💻',
  sports: '⚽',
  entertainment: '🎬',
  health: '❤️',
  science: '🔬',
}

export function CategoryFilter({ selected, onChange, showAll = true }: CategoryFilterProps) {
  const allOptions: Array<Category | 'all'> = showAll ? ['all', ...CATEGORIES] : CATEGORIES

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {allOptions.map((cat) => {
        const isSelected = cat === selected
        const label = cat === 'all' ? 'All News' : CATEGORY_LABELS[cat]
        const emoji = CATEGORY_ICONS[cat]

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
              isSelected
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            )}
          >
            <span className="text-base leading-none">{emoji}</span>
            {label}
          </button>
        )
      })}
    </div>
  )
}
