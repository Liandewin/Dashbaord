export interface JournalEntry {
  id: string
  user_id: string
  title: string
  body: string | null
  date: string
  created_at: string
}