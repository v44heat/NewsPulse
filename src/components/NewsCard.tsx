import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, Share2, ExternalLink, Clock, User } from 'lucide-react'
import { cn, formatDate, estimateReadTime, buildShareUrl } from '../utils'
import { recentService } from '../services/storage'
import type { Article, Category } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types'

interface NewsCardProps {
  article: Article
  category?: Category
  isBookmarked: boolean
  onToggleBookmark: (article: Article) => void
  size?: 'default' | 'compact' | 'large'
  className?: string
}

export function NewsCard({
  article,
  category,
  isBookmarked,
  onToggleBookmark,
  size = 'default',
  className,
}: NewsCardProps) {
  const [imgError, setImgError] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const readTime = estimateReadTime(article.content)
  const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(article.title.slice(0, 10))}/800/450`

  const handleArticleClick = () => {
    recentService.add(article)
  }

  const imageSrc = (!imgError && article.urlToImage) ? article.urlToImage : fallbackImg

  const articleState = { article, category }

  return (
    <article className={cn('card group hover:shadow-md transition-all duration-300 flex flex-col', className)}>
      {/* Image */}
      <Link
        to="/article"
        state={articleState}
        onClick={handleArticleClick}
        className="block overflow-hidden"
      >
        <div className={cn('relative overflow-hidden bg-slate-100 dark:bg-slate-800', size === 'large' ? 'h-56 sm:h-64' : size === 'compact' ? 'h-36' : 'h-44')}>
          <img
            src={imageSrc}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Category Badge on image */}
          {category && (
            <span className={cn('absolute top-3 left-3 badge text-xs font-semibold', CATEGORY_COLORS[category])}>
              {CATEGORY_LABELS[category]}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Source + Date */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
            {article.source.name}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatDate(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <Link
          to="/article"
          state={articleState}
          onClick={handleArticleClick}
          className="block group/title"
        >
          <h3 className={cn(
            'font-display font-semibold text-slate-900 dark:text-slate-100 group-hover/title:text-primary-600 dark:group-hover/title:text-primary-400 transition-colors leading-snug mb-2',
            size === 'compact' ? 'text-sm line-clamp-2' : 'text-base line-clamp-2'
          )}>
            {article.title}
          </h3>
        </Link>

        {/* Description */}
        {size !== 'compact' && article.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            {article.author && (
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <User className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{article.author.split(',')[0]}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} min read
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Share */}
            <div className="relative">
              <button
                onClick={() => setShareOpen(!shareOpen)}
                aria-label="Share article"
                className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {shareOpen && (
                <div className="absolute right-0 bottom-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2 min-w-[140px] z-10 animate-fade-in">
                  {(['twitter', 'facebook', 'whatsapp'] as const).map((platform) => (
                    <a
                      key={platform}
                      href={buildShareUrl(platform, article.url, article.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShareOpen(false)}
                      className="block px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg capitalize transition-colors"
                    >
                      {platform === 'twitter' ? 'X (Twitter)' : platform}
                    </a>
                  ))}
                  <button
                    onClick={() => { navigator.clipboard.writeText(article.url); setShareOpen(false) }}
                    className="block w-full text-left px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article)}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Save article'}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                isBookmarked
                  ? 'text-accent-500 hover:text-accent-600'
                  : 'text-slate-400 hover:text-accent-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* External Link */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open full article"
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
