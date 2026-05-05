"use client"

import React from 'react'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/navigation'

export default function ModuleEditButton({ courseId, moduleId }: { courseId: string; moduleId: string }) {
  const router = useRouter()

  return (
    <Tooltip title="Ir al perfil del módulo">
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          router.push(`/courses/${courseId}/${moduleId}`)
        }}
        aria-label="Editar módulo"
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}
