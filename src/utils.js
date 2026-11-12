// Common helpers used across the app

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

/** Format a Date object as 'YYYY-MM-DD' using local time */
export function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const todayStr = () => dateStr(new Date())

/** seconds -> 'MM:SS' */
export function fmtClock(sec) {
  const s = Math.max(0, sec)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
