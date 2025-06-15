import { useState, useCallback } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  const request = useCallback(async <T,>(config: AxiosRequestConfig) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.request<T>(config)
      return response.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { request, loading, error }
}
