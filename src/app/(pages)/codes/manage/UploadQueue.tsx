"use client"

import { useState } from 'react'
import { Box, TextField, Button, Stack, Alert } from '@mui/material'

export default function UploadQueue() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleUpload = async () => {
    const codes = value.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    if (codes.length === 0) {
      setMessage('No codes to upload')
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/codes/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codes }),
        credentials: 'same-origin'
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Upload failed')
      setMessage(`Inserted ${json.inserted || 0} items into queue`)
      setValue('')
    } catch (err) {
      setMessage(String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleProcessNow = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/process-queue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit: 10, delayMs: 3000 }), credentials: 'same-origin' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Processing failed')
      setMessage(`Processed ${json.processed || 0} items`) 
    } catch (err) {
      setMessage(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ mb: 3 }}>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleProcessNow} disabled={loading}>Process Queue Now</Button>
      </Stack>

      <TextField
        label="Paste codes (one per line)"
        multiline
        minRows={4}
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleUpload} disabled={loading}>Upload to Queue</Button>
        <Button variant="outlined" onClick={() => setValue('')} disabled={loading}>Clear</Button>
      </Stack>
    </Box>
  )
}
