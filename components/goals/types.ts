export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  target_date: string | null
  category: string
  status: 'todo' | 'in_progress' | 'done'
  created_at: string
}