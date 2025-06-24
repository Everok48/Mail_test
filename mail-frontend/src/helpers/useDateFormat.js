import { date } from 'quasar'

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return date.formatDate(dateStr, 'DD.MM.YYYY HH:mm')
}
