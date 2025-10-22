// netlify/functions/wb-proxy.js
const API_HOST = 'http://109.73.206.144:6969'
const API_KEY = process.env.WB_API_KEY // задайте в Netlify Dashboard -> Environment variables

export async function handler(event) {
  try {
    // Ожидаем путь вида /.netlify/functions/wb-proxy/orders
    const parts = (event.path || '').split('/')
    const endpoint = parts.pop() || parts.pop() // orders | sales | stocks | incomes

    if (!endpoint) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No endpoint' }) }
    }

    const params = new URLSearchParams(event.queryStringParameters || {})
    params.set('key', API_KEY)

    const url = `${API_HOST}/api/${endpoint}?${params.toString()}`

    const r = await fetch(url)
    const body = await r.text()

    return {
      statusCode: r.status,
      headers: {
        'Content-Type': r.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message || 'Proxy error' }),
    }
  }
}
