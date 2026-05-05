import { createClient } from '@/utils/supabase/server'
import { Container, Typography } from '@mui/material'
import ModuleTabs from '../ModuleTabs'
import { Student } from '@/types/student'

type Props = {
  params: { courseId: string; moduleId: string } | Promise<{ courseId: string; moduleId: string }>
}

export default async function ModulePage({ params }: Props) {
  const { moduleId } = (await params) as { moduleId: string }
  const supabase = await createClient()

  // Fetch module
  const { data: moduleData, error: moduleErr } = await supabase
    .from('modules')
    .select('id, name')
    .eq('id', moduleId)
    .maybeSingle()

  if (moduleErr || !moduleData) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">No se pudo cargar el módulo.</Typography>
      </Container>
    )
  }

  const moduleObj = moduleData as { id: string; name?: string; description?: string }
  const moduleName: string = moduleObj?.name || 'Módulo'
  // Fetch classes for module
  const { data: classesData, error: classesErr } = await supabase
    .from('classes')
    .select('id, date, order')
    .eq('module_id', moduleId)
    .order('order', { ascending: false })

  console.log('classesData data', classesData)
  const classes = (classesData || []) as { id: string; order?: number; date?: string }[]

  if (classesErr) {
    // we still continue, classes can be empty
    // console.warn('Error loading classes', classesErr)
  }
  const classIds = classes.map((c) => c.id)

  // Fetch enrollments for this module
  let enrollments: { id: string; studentId: string }[] = []
  const { data: enrollData, error: enrollErr } = await supabase
    .from('module_enrollments')
    .select('id, student_id')
    .eq('module_id', moduleId)

  if (!enrollErr && enrollData) {
    enrollments = (enrollData as { id: string; student_id: string }[]).map((e) => ({ id: e.id, studentId: e.student_id }))
  }

  const studentIds = Array.from(new Set(enrollments.map((e) => e.studentId)))

  // Fetch students
  let students: Student[] = []
  if (studentIds.length) {
    const { data: studentsData } = await supabase.from('students').select('id, name, email, created_at').in('id', studentIds)
    students = (studentsData || []) as Student[]
  }

  // Fetch class records (attendance / participation)
  type ClassRecordRow = {
    id: string
    class_id: string
    student_id: string
    attendance: boolean
    participation?: number
    details?: string
  }

  let classRecords: ClassRecordRow[] = []
  console.log('Class IDs to fetch records for', classIds)
  if (classIds.length) {
    const { data: recordsData } = await supabase
      .from('class_records')
      .select('id, class_id, student_id, attendance, participation, details')
      .in('class_id', classIds)

    classRecords = (recordsData || []) as ClassRecordRow[]
  }

  // Map students by id
  const studentsById = new Map(students.map((s) => [s.id, s]))

  // Build classes with records + student info
  const classesWithRecords = classes.map((c) => {
    const recordsForClass = classRecords
      .filter((r) => r.class_id === c.id)
      .map((r) => ({
        id: r.id,
        attendance: !!r.attendance,
        participation: r.participation,
        details: r.details,
        student: studentsById.get(r.student_id) || ({ id: r.student_id, name: 'Desconocido', email: '', created_at: '', country: '' } as Student),
      }))

    return {
      id: c.id,
      order: c.order,
      date: c.date,
      records: recordsForClass,
    }
  })

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <ModuleTabs moduleName={moduleName} students={students} classes={classesWithRecords} />
    </Container>
  )
}
