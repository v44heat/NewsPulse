// Article types
export interface Article {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: Article[]
}

export interface NewsSource {
  id: string
  name: string
  description: string
  url: string
  category: string
  language: string
  country: string
}

export interface NewsSourcesResponse {
  status: string
  sources: NewsSource[]
}

// Category types
export type Category =
  | 'general'
  | 'business'
  | 'technology'
  | 'sports'
  | 'entertainment'
  | 'health'
  | 'science'

export const CATEGORIES: Category[] = [
  'general',
  'business',
  'technology',
  'sports',
  'entertainment',
  'health',
  'science',
]

export const CATEGORY_LABELS: Record<Category, string> = {
  general: 'General',
  business: 'Business',
  technology: 'Technology',
  sports: 'Sports',
  entertainment: 'Entertainment',
  health: 'Health',
  science: 'Science',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  general: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  business: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  technology: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  sports: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  entertainment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  health: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
  science: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
}

// Search types
export interface SearchFilters {
  query: string
  category?: Category
  from?: string
  to?: string
  sources?: string
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt'
}

// Bookmark types
export interface BookmarkedArticle extends Article {
  bookmarkedAt: string
  id: string
}

// Trending topic types
export interface TrendingTopic {
  keyword: string
  count: number
  category: Category
  articles: Article[]
}

export const TRENDING_TOPICS = [
  { keyword: 'Artificial Intelligence', category: 'technology' as Category },
  { keyword: 'Bitcoin', category: 'business' as Category },
  { keyword: 'Elections', category: 'general' as Category },
  { keyword: 'Climate Change', category: 'science' as Category },
  { keyword: 'SpaceX', category: 'science' as Category },
  { keyword: 'Stock Market', category: 'business' as Category },
  { keyword: 'World Cup', category: 'sports' as Category },
  { keyword: 'Health', category: 'health' as Category },
]

// Analytics types
export interface CategoryStat {
  category: string
  count: number
  fill: string
}

export interface SourceStat {
  name: string
  value: number
}
