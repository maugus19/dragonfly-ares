"use client"

import React from 'react'
import { Student } from '@/types/student'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

type ClassRecordItem = {
  id: string
  attendance: boolean
  participation?: number
  details?: string
  student: Student
}

type ClassItem = {
  id: string
  name?: string
  date?: string
  records: ClassRecordItem[]
}

export default function ModuleTabs({
  moduleName,
  students,
  classes,
}: {
  moduleName: string
  students: Student[]
  classes: ClassItem[]
}) {
  const [value, setValue] = React.useState(0)

  // local editable copy of classes + records
  const [classesState, setClassesState] = React.useState<ClassItem[]>(() =>
    classes.map((c) => ({ ...c, records: c.records.map((r) => ({ ...r })) }))
  )

  const [savingMap, setSavingMap] = React.useState<Record<string, boolean>>({})
  const saveTimers = React.useRef<Record<string, number>>({})

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const scheduleSave = (recordId: string, payload: { participation?: number | null; details?: string | null; attendance?: boolean }) => {
    // clear existing timer
    const t = saveTimers.current[recordId]
    if (t) window.clearTimeout(t)

    saveTimers.current[recordId] = window.setTimeout(async () => {
      setSavingMap((s) => ({ ...s, [recordId]: true }))
      try {
        await fetch('/api/class-records/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: recordId, ...payload }),
        })
      } catch (error) {
        void error
      } finally {
        setSavingMap((s) => ({ ...s, [recordId]: false }))
      }
    }, 800) as unknown as number
  }

  const updateRecordLocally = (recordId: string, updater: (r: ClassRecordItem) => ClassRecordItem) => {
    setClassesState((prev) =>
      prev.map((c) => ({
        ...c,
        records: c.records.map((r) => (r.id === recordId ? updater(r) : r)),
      }))
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{moduleName}</Typography>
      <Tabs value={value} onChange={handleChange} aria-label="Module tabs" sx={{ mb: 2 }}>
        <Tab label={`Estudiantes (${students.length})`} />
        {classesState.map((c, i) => (
          <Tab key={c.id} label={c.name ? `${c.name}` : `Clase ${i + 1}`} />
        ))}
      </Tabs>

      <TabPanel value={value} index={0}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Lista de estudiantes del módulo</Typography>
        <Divider sx={{ mb: 1 }} />
        <List dense>
          {students.length === 0 && (
            <ListItem>
              <ListItemText primary="No hay estudiantes inscritos en este módulo." />
            </ListItem>
          )}
          {students.map((s) => (
            <ListItem key={s.id} divider>
              <ListItemText primary={s.name} secondary={s.email} />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      {classesState.map((c, idx) => (
        <TabPanel key={c.id} value={value} index={idx + 1}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1">{c.name || `Clase ${idx + 1}`}</Typography>
            {c.date && <Chip label={new Date(c.date).toLocaleString()} size="small" />}
          </Box>
          <Divider sx={{ mb: 1 }} />
          <List dense>
            {c.records.length === 0 && (
              <ListItem>
                <ListItemText primary="No hay registros para esta clase." />
              </ListItem>
            )}
            {c.records.map((r) => (
              <React.Fragment key={r.id}>
                <ListItem divider alignItems="flex-start">
                  <ListItemText primary={r.student.name} secondary={r.student.email} />

                  <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 120 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={!!r.attendance}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked
                            updateRecordLocally(r.id, (rec) => ({ ...rec, attendance: checked }))
                            scheduleSave(r.id, { attendance: checked })
                          }}
                        />
                      }
                      label={r.attendance ? 'Presente' : 'Ausente'}
                    />

                    <FormControl size="small" sx={{ mt: 1, minWidth: 80 }}>
                      <Select
                        value={typeof r.participation === 'number' ? String(r.participation) : ''}
                        displayEmpty
                        onChange={(e: SelectChangeEvent) => {
                            const raw = e.target.value as string
                            const val = raw === '' ? null : Number(raw)
                            updateRecordLocally(r.id, (rec) => ({ ...rec, participation: typeof val === 'number' ? val : undefined }))
                            scheduleSave(r.id, { participation: typeof val === 'number' ? val : null })
                          }}
                      >
                        <MenuItem value=""><em>-</em></MenuItem>
                        {[0, 1, 2, 3, 4, 5].map((n) => (
                          <MenuItem key={n} value={String(n)}>{n}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {savingMap[r.id] && <CircularProgress size={14} sx={{ mt: 1 }} />}
                  </Box>
                </ListItem>

                <Box sx={{ px: 2, pb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    placeholder="Detalles (editable)"
                    value={r.details ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      updateRecordLocally(r.id, (rec) => ({ ...rec, details: val }))
                      scheduleSave(r.id, { details: val })
                    }}
                  />
                </Box>
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      ))}
    </Box>
  )
}

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  )
}
