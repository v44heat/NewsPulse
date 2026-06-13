import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { CATEGORY_CHART_COLORS as _colors } from '../utils'
import type { Article } from '../types'
import { CATEGORIES } from '../types'

interface AnalyticsChartsProps {
  articles: Article[]
}

const CHART_COLORS = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#f43f5e', '#14b8a6', '#64748b']

export function AnalyticsCharts({ articles }: AnalyticsChartsProps) {
  // Articles per category (simulated from source names)
  const categoryData = CATEGORIES.map((cat, i) => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: Math.floor(Math.random() * 40) + 10 + (articles.length > 0 ? Math.floor(articles.length / 7) : 0),
    fill: CHART_COLORS[i],
  }))

  // Source distribution
  const sourceCounts = articles.reduce<Record<string, number>>((acc, a) => {
    const name = a.source.name
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {})

  const sourceData = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  // Trending topics (simulated)
  const trendingData = [
    { name: 'AI', value: 38 },
    { name: 'Bitcoin', value: 26 },
    { name: 'Climate', value: 19 },
    { name: 'SpaceX', value: 14 },
    { name: 'Elections', value: 22 },
    { name: 'Health', value: 17 },
  ]

  return (
    <div className="space-y-6">
      {/* Bar chart: articles per category */}
      <div className="card p-6">
        <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Articles Per Category
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" />
            <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400" />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13 }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart: trending topics */}
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Trending Topics
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={trendingData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {trendingData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13 }}
              />
              <Legend formatter={(value) => <span style={{ fontSize: 12, color: 'currentColor' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart: source distribution */}
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Source Distribution
          </h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                >
                  {sourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13 }}
                />
                <Legend formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
              Load articles to see source distribution
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
