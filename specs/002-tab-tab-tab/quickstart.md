# Quickstart: JIRA Tab Management System

## Overview
This guide walks through implementing and testing the multi-tab JIRA ticket management system. Follow the steps in order to ensure proper TDD implementation.

## Prerequisites
- Node.js 18+ installed
- React 19 and TypeScript 5.8 environment
- Zustand for state management
- Existing JIRA Helper PWA codebase
- pnpm

## Phase 1: Setup Test Environment

### 1. Install Testing Dependencies
```bash
pnpm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
pnpm install --save-dev playwright @playwright/test
```

### 2. Configure Vitest
Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

### 3. Setup Test Utilities
Create `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear()
})
```

## Phase 2: Contract Tests (RED Phase)

### 4. Create Tab Management Contract Tests
Create `src/__tests__/contracts/tab-management.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { TabManagementAPI, Tab, TabErrorCode } from '../../contracts/tab-management'

describe('Tab Management Contract', () => {
  let api: TabManagementAPI
  
  beforeEach(() => {
    // This will initially fail - no implementation yet
    api = createTabManagementAPI()
  })

  it('should create a new tab with auto-generated number', async () => {
    const tab = await api.createTab()
    expect(tab.id).toBeDefined()
    expect(tab.number).toMatch(/^\d+$/)
    expect(tab.isActive).toBe(true)
  })

  it('should not allow more than 10 tabs', async () => {
    // Create maximum tabs
    for (let i = 0; i < 10; i++) {
      await api.createTab()
    }
    
    // 11th tab should fail
    await expect(api.createTab()).rejects.toThrow(TabErrorCode.MAX_TABS_REACHED)
  })
  
  it('should automatically create new tab when closing last tab', async () => {
    const tab = await api.createTab('123', 'test')
    await api.closeTab(tab.id)
    
    const tabs = api.getAllTabs()
    expect(tabs.length).toBe(1)
    expect(tabs[0].number).toBe('')
    expect(tabs[0].message).toBe('')
  })
})
```

### 5. Create Store Integration Tests  
Create `src/__tests__/integration/tab-store.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useJiraStore } from '../../stores/jiraStore'

describe('Tab-enabled Jira Store Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should migrate from single-tab to multi-tab mode', () => {
    // Setup legacy state
    localStorage.setItem('jira-helper-storage', JSON.stringify({
      state: {
        prefix: 'PRD-',
        number: '123',
        message: 'existing work',
        jiraDomain: 'test.atlassian.net'
      }
    }))

    const { result } = renderHook(() => useJiraStore())
    
    act(() => {
      result.current.migrateToMultiTab()
    })

    expect(result.current.tabs).toHaveLength(1)
    expect(result.current.tabs[0].number).toBe('123')
    expect(result.current.tabs[0].message).toBe('existing work')
    expect(result.current.isMultiTabMode).toBe(true)
  })
})
```

### 6. Run Tests (Verify RED Phase)
```bash
pnpm run test
```
All tests should fail - this confirms RED phase is complete.

## Phase 3: Data Model Implementation (GREEN Phase)

### 7. Create Type Definitions
Create `src/types/tabs.ts` and implement interfaces from contracts.

### 8. Extend Zustand Store
Modify `src/stores/jiraStore.ts` to support multi-tab functionality while maintaining backward compatibility.

### 9. Create Tab Management Hook
Create `src/hooks/useTabs.ts` for tab-specific operations.

## Phase 4: UI Components (GREEN Phase)

### 10. Create Tab Components
- `src/components/TabContainer.tsx` - Main tab interface
- `src/components/TabHeader.tsx` - Individual tab component  
- `src/components/TabContent.tsx` - Tab content area

### 11. Modify Existing Components
Update `src/components/JiraHelper.tsx` to integrate tab system.

### 12. Run Tests (Verify GREEN Phase)
```bash
pnpm run test
```
All contract tests should now pass.

## Phase 5: E2E Testing with Playwright

### 13. Create E2E Test Scenarios
Create `tests/e2e/tab-management.spec.ts`:
```typescript
import { test, expect } from '@playwright/test'

test('multi-tab workflow', async ({ page }) => {
  await page.goto('/')
  
  // Test tab creation
  await page.click('[data-testid="add-tab-button"]')
  await expect(page.locator('[data-testid="tab-header"]')).toHaveCount(2)
  
  // Test tab switching
  await page.fill('[data-testid="jira-number-input"]', '456')
  await page.click('[data-testid="tab-1"]')
  await expect(page.locator('[data-testid="jira-number-input"]')).toHaveValue('')
  
  // Test tab persistence
  await page.reload()
  await expect(page.locator('[data-testid="tab-header"]')).toHaveCount(2)
})
```

### 14. Run E2E Tests
```bash
npx playwright test
```

## Phase 6: Performance Testing

### 15. Test Tab Switching Performance
```typescript
test('tab switching performance', async ({ page }) => {
  // Create multiple tabs
  for (let i = 0; i < 5; i++) {
    await page.click('[data-testid="add-tab-button"]')
  }
  
  // Measure tab switch time
  const start = Date.now()
  await page.click('[data-testid="tab-0"]')
  const switchTime = Date.now() - start
  
  expect(switchTime).toBeLessThan(100) // <100ms requirement
})
```

## Phase 7: User Acceptance Testing

### 16. Manual Testing Checklist
- [ ] Can create new tabs (max 10)
- [ ] Tab titles update with JIRA numbers
- [ ] Global settings affect all tabs
- [ ] Tab close button works
- [ ] Cannot close last tab (auto-creates new one)
- [ ] Tabs persist across browser refresh
- [ ] Mobile responsive design works
- [ ] All git commands generate correctly

### 17. Performance Validation
- [ ] Tab switching < 100ms
- [ ] State persistence < 50ms
- [ ] No memory leaks with multiple tabs
- [ ] Smooth scrolling on tab overflow

## Success Criteria
✅ All contract tests pass  
✅ All integration tests pass  
✅ All E2E tests pass  
✅ Performance requirements met  
✅ Manual testing checklist complete  
✅ No regressions in existing functionality  

## Rollback Plan
If issues arise:
1. Disable multi-tab mode via feature flag
2. Revert to single-tab mode
3. Preserve existing user data
4. Schedule bug fixes for next release

## Next Steps
After successful implementation:
1. Monitor user adoption and feedback
2. Consider additional features (tab reordering, tab grouping)
3. Optimize performance based on usage patterns
4. Plan for advanced tab management features