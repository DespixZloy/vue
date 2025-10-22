import axios from 'axios'

const DEV = import.meta.env.DEV
const USE_SERVERLESS = import.meta.env.VITE_USE_SERVERLESS === 'true'

// В DEV идем через Vite proxy на /api, в PROD — через serverless функцию
const baseURL = import.meta.env.VITE_API_BASE || (DEV ? '/api' : '/.netlify/functions/wb-proxy')

// axios инстанс
export const http = axios.create({
  baseURL,
  timeout: 30000,
})

// Универсальный запрос к эндпоинту.
// endpoint: 'orders' | 'sales' | 'stocks' | 'incomes'
export async function fetchEndpoint(endpoint, params = {}) {
  // В DEV (прямой прокси) — ключ добавляем в строку запроса
  // В PROD (serverless) — ключ добавляется внутри функции, тут ничего не добавляем
  const finalParams = { ...params }

  if (!USE_SERVERLESS) {
    // В DEV проксируем напрямую на бэкенд, нужно передать key
    finalParams.key = params.key || 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'
  }

  // Для DEV путь будет /api/{endpoint}; Для PROD — /.netlify/functions/wb-proxy/{endpoint}
  const url = USE_SERVERLESS ? `/${endpoint}` : `/api/${endpoint}`

  const res = await http.get(url, { params: finalParams })

  // Ожидаем JSON. Пагинация: попытаемся считать универсально.
  const data = res.data

  // Если API отдает прямо массив — завернем.
  let items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : data?.items || [])
  let meta = data?.meta || data?.pagination || {}

  return { items, raw: data, meta }
}
