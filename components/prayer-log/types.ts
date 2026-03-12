export interface Prayer {
  id: string
  user_id: string
  title: string
  body: string | null
  date: string
  answered: boolean
  created_at: string
}