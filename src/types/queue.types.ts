export type QueueStatusType = 'failed' | 'queued' | 'processing' | 'done';

export type QueueServerType = {
  url: string
  server: string
}
export type QueueResultType = {
  url: QueueResultType[]
  title: string
  image_url: string
}

export type QueueType = {
  id: string
  code: string
  result: QueueResultType | null
  status: QueueStatusType
  error: string | null
  created_at: string
  started_at: string
  finished_at: string
  user_id: string
}