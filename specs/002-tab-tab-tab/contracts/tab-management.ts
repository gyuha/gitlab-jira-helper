// Tab Management API Contracts
// TypeScript interfaces defining the tab management system contracts

export interface Tab {
  id: string;
  number: string;
  message: string;
  isActive: boolean;
  createdAt: Date;
  lastModified: Date;
}

export interface GlobalSettings {
  prefix: string;
  jiraDomain: string;
  gitBranchPrefix: string;
}

export interface TabCollection {
  tabs: Tab[];
  activeTabId: string | null;
  globalSettings: GlobalSettings;
  maxTabs: number;
  nextTabNumber: number;
}

// Tab Management Operations
export interface TabManagementAPI {
  // Tab CRUD Operations
  createTab(number?: string, message?: string): Promise<Tab>;
  closeTab(tabId: string): Promise<boolean>;
  switchTab(tabId: string): Promise<Tab>;
  updateTab(tabId: string, updates: Partial<Pick<Tab, 'number' | 'message'>>): Promise<Tab>;
  
  // Tab Queries
  getActiveTab(): Tab | null;
  getTabById(id: string): Tab | null;
  getAllTabs(): Tab[];
  canAddTab(): boolean;
  
  // Global Settings Management
  updateGlobalSettings(settings: Partial<GlobalSettings>): Promise<GlobalSettings>;
  getGlobalSettings(): GlobalSettings;
}

// State Persistence Operations
export interface StatePersistenceAPI {
  saveTabState(state: TabCollection): Promise<void>;
  loadTabState(): Promise<TabCollection | null>;
  migrateState(oldVersion: number, newVersion: number, data: any): Promise<TabCollection>;
  clearTabState(): Promise<void>;
}

// Computed Properties Interface
export interface TabComputedProperties {
  displayTitle: string;           // "PRD-123"
  gitBranch: string;             // "feature/PRD-123"
  jiraUrl: string;               // "https://domain/browse/PRD-123"
  commitMessage: string;         // "feat(PRD-123): message"
}

// Tab Events
export interface TabEvents {
  onTabCreated: (tab: Tab) => void;
  onTabClosed: (tabId: string) => void;
  onTabSwitched: (fromTabId: string | null, toTabId: string) => void;
  onTabUpdated: (tab: Tab, changes: Partial<Tab>) => void;
  onGlobalSettingsChanged: (settings: GlobalSettings, changes: Partial<GlobalSettings>) => void;
}

// Error Types
export class TabError extends Error {
  constructor(
    message: string,
    public readonly code: TabErrorCode,
    public readonly tabId?: string
  ) {
    super(message);
    this.name = 'TabError';
  }
}

export enum TabErrorCode {
  MAX_TABS_REACHED = 'MAX_TABS_REACHED',
  TAB_NOT_FOUND = 'TAB_NOT_FOUND',
  INVALID_TAB_DATA = 'INVALID_TAB_DATA',
  CANNOT_CLOSE_LAST_TAB = 'CANNOT_CLOSE_LAST_TAB',
  STORAGE_ERROR = 'STORAGE_ERROR',
  MIGRATION_ERROR = 'MIGRATION_ERROR',
}

// Validation Schemas
export interface TabValidation {
  isValidTabNumber(number: string): boolean;
  isValidPrefix(prefix: string): boolean;
  isValidDomain(domain: string): boolean;
  isValidGitBranchPrefix(prefix: string): boolean;
}