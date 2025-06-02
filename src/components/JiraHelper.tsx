import { Copy } from "lucide-react";
import { useState } from "react";
import { useJiraStore } from "../stores/jiraStore";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Input } from "./ui/input";

interface OutputItemProps {
  label: string;
  value: string;
  placeholder: string;
  copyKey: string;
  copied: string | null;
  isFormComplete: boolean;
  onCopy: (text: string, type: string) => void;
}

function OutputItem({ 
  label, 
  value, 
  placeholder, 
  copyKey, 
  copied, 
  isFormComplete, 
  onCopy 
}: OutputItemProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between p-2 bg-muted rounded-md border sm:gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-muted-foreground">
            {label}
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={!isFormComplete}
            onClick={() => onCopy(value, copyKey)}
            className="shrink-0 h-6 text-xs sm:hidden"
          >
            <Copy className="w-3 h-3 mr-1" />
            {copied === copyKey ? "복사됨!" : "복사"}
          </Button>
        </div>
        <code className="text-xs font-mono break-all">
          {isFormComplete ? value : placeholder}
        </code>
      </div>
      <Button
        size="sm"
        variant="outline"
        disabled={!isFormComplete}
        onClick={() => onCopy(value, copyKey)}
        className="shrink-0 w-full sm:w-auto h-7 text-xs hidden sm:flex"
      >
        <Copy className="w-3 h-3 mr-1" />
        {copied === copyKey ? "복사됨!" : "복사"}
      </Button>
    </div>
  );
}

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
    getFeatCommit,
    getFixCommit,
    getSwitchNewCommand,
    getSwitchCommand,
  } = useJiraStore();
  const [copied, setCopied] = useState<string | null>(null);

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
      copyKey: "jira-ticket"
    },
    {
      label: "Git branch",
      value: getSwitchCommand().replace("git switch ", ""),
      placeholder: "[Git branch prefix]/[JIRA Prefix]-[JIRA 번호]",
      copyKey: "git-branch"
    },
    {
      label: "feat commit 메시지",
      value: getFeatCommit(),
      placeholder: 'git commit -m "feat([JIRA Prefix][JIRA 번호]): [메시지]"',
      copyKey: "feat-commit"
    },
    {
      label: "fix commit 메시지",
      value: getFixCommit(),
      placeholder: 'git commit -m "fix([JIRA Prefix][JIRA 번호]): [메시지]"',
      copyKey: "fix-commit"
    },
    {
      label: "switch(new)",
      value: getSwitchNewCommand(),
      placeholder: "git switch -c [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]",
      copyKey: "switch-new"
    },
    {
      label: "switch",
      value: getSwitchCommand(),
      placeholder: "git switch [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]",
      copyKey: "switch"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background p-1 sm:p-2">
      <Card className="w-full">
        <CardHeader className="text-center relative px-2 py-2 sm:px-4 sm:py-3">
          <ThemeToggle />
          <CardTitle className="text-lg sm:text-xl font-bold hidden sm:block">JIRA Helper</CardTitle>
          <CardDescription className="text-xs sm:text-sm hidden sm:block">
            JIRA 티켓 및 Git 명령어를 생성하고 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-2 py-2 sm:px-4 sm:py-3">
          {" "}
          {/* 입력 섹션 */}
          <div>
            <h3 className="text-base font-semibold mb-2">입력</h3>
            <div className="space-y-3">
              {" "}
              {/* 첫 번째 행: JIRA Prefix, Git branch prefix, JIRA 번호 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3">
                {" "}                {/* JIRA Prefix 입력 - 작은 화면에서 숨김 */}
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
                </div>                {/* Git branch prefix 입력 - 작은 화면에서 숨김 */}
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
                  className="text-sm h-8"
                />
              </div>
            </div>
          </div>{" "}
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
