import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { newsService, MOCK_ARTICLES } from '../services/newsApi'
import { bookmarkService } from '../services/storage'
import type { Category, Article, SearchFilters } from '../types'

const IS_DEMO = !import.meta.env.VITE_NEWS_API_KEY || import.meta.env.VITE_NEWS_API_KEY === 'demo'

function getMockData(count = 8) {
  const shuffled = [...MOCK_ARTICLES].sort(() => Math.random() - 0.5)
  return {
    status: 'ok',
    totalResults: MOCK_ARTICLES.length,
    articles: shuffled.slice(0, count),
  }
}

// Hook: top headlines
export function useTopHeadlines(params: {
  category?: Category
  page?: number
  pageSize?: number
} = {}) {
  return useQuery({
    queryKey: ['headlines', params],
    queryFn: async () => {
      if (IS_DEMO) return getMockData(params.pageSize || 8)
      return newsService.getTopHeadlines(params)
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Hook: search articles
export function useSearchArticles(filters: SearchFilters & { page?: number }, enabled = true) {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: async () => {
      if (IS_DEMO) {
        const results = getMockData(20)
        return { ...results, totalResults: MOCK_ARTICLES.length }
      }
      return newsService.searchEverything(filters)
    },
    enabled: enabled && !!filters.query,
    staleTime: 3 * 60 * 1000,
  })
}

// Hook: trending topic
export function useTrendingTopic(keyword: string) {
  return useQuery({
    queryKey: ['trending', keyword],
    queryFn: async () => {
      if (IS_DEMO) return getMockData(5)
      return newsService.getTrendingTopic(keyword)
    },
    staleTime: 10 * 60 * 1000,
  })
}

// Hook: news sources
export function useNewsSources(category?: Category) {
  return useQuery({
    queryKey: ['sources', category],
    queryFn: async () => {
      if (IS_DEMO) {
        return {
          status: 'ok',
          sources: [
            { id: 'bbc-news', name: 'BBC News', description: 'BBC News - World', url: 'https://bbc.com', category: 'general', language: 'en', country: 'gb' },
            { id: 'cnn', name: 'CNN', description: 'CNN - Breaking News', url: 'https://cnn.com', category: 'general', language: 'en', country: 'us' },
            { id: 'reuters', name: 'Reuters', description: 'Reuters News', url: 'https://reuters.com', category: 'general', language: 'en', country: 'us' },
            { id: 'techcrunch', name: 'TechCrunch', description: 'TechCrunch - Tech News', url: 'https://techcrunch.com', category: 'technology', language: 'en', country: 'us' },
            { id: 'bloomberg', name: 'Bloomberg', description: 'Bloomberg Business News', url: 'https://bloomberg.com', category: 'business', language: 'en', country: 'us' },
            { id: 'al-jazeera-english', name: 'Al Jazeera English', description: 'Al Jazeera English', url: 'https://aljazeera.com', category: 'general', language: 'en', country: 'qa' },
            { id: 'espn', name: 'ESPN', description: 'ESPN - Sports News', url: 'https://espn.com', category: 'sports', language: 'en', country: 'us' },
            { id: 'the-guardian', name: 'The Guardian', description: 'The Guardian', url: 'https://theguardian.com', category: 'general', language: 'en', country: 'gb' },
          ],
        }
      }
      return newsService.getSources(category)
    },
    staleTime: 30 * 60 * 1000,
  })
}

// Hook: bookmarks
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => bookmarkService.getAll())

  const refresh = useCallback(() => {
    setBookmarks(bookmarkService.getAll())
  }, [])

  const toggle = useCallback((article: Article) => {
    bookmarkService.toggle(article)
    refresh()
  }, [refresh])

  const isBookmarked = useCallback((url: string) => {
    return bookmarks.some((b) => b.url === url)
  }, [bookmarks])

  return { bookmarks, toggle, isBookmarked, refresh }
}

// Hook: debounced value
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

// Hook: pagination
export function usePagination(totalResults: number, pageSize: number) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(totalResults / pageSize)

  return {
    page,
    totalPages,
    setPage,
    canNext: page < totalPages,
    canPrev: page > 1,
    goNext: () => setPage((p) => Math.min(p + 1, totalPages)),
    goPrev: () => setPage((p) => Math.max(p - 1, 1)),
    reset: () => setPage(1),
  }
}
