// Tab Management Types
// Based on specs/002-tab-tab-tab/contracts/tab-management.ts

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

// Tab Computed Properties
export interface TabComputedProperties {
  displayTitle: string;           // "PRD-123"
  gitBranch: string;             // "feature/PRD-123"
  jiraUrl: string;               // "https://domain/browse/PRD-123"
  commitMessage: string;         // "feat(PRD-123): message"
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