'use client'

import React from 'react'
import { Box, CircularProgress, TextField, Button } from '@mui/material'
import GridTable from './GridTable'
import { CodeRow } from './TableClient'

export default function GridInfinite({ initialData }: { initialData?: CodeRow[] }) {
  const [items, setItems] = React.useState<CodeRow[]>(initialData || [])
  const [page, setPage] = React.useState(1)
  const [hasMore, setHasMore] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const limit = 12
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (initialData && initialData.length) setItems(initialData)
  }, [initialData])

  const fetchMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = page + 1
    try {
      const res = await fetch(`/api/codes/list?page=${nextPage}&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}`)
      const json = await res.json()
      const data: CodeRow[] = json.data || []
      if (data.length < limit) setHasMore(false)
      setItems((s) => [...s, ...data])
      setPage(nextPage)
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!sentinelRef.current) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) fetchMore()
      })
    })
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, page, loading, hasMore])

  const [q, setQ] = React.useState('')

  const applyFilter = async () => {
    // reset and fetch first page with filter
    setItems([])
    setPage(0)
    setHasMore(true)
    setLoading(true)
    try {
      const res = await fetch(`/api/codes/list?page=1&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}`)
      const json = await res.json()
      const data: CodeRow[] = json.data || []
      setItems(data)
      setPage(1)
      if (data.length < limit) setHasMore(false)
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField size="small" placeholder="Filtrar por código" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outlined" onClick={applyFilter}>Aplicar</Button>
      </Box>
      <GridTable initialCodes={items} />
      <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        {loading ? <CircularProgress /> : hasMore ? <Box sx={{ height: 24 }} /> : <Box>No hay más códigos.</Box>}
      </Box>
    </Box>
  )
}
