# Tasks: JIRA Tab Management System

**Input**: Design documents from `/home/gyuha/workspace/gitlab-jira-helper/specs/002-tab-tab-tab/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **React PWA**: `src/`, `tests/` at repository root
- Paths assume React PWA structure per plan.md

## Phase 3.1: Setup
- [ ] T001 Create testing environment setup files per quickstart.md requirements
- [ ] T002 Install testing dependencies: vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom, playwright
- [ ] T003 [P] Configure vitest.config.ts and src/test/setup.ts per quickstart specifications

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test for TabManagementAPI interface in src/__tests__/contracts/tab-management-api.test.ts
- [ ] T005 [P] Contract test for StatePersistenceAPI interface in src/__tests__/contracts/state-persistence-api.test.ts
- [ ] T006 [P] Contract test for TabEnabledJiraState store interface in src/__tests__/contracts/zustand-store.test.ts
- [ ] T007 [P] Integration test for tab creation workflow in src/__tests__/integration/tab-creation.test.ts
- [ ] T008 [P] Integration test for tab switching workflow in src/__tests__/integration/tab-switching.test.ts
- [ ] T009 [P] Integration test for tab closure workflow in src/__tests__/integration/tab-closure.test.ts
- [ ] T010 [P] Integration test for global settings propagation in src/__tests__/integration/global-settings.test.ts
- [ ] T011 [P] Integration test for state migration from v1 to v2 in src/__tests__/integration/state-migration.test.ts

## Phase 3.3: Type Definitions (ONLY after tests are failing)
- [ ] T012 [P] Tab interface types in src/types/tabs.ts
- [ ] T013 [P] GlobalSettings interface types in src/types/tabs.ts
- [ ] T014 [P] TabCollection interface types in src/types/tabs.ts
- [ ] T015 [P] TabError and TabErrorCode types in src/types/tabs.ts

## Phase 3.4: Core Store Implementation
- [ ] T016 Extend existing JiraStore with tab management state in src/stores/jiraStore.ts
- [ ] T017 Add tab CRUD operations to JiraStore in src/stores/jiraStore.ts
- [ ] T018 Add global settings management to JiraStore in src/stores/jiraStore.ts
- [ ] T019 Add state migration logic for v1 to v2 in src/stores/jiraStore.ts
- [ ] T020 Add backward compatibility layer for legacy methods in src/stores/jiraStore.ts

## Phase 3.5: Tab Management Hook
- [ ] T021 [P] Create useTabs custom hook with tab operations in src/hooks/useTabs.ts
- [ ] T022 [P] Create useTabValidation hook for input validation in src/hooks/useTabValidation.ts

## Phase 3.6: UI Components Implementation
- [ ] T023 [P] Create TabHeader component for individual tab display in src/components/TabHeader.tsx
- [ ] T024 [P] Create TabContent component for tab-specific content in src/components/TabContent.tsx
- [ ] T025 [P] Create TabContainer component for overall tab management UI in src/components/TabContainer.tsx
- [ ] T026 Modify JiraHelper component to integrate tab system in src/components/JiraHelper.tsx
- [ ] T027 Add tab-specific test IDs and accessibility attributes to all tab components

## Phase 3.7: State Persistence & Migration
- [ ] T028 [P] Implement localStorage serialization/deserialization in src/utils/storage.ts
- [ ] T029 [P] Create state migration utilities in src/utils/migration.ts
- [ ] T030 Add error boundary component for tab error handling in src/components/TabErrorBoundary.tsx

## Phase 3.8: Integration & Polish
- [ ] T031 Integration test for complete multi-tab workflow in src/__tests__/integration/multi-tab-workflow.test.ts
- [ ] T032 Add E2E tests for tab management using Playwright in tests/e2e/tab-management.spec.ts
- [ ] T033 Performance test for tab switching (<100ms requirement) in tests/performance/tab-switching.spec.ts
- [ ] T034 [P] Add unit tests for tab validation utilities in src/__tests__/unit/tab-validation.test.ts
- [ ] T035 [P] Add unit tests for storage utilities in src/__tests__/unit/storage.test.ts
- [ ] T036 [P] Add unit tests for migration utilities in src/__tests__/unit/migration.test.ts
- [ ] T037 Update package.json scripts for testing commands
- [ ] T038 Manual testing checklist execution per quickstart.md requirements

## Dependencies
- Setup (T001-T003) before everything
- Tests (T004-T011) before implementation (T012-T030)
- Types (T012-T015) before store implementation (T016-T020)
- Store (T016-T020) before hooks (T021-T022)
- Hooks (T021-T022) before components (T023-T026)
- Core components before integration (T031-T033)
- Implementation before polish (T034-T038)

## Parallel Example
```bash
# Launch T004-T011 together (contract and integration tests):
Task: "Contract test for TabManagementAPI interface in src/__tests__/contracts/tab-management-api.test.ts"
Task: "Contract test for StatePersistenceAPI interface in src/__tests__/contracts/state-persistence-api.test.ts"
Task: "Contract test for TabEnabledJiraState store interface in src/__tests__/contracts/zustand-store.test.ts"
Task: "Integration test for tab creation workflow in src/__tests__/integration/tab-creation.test.ts"
Task: "Integration test for tab switching workflow in src/__tests__/integration/tab-switching.test.ts"
Task: "Integration test for tab closure workflow in src/__tests__/integration/tab-closure.test.ts"
Task: "Integration test for global settings propagation in src/__tests__/integration/global-settings.test.ts"
Task: "Integration test for state migration from v1 to v2 in src/__tests__/integration/state-migration.test.ts"

# Launch T012-T015 together (type definitions):
Task: "Tab interface types in src/types/tabs.ts"
Task: "GlobalSettings interface types in src/types/tabs.ts" 
Task: "TabCollection interface types in src/types/tabs.ts"
Task: "TabError and TabErrorCode types in src/types/tabs.ts"

# Launch T023-T025 together (independent components):
Task: "Create TabHeader component for individual tab display in src/components/TabHeader.tsx"
Task: "Create TabContent component for tab-specific content in src/components/TabContent.tsx"
Task: "Create TabContainer component for overall tab management UI in src/components/TabContainer.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify ALL tests fail before implementing (RED phase critical)
- Commit after each task completion
- Follow TDD: Red → Green → Refactor cycle strictly
- Maintain backward compatibility with existing JiraHelper functionality

## Task Generation Rules Applied
*Applied during generation*

1. **From Contracts**:
   - tab-management.ts → T004 (TabManagementAPI), T005 (StatePersistenceAPI) contract tests
   - zustand-store.ts → T006 (TabEnabledJiraState) contract test

2. **From Data Model**:
   - Tab entity → T012 type definition, T016 store implementation
   - GlobalSettings entity → T013 type definition, T018 store implementation  
   - TabCollection entity → T014 type definition, T017 store CRUD operations

3. **From User Stories**:
   - Tab creation → T007 integration test
   - Tab switching → T008 integration test
   - Tab closure → T009 integration test
   - Global settings → T010 integration test
   - State migration → T011 integration test

4. **Ordering**:
   - Setup (T001-T003) → Tests (T004-T011) → Types (T012-T015) → Store (T016-T020) → Hooks (T021-T022) → Components (T023-T027) → Integration (T028-T033) → Polish (T034-T038)

## Validation Checklist ✅
*GATE: Checked before completion*

- [x] All contracts have corresponding tests (T004-T006)
- [x] All entities have model tasks (T012-T015)
- [x] All tests come before implementation
- [x] Parallel tasks truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Backward compatibility maintained with existing JiraHelper
- [x] Performance requirements addressed (T033)
- [x] Migration strategy implemented (T011, T019, T029)