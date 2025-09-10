# Data Model: JIRA Tab Management System

## Core Entities

### Tab
Represents an individual JIRA ticket workspace.

**Fields**:
- `id: string` - Unique identifier (UUID)
- `number: string` - JIRA ticket number (numeric)
- `message: string` - Work description/commit message
- `isActive: boolean` - Whether this tab is currently selected
- `createdAt: Date` - When the tab was created
- `lastModified: Date` - Last time tab data was updated

**Validation Rules**:
- `id` must be unique across all tabs
- `number` must contain only digits
- `message` can be empty (defaults to "작업 내용")
- Only one tab can have `isActive: true` at a time
- `createdAt` and `lastModified` must be valid dates

**State Transitions**:
- `inactive → active`: When user clicks on tab header
- `active → inactive`: When another tab becomes active
- `exists → deleted`: When user clicks close button (X)

### GlobalSettings
Shared configuration applied to all tabs.

**Fields**:
- `prefix: string` - JIRA ticket prefix (e.g., "PRD-", "BUG-")
- `jiraDomain: string` - JIRA instance domain
- `gitBranchPrefix: string` - Git branch prefix (e.g., "feature/")

**Validation Rules**:
- `prefix` must end with "-" and be uppercase
- `jiraDomain` must be valid domain or IP address
- `gitBranchPrefix` can be any string, typically ends with "/"

### TabCollection
Manages the collection of tabs and global settings.

**Fields**:
- `tabs: Tab[]` - Array of all tabs
- `activeTabId: string | null` - ID of currently active tab
- `globalSettings: GlobalSettings` - Shared configuration
- `maxTabs: number` - Maximum allowed tabs (10)
- `nextTabNumber: number` - Auto-increment for default tab numbers

**Validation Rules**:
- `tabs` array length must not exceed `maxTabs`
- `activeTabId` must exist in `tabs` array or be null
- Must have at least one tab at all times
- `nextTabNumber` must be positive integer

**State Transitions**:
- `empty → single tab`: Initialize with one default tab
- `single tab → multiple tabs`: Add new tab via "Add Tab" button
- `multiple tabs → fewer tabs`: Remove tab via close button (X)
- `multiple tabs → single tab`: When closing to last tab, create new empty tab

## Relationships

```
TabCollection (1) ─contains─> Tab (0..10)
TabCollection (1) ─has─> GlobalSettings (1)
TabCollection (1) ─references─> Tab (0..1) [activeTab]
```

## Derived Data

### Computed Properties
Each tab can compute the following based on its data and global settings:

- `displayTitle: string` = `${globalSettings.prefix}${number}` (e.g., "PRD-123")
- `gitBranch: string` = `${globalSettings.gitBranchPrefix}${globalSettings.prefix}${number}`
- `jiraUrl: string` = `https://${globalSettings.jiraDomain}/browse/${displayTitle}`
- `commitMessage: string` = `${type}(${displayTitle}): ${message || "작업 내용"}`

### State Queries
- `getActiveTab(): Tab | null` - Returns currently active tab
- `getTabById(id: string): Tab | null` - Find tab by ID
- `canAddTab(): boolean` - Whether new tabs can be added (under maxTabs limit)
- `getNextAvailableNumber(): string` - Next suggested tab number

## Storage Schema

### localStorage Structure
```json
{
  "jira-tab-helper-storage": {
    "version": 2,
    "state": {
      "tabs": [
        {
          "id": "uuid-1",
          "number": "123",
          "message": "Fix login bug",
          "isActive": true,
          "createdAt": "2025-09-10T10:00:00Z",
          "lastModified": "2025-09-10T10:30:00Z"
        }
      ],
      "activeTabId": "uuid-1",
      "globalSettings": {
        "prefix": "PRD-",
        "jiraDomain": "company.atlassian.net",
        "gitBranchPrefix": "feature/"
      },
      "maxTabs": 10,
      "nextTabNumber": 124
    }
  }
}
```

### Migration Strategy
Version 1 → Version 2 migration:
- Convert single JIRA state to tab-based structure
- Preserve existing prefix, gitBranchPrefix, jiraDomain as globalSettings
- Create single tab with existing number and message
- Set created/modified timestamps to migration time