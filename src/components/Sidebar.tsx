"use client"

import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import HomeIcon from '@mui/icons-material/Home'
import CodeIcon from '@mui/icons-material/Code'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRouter, usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SchoolIcon from '@mui/icons-material/School';
import { createClient } from '@/utils/supabase/client';

const DRAWER_WIDTH = 240
const COLLAPSED_WIDTH = 72

type RouteType = {
  label: string
  icon?: React.ReactElement
  route?: string
  hidden?: boolean
  subRoutes?: RouteType[]
}

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const toggleCollapsed = () => setCollapsed((s) => !s)

  const router = useRouter()
  const pathname = usePathname() || '/'

  const isActive = (route: string) => {
    if (!pathname) return false
    if (route === '/') return pathname === '/'
    return pathname === route || pathname.startsWith(route + '/')
  }
  const routes: RouteType[] = [
    { label: 'Home', icon: <HomeIcon />, route: '/' },
    {
      label: 'Codes',
      icon: <CodeIcon />,
      subRoutes: [
        { label: 'Agregar', route: '/codes' },
        { label: 'Manage', route: '/codes/manage' },
        { label: 'Queue', route: '/codes/queue' }
      ]
    },
    {
      label: 'Users',
      icon: <ManageAccountsIcon />,
      subRoutes: [
        { label: 'List', route: '/users' },
        { label: 'Create', route: '/users/create' }
      ]
    },
    {
      label: 'Students',
      icon: <PeopleIcon />,
      subRoutes: [
        { label: 'List', route: '/students' },
        { label: 'Upload', route: '/students/upload' }
      ]
    },
    {
      label: 'Courses',
      icon: <SchoolIcon />,
      subRoutes: [
        { label: 'List', route: '/courses' },
        { label: 'Create', route: '/courses/create' }
      ]
    }
  ]

  const getRouteItem = (route: RouteType) => {
    if (route.subRoutes) {
      return getAccordionSummary(route)
    }
    if (route.route) {
      return getMainItemNavigation(route.route, route.icon || <></>, route.label)
    }
    return null
  }

  const getMainItemNavigation = (route: string, icon: React.ReactElement, label: string) => {
    return (
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton onClick={() => router.push(route)} selected={isActive(route)} sx={{ minHeight: 48, justifyContent: collapsed ? 'center' : 'initial', px: 2.5 }}>
          <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: 'center' }}>
            {collapsed ? (
              <Tooltip title={label} placement="right">
                {icon}
              </Tooltip>
            ) : (
              <>{icon}</>
            )}
          </ListItemIcon>
          <ListItemText primary={label} sx={{ display: collapsed ? 'none' : 'block', opacity: collapsed ? 0 : 1, transition: 'opacity 200ms', whiteSpace: 'nowrap' }} />
        </ListItemButton>
      </ListItem>
    )
  }

  const getAccordionSummary = ({ icon, label, subRoutes }: RouteType) => {
    return (
      <Accordion disableGutters elevation={0} square sx={{ background: 'transparent', '&:before': { display: 'none' } }}>
        <AccordionSummary
          expandIcon={!collapsed ? <ExpandMoreIcon /> : undefined}
          sx={{
            px: collapsed ? 1 : 0,
            minHeight: 48,
            display: 'flex',
            alignItems: 'center',
            '& .MuiAccordionSummary-content': { margin: 0, alignItems: 'center' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 3, justifyContent: 'center' }}>
              {collapsed ? (
                <Tooltip title={label} placement="right">
                  {icon ? icon : <></>}
                </Tooltip>
              ) : (
                <>
                {icon ? icon : <></>}
                </>
              )}
            </ListItemIcon>
            <ListItemText
              primary={label}
              sx={{
                display: collapsed ? 'none' : 'block',
                opacity: collapsed ? 0 : 1,
                transition: 'opacity 200ms',
                whiteSpace: 'nowrap'
              }}
            />
          </Box>
        </AccordionSummary>
        {subRoutes && getAccordionDetailsNavigation(subRoutes)}
      </Accordion>
    )
  }

  const getAccordionDetailsNavigation = (routes: RouteType[]) => {
    return (
      <AccordionDetails sx={{ p: 0 }}>
        <List disablePadding>
          {
            routes.map((subRoute) => (
              <ListItem disablePadding key={subRoute.route}>
                <ListItemButton onClick={() => router.push(subRoute.route!)} selected={isActive(subRoute.route!)} sx={{ pl: collapsed ? 2 : 6 }}>
                  <ListItemText primary={subRoute.label} />
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>
      </AccordionDetails>
    )
  }


  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', px: 2 }}>
        {!collapsed && <Typography variant="h6">Admin</Typography>}
        <IconButton onClick={toggleCollapsed} size="small" aria-label="collapse sidebar">
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />

      <List>
        {routes.map((route) => (
          <React.Fragment key={route.label}>
            {getRouteItem(route)}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        {!collapsed && <Typography variant="caption" color="text.secondary">Dragonfly Ares</Typography>}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          left: 0,
          right: 0,
          width: '100%'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }} aria-label="open drawer">
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">Dragonfly Ares</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      {/* Desktop permanent drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            flexShrink: 0,
            transition: 'width 240ms cubic-bezier(0.4, 0, 0.2, 1)',
            '& .MuiDrawer-paper': {
              width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
              boxSizing: 'border-box',
              transition: 'width 240ms cubic-bezier(0.4, 0, 0.2, 1)'
            }
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile temporary drawer */}
      {isMobile && (
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH } }}>
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, ml: 0, transition: 'margin-left 240ms cubic-bezier(0.4, 0, 0.2, 1)', width: { sm: `calc(100% - ${collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
