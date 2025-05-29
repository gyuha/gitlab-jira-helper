# JIRA Helper PWA

React 19 + TypeScript + Vite 기반의 JIRA 티켓 번호 생성 및 관리 PWA입니다.

## 🚀 주요 기능

- **JIRA 티켓 번호 생성**: Prefix와 번호를 입력하여 JIRA 티켓 번호를 생성
- **클립보드 복사**: 생성된 티켓 번호를 원클릭으로 클립보드에 복사
- **JIRA 연동**: 생성된 티켓 번호로 바로 JIRA 페이지 열기
- **히스토리 관리**: 최근 사용한 티켓 번호 기록 (LocalStorage 저장)
- **다크/라이트 모드**: 테마 전환 지원
- **PWA 지원**: 앱 설치 및 오프라인 사용 가능
- **반응형 디자인**: 모바일/데스크톱 환경 모두 지원

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript
- **UI**: Shadcn UI, Tailwind CSS, Radix UI
- **상태 관리**: Zustand (LocalStorage 지속성)
- **빌드 도구**: Vite
- **PWA**: vite-plugin-pwa, Workbox

## 📱 설치 및 실행

### 개발 환경 실행
```bash
pnpm install
pnpm dev
```

### 프로덕션 빌드
```bash
pnpm build
pnpm preview
```

### PWA 설치
브라우저에서 앱을 열고 주소창의 설치 버튼을 클릭하여 PWA로 설치할 수 있습니다.

## 🎯 사용 방법

1. **JIRA Prefix 입력**: 프로젝트별 접두사 입력 (예: PWA-, TASK-)
2. **JIRA 번호 입력**: 티켓 번호 입력 (숫자만)
3. **복사**: 생성된 티켓 번호를 클립보드로 복사
4. **JIRA 열기**: 해당 티켓으로 바로 JIRA 페이지 이동
5. **초기화**: 입력값 초기화

## 🔧 설정

`src/components/JiraHelper.tsx` 파일에서 JIRA URL을 실제 회사의 JIRA 주소로 변경하세요:

```typescript
const jiraUrl = `https://your-company.atlassian.net/browse/${ticket}`
```

## 📋 라이선스

MIT License
