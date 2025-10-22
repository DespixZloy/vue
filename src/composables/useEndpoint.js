import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import { fetchEndpoint } from '../api/client'

// Нормализация даты к формату Y-m-d
function fmtDate(d) {
  return dayjs(d).format('YYYY-MM-DD')
}

// Пытаемся вытащить числовые поля из первого элемента
function detectNumericKeys(items) {
  const first = items?.[0]
  if (!first) return []
  return Object.entries(first)
    .filter(([_, v]) => typeof v === 'number')
    .map(([k]) => k)
}

// Пытаемся найти поле-даты
function detectDateKey(items) {
  const first = items?.[0]
  if (!first) return null
  const candidates = ['date', 'created_at', 'createdAt', 'saleDate', 'sale_date', 'supplyDate', 'time', 'updated_at']
  for (const key of candidates) {
    if (first[key]) return key
  }
  return null
}

export function useEndpoint(endpoint, { withDateTo = true, defaultDays = 7, initialLimit = 50 } = {}) {
  const loading = ref(false)
  const error = ref(null)
  const items = ref([])
  const page = ref(1)
  const limit = ref(initialLimit)
  const total = ref(null)
  const lastPage = ref(null)

  const today = dayjs()
  const dateFrom = ref(fmtDate(today.subtract(defaultDays, 'day')))
  const dateTo = ref(fmtDate(today))
  // для stocks — только текущий день
  if (endpoint === 'stocks') {
    dateFrom.value = fmtDate(today)
    dateTo.value = fmtDate(today)
  }

  const search = ref('') // простой клиентский текстовый фильтр по строчным полям
  const numericKeys = ref([])
  const selectedMetric = ref(null)
  const dateKey = ref(null)

  const hasNext = computed(() => {
    if (lastPage.value) return page.value < lastPage.value
    return items.value.length >= limit.value
  })
  const hasPrev = computed(() => page.value > 1)

  function resetPage() {
    page.value = 1
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      const params = {
        page: page.value,
        limit: limit.value,
        dateFrom: dateFrom.value,
      }
      if (withDateTo && endpoint !== 'stocks') {
        params.dateTo = dateTo.value
      } else {
        delete params.dateTo
      }

      const { items: data, meta } = await fetchEndpoint(endpoint, params)
      items.value = data || []

      // meta разбор
      if (meta?.total) total.value = meta.total
      if (meta?.last_page || meta?.lastPage) {
        lastPage.value = meta.last_page || meta.lastPage
      } else {
        lastPage.value = null
      }

      // авто-детект для графика
      numericKeys.value = detectNumericKeys(items.value)
      if (!selectedMetric.value) selectedMetric.value = numericKeys.value[0] || null
      dateKey.value = detectDateKey(items.value)
    } catch (e) {
      console.error(e)
      error.value = e?.message || 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }

  function next() {
    if (hasNext.value) {
      page.value += 1
      load()
    }
  }
  function prev() {
    if (hasPrev.value) {
      page.value -= 1
      load()
    }
  }

  // Клиентская фильтрация по строковому поиску
  const filteredItems = computed(() => {
    if (!search.value) return items.value
    const q = search.value.toLowerCase()
    return items.value.filter((row) =>
      Object.values(row).some((v) =>
        typeof v === 'string' ? v.toLowerCase().includes(q) : false
      )
    )
  })

  onMounted(load)
  watch([dateFrom, dateTo, limit], () => { resetPage(); load() })

  return {
    // state
    loading, error, items, filteredItems,
    page, limit, total, lastPage, hasNext, hasPrev,
    dateFrom, dateTo, search, numericKeys, selectedMetric, dateKey,
    // actions
    load, next, prev, resetPage,
  }
}
