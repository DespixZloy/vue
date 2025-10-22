import dayjs from 'dayjs'

export function buildLineSeries(items, dateKey, metricKey) {
  if (!items || !items.length || !metricKey) return { labels: [], data: [] }

  // Сгруппируем по дате (Y-m-d)
  const map = new Map()
  for (const row of items) {
    const dRaw = dateKey && row[dateKey] ? row[dateKey] : row.date || row.created_at || row.createdAt
    const d = dRaw ? dayjs(dRaw).format('YYYY-MM-DD') : 'unknown'
    const val = Number(row[metricKey] || 0)
    map.set(d, (map.get(d) || 0) + (isNaN(val) ? 0 : val))
  }

  const labels = Array.from(map.keys()).sort()
  const data = labels.map((l) => map.get(l))
  return { labels, data }
}
