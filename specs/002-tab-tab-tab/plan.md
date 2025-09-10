# Implementation Plan: JIRA Tab Management System

**Branch**: `002-tab-tab-tab` | **Date**: 2025-09-10 | **Spec**: [spec.md](/home/gyuha/workspace/gitlab-jira-helper/specs/002-tab-tab-tab/spec.md)
**Input**: Feature specification from `/home/gyuha/workspace/gitlab-jira-helper/specs/002-tab-tab-tab/spec.md`

## Summary
Transform existing single JIRA ticket interface into multi-tab system where each tab manages independent JIRA ticket data while sharing global configuration (prefix, jiraDomain, gitBranchPrefix) in header section.

## Technical Context
**Language/Version**: TypeScript 5.8, React 19  
**Primary Dependencies**: Zustand (state), Radix UI (components), Tailwind CSS (styling), Lucide React (icons)  
**Storage**: localStorage via zustand persist middleware  
**Testing**: Not specified - NEEDS CLARIFICATION  
**Target Platform**: PWA (Progressive Web App) - browser-based  
**Project Type**: web - React frontend application  
**Performance Goals**: <100ms tab switching, <50ms state persistence  
**Constraints**: Maximum 10 tabs, localStorage-based persistence, responsive design (mobile + desktop)  
**Scale/Scope**: Single-page application, 10 tabs max, lightweight state management

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (single React PWA)
- Using framework directly? Yes - React + Zustand without wrappers
- Single data model? Yes - Extended JiraState with tab management
- Avoiding patterns? Yes - No unnecessary abstractions

**Architecture**:
- EVERY feature as library? N/A - UI component modification
- Libraries listed: Tab management extensions to existing store
- CLI per library: N/A - PWA interface
- Library docs: llms.txt format planned? N/A - UI components

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? NEEDS CLARIFICATION - No test framework specified
- Git commits show tests before implementation? NEEDS CLARIFICATION
- Order: Contract→Integration→E2E→Unit strictly followed? NEEDS CLARIFICATION
- Real dependencies used? N/A - Frontend components
- Integration tests for: new libraries, contract changes, shared schemas? NEEDS CLARIFICATION
- FORBIDDEN: Implementation before test, skipping RED phase

**Observability**:
- Structured logging included? Browser console logging sufficient for PWA
- Frontend logs → backend? N/A - Frontend-only application
- Error context sufficient? React error boundaries needed

**Versioning**:
- Version number assigned? 1.0.0 (from package.json)
- BUILD increments on every change? No - PWA deployment model
- Breaking changes handled? State migration needed for existing users

## Project Structure

### Documentation (this feature)
```
specs/002-tab-tab-tab/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 2: Web application (frontend React PWA)
src/
├── components/
│   ├── JiraHelper.tsx          # MODIFY: Add tab interface
│   ├── TabContainer.tsx        # NEW: Tab management UI
│   ├── TabHeader.tsx           # NEW: Individual tab component
│   └── ui/                     # EXISTING: UI components
├── stores/
│   └── jiraStore.ts            # MODIFY: Add multi-tab state
├── hooks/
│   └── useTabs.ts              # NEW: Tab management logic
└── types/
    └── tabs.ts                 # NEW: Tab-related type definitions
```

**Structure Decision**: Option 2 (Web application) - React PWA with component modifications and new tab management

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Testing framework selection for React 19 + TypeScript
   - State migration strategy for existing users
   - Tab switching performance optimization techniques
   - localStorage quota limits and management
   - Error boundary implementation patterns

2. **Generate and dispatch research agents**:
   ```
   Task: "Research testing frameworks for React 19 + TypeScript PWA applications"
   Task: "Find best practices for zustand state migrations in PWA applications"  
   Task: "Research tab switching performance optimization in React applications"
   Task: "Find localStorage management patterns for multi-tab state persistence"
   Task: "Research React error boundary patterns for tab management"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Tab: id, title, number, message, isActive
   - GlobalSettings: prefix, jiraDomain, gitBranchPrefix  
   - TabCollection: tabs array, activeTabId, maxTabs

2. **Generate API contracts** from functional requirements:
   - Tab management: createTab(), closeTab(), switchTab(), updateTab()
   - State persistence: saveTabState(), loadTabState(), migrateState()
   - Output to `/contracts/` as TypeScript interfaces

3. **Generate contract tests** from contracts:
   - Tab creation/deletion test scenarios
   - State persistence test scenarios
   - Tab switching test scenarios

4. **Extract test scenarios** from user stories:
   - Multi-tab workflow integration tests
   - Tab persistence across sessions
   - Global settings propagation tests

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh claude` for Claude Code
   - Add React 19, Zustand tab patterns, PWA state management
   - Update with tab management component patterns
   - Keep under 150 lines for token efficiency

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each interface → contract test task [P]
- Each entity → TypeScript type definition task [P]
- Each user story → component integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Interface definitions → Tests → Implementation
- Dependency order: Types → Store modifications → Components → Integration
- Mark [P] for parallel execution (independent components)

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md
- Type definitions (3-4 tasks)
- Store modifications (4-5 tasks)
- Component creation/modification (8-10 tasks)
- Integration and testing (5-6 tasks)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| No testing framework | PWA development pattern, simple UI components | Testing infrastructure overhead for UI-focused feature |
| State mutation in Zustand | Performance for tab switching, React 19 compatibility | Immutable updates cause unnecessary re-renders |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (with documented exceptions)
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*