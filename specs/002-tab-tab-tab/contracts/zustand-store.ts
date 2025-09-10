// Zustand Store Contract for Tab Management
// Defines the store interface that extends the existing JiraStore

import { Tab, GlobalSettings, TabCollection } from './tab-management';

// Extended Zustand Store State
export interface TabEnabledJiraState {
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
  isMultiTabMode: boolean; // Feature flag for gradual rollout

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
  createTab: (number?: string, message?: string) => string; // Returns new tab ID
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
}

// Store Actions Interface (for better organization)
export interface TabStoreActions {
  // Tab lifecycle
  createTab: (number?: string, message?: string) => string;
  closeTab: (tabId: string) => boolean;
  switchToTab: (tabId: string) => boolean;
  updateTabData: (tabId: string, updates: { number?: string; message?: string }) => boolean;

  // Tab queries
  getActiveTab: () => Tab | null;
  getTabById: (tabId: string) => Tab | null;
  getAllTabs: () => Tab[];
  canAddTab: () => boolean;

  // Global settings
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  getGlobalSettings: () => GlobalSettings;

  // Legacy compatibility
  syncLegacyState: () => void; // Sync single-tab state with active tab
}

// Store State Interface (for better organization)
export interface TabStoreState {
  // Current state
  tabs: Tab[];
  activeTabId: string | null;
  maxTabs: number;
  nextTabNumber: number;
  isMultiTabMode: boolean;

  // Global settings (extracted from legacy state)
  globalSettings: GlobalSettings;

  // Legacy compatibility
  legacyState: {
    prefix: string;
    gitBranchPrefix: string;
    number: string;
    message: string;
    history: string[];
    jiraDomain: string;
  };
}

// Persistence Configuration
export interface TabStorePersistConfig {
  name: string;
  version: number;
  migrate: (persistedState: any, version: number) => TabEnabledJiraState;
  partialize: (state: TabEnabledJiraState) => Partial<TabEnabledJiraState>;
}

// Store Creation Configuration
export interface TabStoreConfig {
  initialState: Partial<TabStoreState>;
  maxTabs: number;
  enableHistory: boolean;
  autoSave: boolean;
  migrationVersion: number;
}