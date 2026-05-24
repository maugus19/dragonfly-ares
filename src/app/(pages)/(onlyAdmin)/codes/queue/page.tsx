import { createClient } from '@/utils/supabase/server'
import { Container, Typography } from '@mui/material'
import QueueTable from './QueueTable'
import { QueueType } from '@/types/queue.types'

export default async function QueuePage() {
	const supabase = await createClient()

	const { data, error, count } = await supabase.from('scrape_queue').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(0, 11)

	if (error) {
		return (
			<Container>
				<Typography color="error">No se pudo cargar la cola</Typography>
			</Container>
		)
	}

	const initialData = (data || []) as QueueType[]
	const initialCount = (count || initialData.length) as number

	return (
		<Container sx={{ py: 4 }}>
			<Typography variant="h4" sx={{ mb: 2 }}>Cola de Scraper</Typography>
			<QueueTable initialData={initialData} initialCount={initialCount} />
		</Container>
	)
}
