import NextLink from 'next/link'
import { NavButtons } from './NavButtons'
import Stack from '@mui/material/Stack'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'

export default function HomePage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 32 }}>
      <Typography variant="h4" component="h1">Welcome</Typography>

      <nav aria-label="primary navigation">
        <Stack direction="row" spacing={2}>
          <NextLink href="/codes" passHref legacyBehavior>
            <MuiLink underline="hover">Codes</MuiLink>
          </NextLink>
          <NextLink href="/codes/manage" passHref legacyBehavior>
            <MuiLink underline="hover">Manage Codes</MuiLink>
          </NextLink>
        </Stack>
      </nav>

      <div style={{ width: '100%', height: 1, background: '#e5e7eb', margin: '16px 0' }} />

      <NavButtons />
    </main>
  )
}