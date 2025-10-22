export default async function handler(req, res) {
  const API_HOST = 'http://109.73.206.144:6969'
  const API_KEY = process.env.WB_API_KEY
  try {
    // путь вида /api/wb-proxy?endpoint=orders&dateFrom=... 
    const { endpoint, ...rest } = req.query
    if (!endpoint) {
      return res.status(400).json({ error: 'No endpoint' })
    }
    const params = new URLSearchParams(rest)
    params.set('key', API_KEY)
    const url = `${API_HOST}/api/${endpoint}?${params.toString()}`
    const r = await fetch(url)
    const text = await r.text()
    res.setHeader('Content-Type', r.headers.get('content-type') || 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(r.status).send(text)
  } catch (e) {
    res.status(500).json({ error: e.message || 'Proxy error' })
  }
}
