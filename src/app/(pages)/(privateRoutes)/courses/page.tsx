import { createClient } from '@/utils/supabase/server'
import CourseList from './CourseList'
import { Container, Typography } from '@mui/material'
import { Course } from '@/types/student'

export default async function CoursesPage() {
  const supabase = await createClient()

  // Try to fetch courses and their modules. If your DB relation is different,
  // adjust the select accordingly.
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, name, description, created_at, modules(*)')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">Error al cargar cursos: {String(error.message || error)}</Typography>
      </Container>
    )
  }

  // supabase returns unknown typed data; cast to Course[] for the UI
  const typed: Course[] = (courses as unknown) as Course[]

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
        Cursos
      </Typography>

      <CourseList courses={typed} />
    </Container>
  )
}
