import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tab, GlobalSettings } from "../types/tabs";
import { createTabError, TabErrorCode } from "../types/tabs";
import { v4 as uuidv4 } from 'uuid';

interface JiraState {
  // Legacy single-tab properties (maintained for backward compatibility)
  prefix: string;
  gitBranchPrefix: string;
  number: string;
  message: string;
  history: string[];
  jiraDomain: string;

  // New tab management properties
  tabs: Tab[];
  activeTabId: string | null;
  maxTabs: number;
  nextTabNumber: number;
  isMultiTabMode: boolean;

  // Legacy setters (updated to work with active tab)
  setPrefix: (prefix: string) => void;
  setGitBranchPrefix: (gitBranchPrefix: string) => void;
  setNumber: (number: string) => void;
  setMessage: (message: string) => void;
  setJiraDomain: (jiraDomain: string) => void;

  // Legacy getters (work with active tab)
  getJiraTicket: () => string;
  getGitBranch: () => string;
  getCommit: (type: string) => string;
  getCommitMessage: (type: string) => string;
  getSwitchNewCommand: () => string;
  getSwitchCommand: () => string;

  // Legacy operations
  addToHistory: (ticket: string) => void;
  clearHistory: () => void;
  reset: () => void;

  // New tab management operations
  createTab: (number?: string, message?: string) => string;
  closeTab: (tabId: string) => boolean;
  switchToTab: (tabId: string) => boolean;
  updateTabData: (tabId: string, updates: { number?: string; message?: string }) => boolean;
  
  // Tab queries
  getActiveTab: () => Tab | null;
  getTabById: (tabId: string) => Tab | null;
  getAllTabs: () => Tab[];
  canAddTab: () => boolean;
  getTabCount: () => number;

  // Global settings management
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  getGlobalSettings: () => GlobalSettings;

  // Multi-tab mode toggle
  enableMultiTabMode: () => void;
  disableMultiTabMode: () => void;

  // Migration helper
  migrateToMultiTab: () => void;
  syncLegacyState: () => void;
}

export const useJiraStore = create<JiraState>()(
  persist(
    (set, get) => ({
      // Legacy state
      prefix: "PRD-",
      gitBranchPrefix: "feature/",
      number: "1",
      message: "",
      history: [],
      jiraDomain: "",

      // New tab state
      tabs: [],
      activeTabId: null,
      maxTabs: 10,
      nextTabNumber: 1,
      isMultiTabMode: false,

      // Legacy setters (update global settings and sync to active tab)
      setPrefix: (prefix: string) => {
        set((state) => {
          const newState = { ...state, prefix };
          if (state.isMultiTabMode) {
            get().syncLegacyState();
          }
          return newState;
        });
      },

      setGitBranchPrefix: (gitBranchPrefix: string) => {
        set((state) => {
          const newState = { ...state, gitBranchPrefix };
          if (state.isMultiTabMode) {
            get().syncLegacyState();
          }
          return newState;
        });
      },

      setNumber: (number: string) => {
        const numbersOnly = number.replace(/\D/g, "");
        set((state) => {
          if (state.isMultiTabMode && state.activeTabId) {
            const updatedTabs = state.tabs.map(tab =>
              tab.id === state.activeTabId 
                ? { ...tab, number: numbersOnly, lastModified: new Date() }
                : tab
            );
            return { ...state, number: numbersOnly, tabs: updatedTabs };
          }
          return { ...state, number: numbersOnly };
        });
      },

      setMessage: (message: string) => {
        set((state) => {
          if (state.isMultiTabMode && state.activeTabId) {
            const updatedTabs = state.tabs.map(tab =>
              tab.id === state.activeTabId 
                ? { ...tab, message, lastModified: new Date() }
                : tab
            );
            return { ...state, message, tabs: updatedTabs };
          }
          return { ...state, message };
        });
      },

      setJiraDomain: (jiraDomain: string) => {
        set((state) => {
          const newState = { ...state, jiraDomain };
          if (state.isMultiTabMode) {
            get().syncLegacyState();
          }
          return newState;
        });
      },

      // Legacy getters
      getJiraTicket: () => {
        const state = get();
        return `${state.prefix}${state.number}`;
      },

      getGitBranch: () => {
        const state = get();
        return `${state.gitBranchPrefix}${state.prefix}${state.number}`;
      },

      getCommit: (type: string) => {
        const state = get();
        const message = state.message || "작업 내용";
        return `git commit -m "${type}(${state.prefix}${state.number}): ${message}"`;
      },

      getCommitMessage: (type: string) => {
        const state = get();
        const message = state.message || "작업 내용";
        return `${type}(${state.prefix}${state.number}): ${message}`;
      },

      getSwitchNewCommand: () => {
        const state = get();
        return `git switch -c ${state.gitBranchPrefix}${state.prefix}${state.number}`;
      },

      getSwitchCommand: () => {
        const state = get();
        return `git switch ${state.gitBranchPrefix}${state.prefix}${state.number}`;
      },

      // Legacy operations
      addToHistory: (ticket: string) => {
        const state = get();
        const newHistory = [
          ticket,
          ...state.history.filter((h) => h !== ticket),
        ].slice(0, 10);
        set({ history: newHistory });
      },

      clearHistory: () => set({ history: [] }),

      reset: () =>
        set({
          prefix: "PRD-",
          gitBranchPrefix: "feature/",
          number: "",
          message: "",
          jiraDomain: "",
        }),

      // New tab management operations
      createTab: (number?: string, message?: string) => {
        const state = get();
        
        if (state.tabs.length >= state.maxTabs) {
          throw createTabError(
            `Maximum ${state.maxTabs} tabs allowed`,
            TabErrorCode.MAX_TABS_REACHED
          );
        }

        const newTabId = uuidv4();
        const now = new Date();
        const tabNumber = number || state.nextTabNumber.toString();
        
        const newTab: Tab = {
          id: newTabId,
          number: tabNumber,
          message: message || "",
          isActive: true,
          createdAt: now,
          lastModified: now,
        };

        set((prevState) => ({
          tabs: [
            ...prevState.tabs.map(tab => ({ ...tab, isActive: false })),
            newTab
          ],
          activeTabId: newTabId,
          nextTabNumber: prevState.nextTabNumber + 1,
          number: tabNumber,
          message: message || "",
        }));

        return newTabId;
      },

      closeTab: (tabId: string) => {
        const state = get();
        const tabIndex = state.tabs.findIndex(tab => tab.id === tabId);
        
        if (tabIndex === -1) {
          throw createTabError(
            `Tab with ID ${tabId} not found`,
            TabErrorCode.TAB_NOT_FOUND,
            tabId
          );
        }

        if (state.tabs.length === 1) {
          // Create a new empty tab before closing the last one
          get().createTab();
          set((prevState) => ({
            tabs: prevState.tabs.filter(tab => tab.id !== tabId),
          }));
          return true;
        }

        // Find the next tab to activate
        let newActiveTabId = state.activeTabId;
        if (state.activeTabId === tabId) {
          const nextIndex = tabIndex + 1 < state.tabs.length ? tabIndex + 1 : tabIndex - 1;
          newActiveTabId = state.tabs[nextIndex].id;
        }

        set((prevState) => ({
          tabs: prevState.tabs
            .filter(tab => tab.id !== tabId)
            .map(tab => ({ ...tab, isActive: tab.id === newActiveTabId })),
          activeTabId: newActiveTabId,
        }));

        // Sync legacy state with new active tab
        get().syncLegacyState();
        
        return true;
      },

      switchToTab: (tabId: string) => {
        const state = get();
        const tab = state.tabs.find(t => t.id === tabId);
        
        if (!tab) {
          throw createTabError(
            `Tab with ID ${tabId} not found`,
            TabErrorCode.TAB_NOT_FOUND,
            tabId
          );
        }

        set((prevState) => ({
          tabs: prevState.tabs.map(t => ({ ...t, isActive: t.id === tabId })),
          activeTabId: tabId,
          number: tab.number,
          message: tab.message,
        }));

        return true;
      },

      updateTabData: (tabId: string, updates: { number?: string; message?: string }) => {
        const state = get();
        const tabIndex = state.tabs.findIndex(tab => tab.id === tabId);
        
        if (tabIndex === -1) {
          throw createTabError(
            `Tab with ID ${tabId} not found`,
            TabErrorCode.TAB_NOT_FOUND,
            tabId
          );
        }

        const now = new Date();
        set((prevState) => {
          const updatedTabs = [...prevState.tabs];
          updatedTabs[tabIndex] = {
            ...updatedTabs[tabIndex],
            ...updates,
            lastModified: now,
          };

          // If this is the active tab, update legacy state too
          const newState: any = { tabs: updatedTabs };
          if (prevState.activeTabId === tabId) {
            if (updates.number !== undefined) newState.number = updates.number;
            if (updates.message !== undefined) newState.message = updates.message;
          }

          return newState;
        });

        return true;
      },

      // Tab queries
      getActiveTab: () => {
        const state = get();
        return state.tabs.find(tab => tab.id === state.activeTabId) || null;
      },

      getTabById: (tabId: string) => {
        const state = get();
        return state.tabs.find(tab => tab.id === tabId) || null;
      },

      getAllTabs: () => {
        const state = get();
        return [...state.tabs];
      },

      canAddTab: () => {
        const state = get();
        return state.tabs.length < state.maxTabs;
      },

      getTabCount: () => {
        const state = get();
        return state.tabs.length;
      },

      // Global settings management
      updateGlobalSettings: (settings: Partial<GlobalSettings>) => {
        set((state) => ({
          ...state,
          ...(settings.prefix && { prefix: settings.prefix }),
          ...(settings.jiraDomain && { jiraDomain: settings.jiraDomain }),
          ...(settings.gitBranchPrefix && { gitBranchPrefix: settings.gitBranchPrefix }),
        }));
      },

      getGlobalSettings: () => {
        const state = get();
        return {
          prefix: state.prefix,
          jiraDomain: state.jiraDomain,
          gitBranchPrefix: state.gitBranchPrefix,
        };
      },

      // Multi-tab mode toggle
      enableMultiTabMode: () => {
        set((state) => {
          if (state.isMultiTabMode) return state;

          // Migrate current state to first tab
          const now = new Date();
          const firstTab: Tab = {
            id: uuidv4(),
            number: state.number || "1",
            message: state.message || "",
            isActive: true,
            createdAt: now,
            lastModified: now,
          };

          return {
            ...state,
            isMultiTabMode: true,
            tabs: [firstTab],
            activeTabId: firstTab.id,
          };
        });
      },

      disableMultiTabMode: () => {
        set((state) => {
          const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);
          return {
            ...state,
            isMultiTabMode: false,
            tabs: [],
            activeTabId: null,
            number: activeTab?.number || state.number,
            message: activeTab?.message || state.message,
          };
        });
      },

      // Migration helper
      migrateToMultiTab: () => {
        get().enableMultiTabMode();
      },

      // Sync legacy state with active tab
      syncLegacyState: () => {
        const state = get();
        const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);
        if (activeTab) {
          set({
            number: activeTab.number,
            message: activeTab.message,
          });
        }
      },
    }),
    {
      name: "jira-helper-storage",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // Migration from v1 to v2: Convert single-tab to multi-tab structure
          const now = new Date();
          const firstTab: Tab = {
            id: uuidv4(),
            number: persistedState?.number || "1",
            message: persistedState?.message || "",
            isActive: true,
            createdAt: now,
            lastModified: now,
          };

          return {
            ...persistedState,
            tabs: [firstTab],
            activeTabId: firstTab.id,
            maxTabs: 10,
            nextTabNumber: parseInt(persistedState?.number || "1") + 1,
            isMultiTabMode: false, // Start in legacy mode
          };
        }
        return persistedState;
      },
    }
  )
);