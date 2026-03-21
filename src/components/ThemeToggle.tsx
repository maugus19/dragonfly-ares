"use client"

import { useContext, useState, MouseEvent } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { ThemePreferenceContext } from './ThemeRegistry'

export default function ThemeToggle() {
  const { preference, setPreference } = useContext(ThemePreferenceContext)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Lightweight menu handling without adding heavy state libs
  // We'll use a simple boolean and the event target
  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)

  return (
    <div>
      <Tooltip title={`Theme: ${preference}`}>
        <IconButton onClick={handleOpen} color="inherit" aria-label="theme-toggle">
          {preference === 'dark' ? <Brightness4Icon /> : preference === 'light' ? <Brightness7Icon /> : <SettingsBrightnessIcon />}
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          selected={preference === 'system'}
          onClick={() => {
            setPreference('system')
            handleClose()
          }}
        >
          System
        </MenuItem>
        <MenuItem
          selected={preference === 'light'}
          onClick={() => {
            setPreference('light')
            handleClose()
          }}
        >
          Light
        </MenuItem>
        <MenuItem
          selected={preference === 'dark'}
          onClick={() => {
            setPreference('dark')
            handleClose()
          }}
        >
          Dark
        </MenuItem>
      </Menu>
    </div>
  )
}
