'use client'

import React from 'react'
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Button, CircularProgress, Pagination, Tooltip, IconButton, TableSortLabel } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { QueueType, QueueStatusType } from '@/types/queue.types'

export default function QueueTable({ initialData, initialCount }: { initialData: QueueType[]; initialCount: number }) {
  const [items, setItems] = React.useState<QueueType[]>(initialData || [])
  const [count, setCount] = React.useState<number>(initialCount || 0)
  const [page, setPage] = React.useState(1)
  const [limit] = React.useState(12)
  const [statusFilter, setStatusFilter] = React.useState<string | ''>('')
  const [q, setQ] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [sortBy, setSortBy] = React.useState<string>('created_at')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const fetchPage = async (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(p))
    params.set('limit', String(limit))
    if (statusFilter) params.set('status', statusFilter)
    if (q) params.set('q', q)
    if (sortBy) params.set('sort_by', sortBy)
    if (sortDir) params.set('sort_dir', sortDir)

    const res = await fetch(`/api/queue/list?${params.toString()}`)
    const json = await res.json()
    setItems(json.data || [])
    setCount(json.count || 0)
    setPage(p)
    setLoading(false)
  }

  React.useEffect(() => {
    // initial is already set; nothing to do
  }, [])

  const handleStatusChange = async (id: string, status: QueueStatusType) => {
    // optimistic UI
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)))
    try {
      await fetch('/api/queue/update-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    } catch {
      // revert on error: refetch page
      fetchPage(page)
    }
  }

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
    // reload first page with new sort
    fetchPage(1)
  }

  const formatTimestamp = (v?: string | null) => {
    if (!v) return { label: '-', iso: '' }
    try {
      const d = new Date(v)
      if (isNaN(d.getTime())) return { label: '-', iso: '' }
      return { label: d.toLocaleString(), iso: d.toISOString() }
    } catch {
      return { label: '-', iso: '' }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField size="small" placeholder="Buscar código" value={q} onChange={(e) => setQ(e.target.value)} />
        <FormControl size="small">
          <InputLabel>Estado</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Estado" sx={{ minWidth: 140 }}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="queued">queued</MenuItem>
            <MenuItem value="processing">processing</MenuItem>
            <MenuItem value="done">done</MenuItem>
            <MenuItem value="failed">failed</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => fetchPage(1)}>Aplicar</Button>
        <Tooltip title="Refrescar">
          <IconButton size="small" onClick={() => fetchPage(page)}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Error</TableCell>
            <TableCell sortDirection={sortBy === 'created_at' ? sortDir : false}>
              <TableSortLabel active={sortBy === 'created_at'} direction={sortBy === 'created_at' ? sortDir : 'asc'} onClick={() => toggleSort('created_at')}>
                Creado
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortBy === 'started_at' ? sortDir : false}>
              <TableSortLabel active={sortBy === 'started_at'} direction={sortBy === 'started_at' ? sortDir : 'asc'} onClick={() => toggleSort('started_at')}>
                Iniciado
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortBy === 'finished_at' ? sortDir : false}>
              <TableSortLabel active={sortBy === 'finished_at'} direction={sortBy === 'finished_at' ? sortDir : 'asc'} onClick={() => toggleSort('finished_at')}>
                Finalizado
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}><CircularProgress size={24} /></TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No hay elementos</TableCell>
            </TableRow>
          ) : (
            items.map((it) => (
              <TableRow key={it.id}>
                <TableCell>{it.code}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select value={it.status} onChange={(e) => handleStatusChange(it.id, e.target.value as QueueStatusType)}>
                      <MenuItem value="queued">queued</MenuItem>
                      <MenuItem value="processing">processing</MenuItem>
                      <MenuItem value="done">done</MenuItem>
                      <MenuItem value="failed">failed</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{it.error || '-'}</TableCell>
                <TableCell>
                  {(() => {
                    const f = formatTimestamp(it.created_at)
                    return f.iso ? <Tooltip title={f.iso}><span>{f.label}</span></Tooltip> : <span>-</span>
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    const f = formatTimestamp(it.started_at)
                    return f.iso ? <Tooltip title={f.iso}><span>{f.label}</span></Tooltip> : <span>-</span>
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    const f = formatTimestamp(it.finished_at)
                    return f.iso ? <Tooltip title={f.iso}><span>{f.label}</span></Tooltip> : <span>-</span>
                  })()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Pagination count={Math.max(1, Math.ceil(count / limit))} page={page} onChange={(_, p) => fetchPage(p)} />
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Box>
  )
}
