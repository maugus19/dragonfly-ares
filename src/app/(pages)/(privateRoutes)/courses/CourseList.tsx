"use client"

import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import { useRouter } from 'next/navigation'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { Course, Module } from '@/types/student'

export default function CourseList({ courses }: { courses: Course[] }) {
  const router = useRouter()

  if (!courses || courses.length === 0) {
    return <Typography>No hay cursos disponibles.</Typography>
  }

  return (
    <Box>
      {courses.map((course) => (
        <Accordion key={course.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">{course.name}</Typography>
                {course.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {course.description}
                  </Typography>
                )}
              </Box>

              <IconButton
                aria-label={`Ir al perfil del curso ${course.name}`}
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  router.push(`/courses/${course.id}`)
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Módulos</Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense>
              {(course.modules || []).map((mod: Module) => (
                <ListItem key={mod.id} disablePadding>
                  <ListItemText primary={mod.name} secondary={`${mod.classes?.length || 0} clases`} sx={{ pl: 2 }} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}
