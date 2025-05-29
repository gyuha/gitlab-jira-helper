import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface JiraState {
  prefix: string
  number: string
  history: string[]
  setPrefix: (prefix: string) => void
  setNumber: (number: string) => void
  getJiraTicket: () => string
  addToHistory: (ticket: string) => void
  clearHistory: () => void
  reset: () => void
}

export const useJiraStore = create<JiraState>()(
  persist(    (set, get) => ({
      prefix: 'PWA-',
      number: '1234',
      history: [],
      setPrefix: (prefix: string) => set({ prefix }),
      setNumber: (number: string) => set({ number }),
      getJiraTicket: () => {
        const state = get()
        return `${state.prefix}${state.number}`
      },
      addToHistory: (ticket: string) => {
        const state = get()
        const newHistory = [ticket, ...state.history.filter(h => h !== ticket)].slice(0, 10)
        set({ history: newHistory })
      },
      clearHistory: () => set({ history: [] }),
      reset: () => set({ prefix: 'PWA-', number: '' }),
    }),
    {
      name: 'jira-helper-storage',
    }
  )
)
