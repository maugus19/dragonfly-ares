"use client"

import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

export function NavButtons() {
  const router = useRouter()

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={() => router.push('/codes')}>Go to Codes</Button>
      <Button variant="outlined" onClick={() => router.push('/codes/manage')}>Manage Codes</Button>
      <Button variant="text" onClick={() => router.push('/login')}>Login</Button>
    </Stack>
  )
}
