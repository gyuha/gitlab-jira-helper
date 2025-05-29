import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { useJiraStore } from '../stores/jiraStore'
import { Copy } from 'lucide-react'
import { useState } from 'react'

export function JiraHelper() {  const { 
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
    getSwitchCommand
  } = useJiraStore()
    const [copied, setCopied] = useState<string | null>(null)
  
  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleNumberChange = (value: string) => {
    // 숫자만 허용
    const numbersOnly = value.replace(/\D/g, '')
    setNumber(numbersOnly)
  }
  const handlePrefixChange = (value: string) => {
    // 대문자로 변환
    const formatted = value.toUpperCase()
    setPrefix(formatted)  }
  const isFormComplete = prefix && number
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center relative">
            <ThemeToggle />
            <CardTitle className="text-2xl font-bold">JIRA Helper</CardTitle>
            <CardDescription>
              JIRA 티켓 및 Git 명령어를 생성하고 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">            {/* 입력 섹션 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">입력</h3>
              <div className="space-y-4">
                {/* 첫 번째 행: JIRA Prefix, Git branch prefix, JIRA 번호 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* JIRA Prefix 입력 */}
                  <div className="space-y-2">
                    <label htmlFor="prefix" className="text-sm font-medium">
                      JIRA Prefix
                    </label>
                    <Input
                      id="prefix"
                      type="text"
                      value={prefix}
                      onChange={(e) => handlePrefixChange(e.target.value)}
                      placeholder="PWA"
                      className="font-mono"
                    />
                  </div>

                  {/* Git branch prefix 입력 */}
                  <div className="space-y-2">
                    <label htmlFor="gitBranchPrefix" className="text-sm font-medium">
                      Git branch prefix
                    </label>
                    <Input
                      id="gitBranchPrefix"
                      type="text"
                      value={gitBranchPrefix}
                      onChange={(e) => setGitBranchPrefix(e.target.value)}
                      placeholder="feature"
                      className="font-mono"
                    />
                  </div>

                  {/* JIRA 번호 입력 */}
                  <div className="space-y-2">
                    <label htmlFor="number" className="text-sm font-medium">
                      JIRA 번호
                    </label>
                    <Input
                      id="number"
                      type="text"
                      value={number}
                      onChange={(e) => handleNumberChange(e.target.value)}
                      placeholder="1234"
                      className="font-mono"
                    />
                  </div>
                </div>

                {/* 두 번째 행: 메시지 (전체 너비) */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    메시지
                  </label>
                  <Input
                    id="message"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="작업 내용을 입력하세요"
                  />
                </div>
              </div>
            </div>

            {/* 출력 섹션 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">출력</h3>
              <div className="space-y-4">
                {/* JIRA 티켓 번호 */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">JIRA 티켓 번호</div>                    <code className="text-sm font-mono">
                      {isFormComplete ? getJiraTicket() : '[JIRA Prefix][JIRA 번호]'}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isFormComplete}
                    onClick={() => handleCopy(getJiraTicket(), 'jira-ticket')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === 'jira-ticket' ? '복사됨!' : '복사'}
                  </Button>
                </div>

                {/* Git branch */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Git branch</div>
                    <code className="text-sm font-mono break-all">
                      {isFormComplete ? getSwitchCommand().replace('git switch ', '') : '[Git branch prefix]/[JIRA Prefix]-[JIRA 번호]'}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isFormComplete}
                    onClick={() => handleCopy(getSwitchCommand().replace('git switch ', ''), 'git-branch')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === 'git-branch' ? '복사됨!' : '복사'}
                  </Button>
                </div>

                {/* feat commit 메시지 */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">feat commit 메시지</div>                    <code className="text-sm font-mono break-all">
                      {isFormComplete ? getFeatCommit() : 'git commit -m "feat([JIRA Prefix][JIRA 번호]): [메시지]"'}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isFormComplete}
                    onClick={() => handleCopy(getFeatCommit(), 'feat-commit')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === 'feat-commit' ? '복사됨!' : '복사'}
                  </Button>
                </div>

                {/* fix commit 메시지 */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">fix commit 메시지</div>                    <code className="text-sm font-mono break-all">
                      {isFormComplete ? getFixCommit() : 'git commit -m "fix([JIRA Prefix][JIRA 번호]): [메시지]"'}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isFormComplete}
                    onClick={() => handleCopy(getFixCommit(), 'fix-commit')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === 'fix-commit' ? '복사됨!' : '복사'}
                  </Button>
                </div>

                {/* switch(new) */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">switch(new)</div>
                    <code className="text-sm font-mono break-all">
                      {isFormComplete ? getSwitchNewCommand() : 'git switch -c [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]'}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isFormComplete}
                    onClick={() => handleCopy(getSwitchNewCommand(), 'switch-new')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === 'switch-new' ? '복사됨!' : '복사'}
                  </Button>
                </div>

                {/* switch */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-md border">
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">switch</div>
                    <code className="text-sm font-mono break-all">
                      {isFormComplete ? getSwitchCommand() : 'git switch [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]'}
                    </code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!isFormComplete}
                    onClick={() => handleCopy(getSwitchCommand(), 'switch')}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied === 'switch' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
