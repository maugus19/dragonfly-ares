import { createClient } from '@/utils/supabase/server'
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Divider, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Student, Module, Course } from '@/types/student'
import ModuleEditButton from '@/components/ModuleEditButton'

type Props = {
  params: { courseId: string } | Promise<{ courseId: string }>
}

export default async function CourseProfilePage({ params }: Props) {
  const { courseId } = (await params) as { courseId: string }
  const supabase = await createClient()

  // 1. Fetch course
  const { data: courseData, error: courseErr } = await supabase
    .from('courses')
    .select('id, name, description, created_at')
    .eq('id', courseId)
    .maybeSingle()

  if (courseErr || !courseData) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">No se pudo cargar el curso.</Typography>
      </Container>
    )
  }

  const course: Course = courseData as Course

  // 2. Fetch modules for the course
  const { data: modulesData, error: modulesErr } = await supabase
    .from('modules')
    .select('id, name')
    .eq('course_id', courseId)
    .order('id', { ascending: false })

  if (modulesErr) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">Error al cargar módulos.</Typography>
      </Container>
    )
  }

  const modules: Module[] = (modulesData || []) as Module[]

  const moduleIds = modules.map((m) => m.id)

  // 3. Fetch enrollments for these modules
  let enrollments: { id: string; moduleId: string; studentId: string }[] = []
  if (moduleIds.length) {
    const { data: enrollData, error: enrollErr } = await supabase
      .from('module_enrollments')
      .select('id, module_id, student_id')
      .in('module_id', moduleIds)

    if (!enrollErr && enrollData) {
      enrollments = (enrollData as { id: string; module_id: string; student_id: string }[]).map((e) => ({ id: e.id, moduleId: e.module_id, studentId: e.student_id }))
    }
  }

  const studentIds = Array.from(new Set(enrollments.map((e) => e.studentId)))

  // 4. Fetch students
  let students: Student[] = []
  if (studentIds.length) {
    const { data: studentsData } = await supabase.from('students').select('id, name, email, created_at').in('id', studentIds)
    students = (studentsData || []) as Student[]
  }

  // Map students by id for quick lookup
  const studentsById = new Map(students.map((s) => [s.id, s]))

  // Group enrollments by module
  const enrollByModule = new Map<string, { id: string; student: Student }[]>()
  for (const e of enrollments) {
  const s = studentsById.get(e.studentId) || ({ id: e.studentId, name: 'Desconocido', email: '', created_at: '' } as Student)
    const arr = enrollByModule.get(e.moduleId) || []
    arr.push({ id: e.id, student: s })
    enrollByModule.set(e.moduleId, arr)
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
        {course.name}
      </Typography>
      {course.description && <Typography sx={{ mb: 2 }}>{course.description}</Typography>}

      <Box>
        {modules.map((mod) => (
          <Accordion key={mod.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="h6">{mod.name}</Typography>
                  <ModuleEditButton courseId={course.id} moduleId={mod.id} />
                </Box>
              </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Estudiantes</Typography>
              <Divider sx={{ mb: 1 }} />
              <List dense>
                {(enrollByModule.get(mod.id) || []).map((en) => (
                  <ListItem key={en.id}>
                    <ListItemText primary={en.student.name} secondary={en.student.email} />
                  </ListItem>
                ))}
                {(enrollByModule.get(mod.id) || []).length === 0 && (
                  <ListItem>
                    <ListItemText primary="No hay estudiantes inscritos." />
                  </ListItem>
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  )
}
