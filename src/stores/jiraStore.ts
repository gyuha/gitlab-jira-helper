import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface JiraState {
  prefix: string
  gitBranchPrefix: string
  number: string
  message: string
  history: string[]
  setPrefix: (prefix: string) => void
  setGitBranchPrefix: (gitBranchPrefix: string) => void
  setNumber: (number: string) => void
  setMessage: (message: string) => void
  getJiraTicket: () => string
  getGitBranch: () => string
  getFeatCommit: () => string
  getFixCommit: () => string
  getSwitchNewCommand: () => string
  getSwitchCommand: () => string
  addToHistory: (ticket: string) => void
  clearHistory: () => void
  reset: () => void
}

export const useJiraStore = create<JiraState>()(
  persist(
    (set, get) => ({
      prefix: 'PRD-',
      gitBranchPrefix: `feature/`,
      number: '1',
      message: '',
      history: [],
      setPrefix: (prefix: string) => set({ prefix }),
      setGitBranchPrefix: (gitBranchPrefix: string) => set({ gitBranchPrefix }),
      setNumber: (number: string) => set({ number }),
      setMessage: (message: string) => set({ message }), getJiraTicket: () => {
        const state = get()
        return `${state.prefix}${state.number}`
      },
      getGitBranch: () => {
        const state = get()
        return `${state.gitBranchPrefix}${state.prefix}${state.number}`
      }, getFeatCommit: () => {
        const state = get()
        const message = state.message || '작업 내용'
        return `git commit -m "feat(${state.prefix}${state.number}): ${message}"`
      },
      getFixCommit: () => {
        const state = get()
        const message = state.message || '작업 내용'
        return `git commit -m "fix(${state.prefix}${state.number}): ${message}"`
      },
      getSwitchNewCommand: () => {
        const state = get()
        return `git switch -c ${state.gitBranchPrefix}${state.prefix}${state.number}`
      },
      getSwitchCommand: () => {
        const state = get()
        return `git switch ${state.gitBranchPrefix}${state.prefix}${state.number}`
      },
      addToHistory: (ticket: string) => {
        const state = get()
        const newHistory = [ticket, ...state.history.filter(h => h !== ticket)].slice(0, 10)
        set({ history: newHistory })
      },
      clearHistory: () => set({ history: [] }), reset: () => set({
        prefix: 'PRD-',
        gitBranchPrefix: `feature/`,
        number: '',
        message: ''
      }),
    }),
    {
      name: 'jira-helper-storage',
    }
  )
)
