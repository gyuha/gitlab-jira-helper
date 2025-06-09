import { useState } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { useJiraStore } from "../stores/jiraStore";
import { OutputItem } from "./OutputItem";
import { ThemeToggle } from "./ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const COMMIT_TYPES = [
  { value: "feat", label: "feat: 기능 개발" },
  { value: "fix", label: "fix: 오류 수정" },
  { value: "docs", label: "docs: 문서 변경" },
  {
    value: "style",
    label: "style: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)",
  },
  { value: "refactor", label: "refactor: 코드 리팩토링 (기능 변경 없음)" },
  { value: "test", label: "test: 테스트 추가 또는 수정" },
  { value: "chore", label: "chore: 빌드 프로세스나 보조 도구 변경" },
  { value: "perf", label: "perf: 성능 개선" },
  { value: "ci", label: "ci: CI 설정 파일 및 스크립트 변경" },
  {
    value: "build",
    label: "build: 빌드 시스템이나 외부 의존성에 영향을 주는 변경",
  },
];

export function JiraHelper() {
  const {
    prefix,
    gitBranchPrefix,
    number,
    message,
    setPrefix,
    setGitBranchPrefix,
    setNumber,
    setMessage,
    getJiraTicket,
    getCommit,
    getCommitMessage,
    getSwitchNewCommand,
    getSwitchCommand,
    jiraDomain,
    setJiraDomain,
  } = useJiraStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedCommitType, setSelectedCommitType] = useState<string>("feat");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [domainError, setDomainError] = useState<string>("");

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleNumberChange = (value: string) => {
    // 숫자만 허용
    const numbersOnly = value.replace(/\D/g, "");
    setNumber(numbersOnly);
  };

  const handlePrefixChange = (value: string) => {
    // 대문자로 변환
    const formatted = value.toUpperCase();
    setPrefix(formatted);
  };

  // 도메인/IP 유효성 검증 함수
  const validateDomain = (value: string) => {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/;
    if (!value) {
      setDomainError("");
      return false;
    }
    if (domainRegex.test(value) || ipRegex.test(value)) {
      setDomainError("");
      return true;
    } else {
      setDomainError("올바른 도메인 또는 IP 형식이 아닙니다.");
      return false;
    }
  };

  // 입력 변경 핸들러
  const handleJiraDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJiraDomain(value);
    validateDomain(value);
  };

  const isFormComplete = !!(prefix && number);
  const isUrlReady = !!(jiraDomain && prefix && number && !domainError);
  const issueKey = `${prefix}${number}`;
  const issueUrl = isUrlReady ? `https://${jiraDomain}/browse/${issueKey}` : "";

  // 출력 항목들을 계산하는 헬퍼 함수들
  const createOutputItems = () => [
    {
      label: "JIRA 티켓 번호",
      value: getJiraTicket(),
      placeholder: "[JIRA Prefix][JIRA 번호]",
      copyKey: "jira-ticket",
    },
    {
      label: "Git branch",
      value: getSwitchCommand().replace("git switch ", ""),
      placeholder: "[Git branch prefix]/[JIRA Prefix]-[JIRA 번호]",
      copyKey: "git-branch",
    },
    {
      label: "commit",
      value: getCommit(selectedCommitType),
      placeholder: `git commit -m "${selectedCommitType}([JIRA Prefix][JIRA 번호]): [메시지]"`,
      copyKey: "commit",
    },
    {
      label: "commit message",
      value: getCommitMessage(selectedCommitType),
      placeholder: `${selectedCommitType}([JIRA Prefix][JIRA 번호]): [메시지]`,
      copyKey: "commit-message",
    },
    {
      label: "switch(new)",
      value: getSwitchNewCommand(),
      placeholder: "git switch -c [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]",
      copyKey: "switch-new",
    },
    {
      label: "switch",
      value: getSwitchCommand(),
      placeholder: "git switch [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]",
      copyKey: "switch",
    },
  ];

  // React 19에서도 복잡한 계산은 여전히 메모이제이션이 권장됨
  const outputItems = createOutputItems();

  // 검색 결과 필터링
  const filteredOutputItems = () => {
    if (!searchQuery.trim()) {
      return outputItems;
    }

    const fuse = new Fuse(outputItems, {
      keys: ["label", "value"],
      threshold: 0.4,
      includeScore: true,
    });

    const searchResults = fuse.search(searchQuery);
    return searchResults.map((result) => result.item);
  };

  return (
    <div className="min-h-screen bg-background p-1 sm:p-2">
      <Card className="w-full">
        <CardHeader className="text-center relative px-2 py-2 sm:px-4 sm:py-3">
          <ThemeToggle />
          <CardTitle className="text-lg sm:text-xl font-bold hidden sm:block">
            JIRA Helper
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm hidden sm:block">
            JIRA 티켓 및 Git 명령어를 생성하고 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-2 py-2 sm:px-4 sm:py-3">
          {/* 입력 섹션 */}
          <div>
            <h3 className="text-base font-semibold">입력</h3>
            <div className="space-y-3">
              {/* JIRA_DOMAIN 입력란 (PC에서만 보임) */}
              <div className="space-y-1 hidden sm:block">
                <label htmlFor="jiraDomain" className="text-xs font-medium">
                  JIRA 도메인
                </label>
                <Input
                  id="jiraDomain"
                  type="text"
                  value={jiraDomain}
                  onChange={handleJiraDomainChange}
                  placeholder="your-domain.atlassian.net"
                />
                {domainError && (
                  <p className="text-xs text-red-500">{domainError}</p>
                )}
              </div>
              {/* 첫 번째 행: JIRA Prefix, Git branch prefix, JIRA 번호 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-3">
                {/* JIRA Prefix 입력 - 작은 화면에서 숨김 */}
                <div className="space-y-1 hidden sm:block">
                  <label htmlFor="prefix" className="text-xs font-medium">
                    JIRA Prefix
                  </label>
                  <Input
                    id="prefix"
                    type="text"
                    value={prefix}
                    onChange={(e) => handlePrefixChange(e.target.value)}
                    placeholder="PWA"
                  />
                </div>
                {/* Git branch prefix 입력 - 작은 화면에서 숨김 */}
                <div className="space-y-1 hidden sm:block">
                  <label
                    htmlFor="gitBranchPrefix"
                    className="text-xs font-medium"
                  >
                    Git branch prefix
                  </label>
                  <Input
                    id="gitBranchPrefix"
                    type="text"
                    value={gitBranchPrefix}
                    onChange={(e) => setGitBranchPrefix(e.target.value)}
                    placeholder="feature/"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="number" className="text-xs font-medium">
                    JIRA 번호
                  </label>
                  <Input
                    id="number"
                    type="number"
                    value={number}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    placeholder="1234"
                  />
                </div>
                {/* 커밋 타입 선택 */}
                <div className="space-y-1">
                  <label htmlFor="commitType" className="text-xs font-medium">
                    커밋 타입
                  </label>
                  <Select
                    value={selectedCommitType}
                    onValueChange={setSelectedCommitType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="커밋 타입을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMIT_TYPES.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>{" "}
              <div className="space-y-1">
                <label
                  htmlFor="message"
                  className="text-xs font-medium text-muted-foreground"
                >
                  메시지 (선택사항)
                </label>
                <Input
                  id="message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="메시지를 입력하세요 (기본값: '작업 내용' 사용)"
                />
              </div>
            </div>
          </div>{" "}
          {/* 출력 섹션 */}
          <div>
            {" "}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold">출력</h3>
              <div className="w-48 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="출력 결과 검색..."
                  className="text-sm h-7 pl-10"
                />
              </div>
            </div>
            {/* URL 추가 */}
            {isUrlReady && (
              <div className="mb-2">
                <span className="text-xs font-medium mr-2">이슈 URL:</span>
                <a
                  href={issueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline break-all hover:text-primary/80"
                >
                  {issueUrl}
                </a>
              </div>
            )}
            <div className="space-y-2 sm:space-y-3">
              {filteredOutputItems().length > 0 ? (
                filteredOutputItems().map((item) => (
                  <OutputItem
                    key={item.copyKey}
                    label={item.label}
                    value={item.value}
                    placeholder={item.placeholder}
                    copyKey={item.copyKey}
                    copied={copied}
                    isFormComplete={isFormComplete}
                    onCopy={handleCopy}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
