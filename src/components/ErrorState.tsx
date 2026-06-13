import { AlertCircle, RefreshCw, WifiOff, SearchX } from 'lucide-react'

type ErrorVariant = 'api' | 'network' | 'notfound' | 'generic'

interface ErrorStateProps {
  variant?: ErrorVariant
  message?: string
  onRetry?: () => void
}

const ERROR_CONFIG: Record<ErrorVariant, { icon: React.ReactNode; title: string; description: string }> = {
  api: {
    icon: <AlertCircle className="w-12 h-12 text-amber-500" />,
    title: 'API Limit Reached',
    description: 'You\'ve reached the API rate limit. Please try again in a moment or check your API key.',
  },
  network: {
    icon: <WifiOff className="w-12 h-12 text-rose-500" />,
    title: 'Connection Failed',
    description: 'Unable to connect to the news service. Check your internet connection and try again.',
  },
  notfound: {
    icon: <SearchX className="w-12 h-12 text-slate-400" />,
    title: 'No Results Found',
    description: 'We couldn\'t find any articles matching your search. Try different keywords or filters.',
  },
  generic: {
    icon: <AlertCircle className="w-12 h-12 text-slate-400" />,
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
  },
}

export function ErrorState({ variant = 'generic', message, onRetry }: ErrorStateProps) {
  const config = ERROR_CONFIG[variant]
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4">{config.icon}</div>
      <h3 className="font-display text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
        {config.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {message || config.description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 btn-primary"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}
