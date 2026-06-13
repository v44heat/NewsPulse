import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ChevronRight, Loader2 } from 'lucide-react'
import { NewsCard } from '../components/NewsCard'
import { useBookmarks, useTrendingTopic } from '../hooks'
import { TRENDING_TOPICS, CATEGORY_COLORS, CATEGORY_LABELS } from '../types'
import { cn } from '../utils'

const TOPIC_EMOJIS: Record<string, string> = {
  'Artificial Intelligence': '🤖',
  'Bitcoin': '₿',
  'Elections': '🗳️',
  'Climate Change': '🌍',
  'SpaceX': '🚀',
  'Stock Market': '📈',
  'World Cup': '⚽',
  'Health': '❤️',
}

function TrendingTopicCard({ topic, isActive, onClick }: {
  topic: typeof TRENDING_TOPICS[0]
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-2xl border transition-all',
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 shadow-sm'
          : 'bg-white dark:bg-[#1a2235] border-slate-200 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-700'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{TOPIC_EMOJIS[topic.keyword] || '📰'}</span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {topic.keyword}
            </p>
            <span className={cn('badge text-xs', CATEGORY_COLORS[topic.category])}>
              {CATEGORY_LABELS[topic.category]}
            </span>
          </div>
        </div>
        <ChevronRight className={cn('w-4 h-4 transition-transform text-slate-400', isActive && 'rotate-90 text-primary-600')} />
      </div>
    </button>
  )
}

function TopicArticles({ keyword }: { keyword: string }) {
  const { data, isLoading } = useTrendingTopic(keyword)
  const { isBookmarked, toggle } = useBookmarks()
  const articles = data?.articles ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {articles.slice(0, 4).map((article, i) => (
        <NewsCard
          key={`${article.url}-${i}`}
          article={article}
          isBookmarked={isBookmarked(article.url)}
          onToggleBookmark={toggle}
          size="compact"
          className="animate-fade-in"
        />
      ))}
      {articles.length === 0 && (
        <p className="col-span-2 text-center text-slate-400 dark:text-slate-500 py-8">
          No articles found for this topic
        </p>
      )}
    </div>
  )
}

export function TrendingPage() {
  const [activeTopic, setActiveTopic] = useState(TRENDING_TOPICS[0].keyword)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-6 h-6 text-accent-500" />
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
            Trending Now
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Most searched topics and breaking stories right now
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Hot Topics
          </h2>
          {TRENDING_TOPICS.map((topic) => (
            <TrendingTopicCard
              key={topic.keyword}
              topic={topic}
              isActive={activeTopic === topic.keyword}
              onClick={() => setActiveTopic(topic.keyword)}
            />
          ))}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <Link
              to="/search?q=trending"
              className="block w-full text-center py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors font-medium"
            >
              Explore More Topics →
            </Link>
          </div>
        </div>

        {/* Articles Panel */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{TOPIC_EMOJIS[activeTopic] || '📰'}</span>
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
              {activeTopic}
            </h2>
          </div>
          <TopicArticles keyword={activeTopic} />
        </div>
      </div>
    </div>
  )
}
