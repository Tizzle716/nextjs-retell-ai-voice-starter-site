export interface Email {
  id: string
  from: string
  subject: string
  date: string
  preview: string
  body?: string // Optionnel, au cas où vous en auriez besoin ailleurs
}
