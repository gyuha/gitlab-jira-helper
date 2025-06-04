import { useState } from "react";
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
  } = useJiraStore();
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedCommitType, setSelectedCommitType] = useState<string>("feat");

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

  const isFormComplete = !!(prefix && number);

  const outputItems = [
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
      label: "commit 메시지",
      value: getCommitMessage(selectedCommitType),
      placeholder: `${selectedCommitType}([JIRA Prefix][JIRA 번호]): [메시지]`,
      copyKey: "commit",
    },
    {
      label: "switch(new)",
      value: getSwitchNewCommand(),
      placeholder:
        "git switch -c [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]",
      copyKey: "switch-new",
    },
    {
      label: "switch",
      value: getSwitchCommand(),
      placeholder: "git switch [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]",
      copyKey: "switch",
    },
  ];

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
            <h3 className="text-base font-semibold mb-2">입력</h3>
            <div className="space-y-3">
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
                    className="font-mono text-sm h-8"
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
                    className="font-mono text-sm h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="number" className="text-xs font-medium">
                    JIRA 번호
                  </label>
                  <Input
                    id="number"
                    type="text"
                    value={number}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    placeholder="1234"
                    className="font-mono text-sm h-8"
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
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="커밋 타입을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMIT_TYPES.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="text-sm"
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                  className="text-sm h-8"
                />
              </div>
            </div>
          </div>
          {/* 출력 섹션 */}
          <div>
            <h3 className="text-base font-semibold mb-2">출력</h3>
            <div className="space-y-2 sm:space-y-3">
              {outputItems.map((item) => (
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
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
