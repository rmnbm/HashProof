const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur serveur est survenue.')
  }

  return data
}

export function fetchApi(path) {
  return request(path)
}

export function postApi(path, payload) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function deleteApi(path) {
  return request(path, {
    method: 'DELETE',
  })
}
