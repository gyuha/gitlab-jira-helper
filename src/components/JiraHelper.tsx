import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { useJiraStore } from '../stores/jiraStore'
import { Copy, RotateCcw } from 'lucide-react'
import { useState } from 'react'

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
    addToHistory, 
    reset 
  } = useJiraStore()
  
  const [copied, setCopied] = useState<string | null>(null)
  
  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    addToHistory(getJiraTicket())
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleNumberChange = (value: string) => {
    // 숫자만 허용
    const numbersOnly = value.replace(/\D/g, '')
    setNumber(numbersOnly)
  }

  const handlePrefixChange = (value: string) => {
    // 대문자로 변환하고 특수문자 제한
    const formatted = value.toUpperCase().replace(/[^A-Z0-9-_]/g, '')
    setPrefix(formatted)
  }
  const isFormValid = prefix && number && message

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">JIRA Helper PWA</CardTitle>
            <CardDescription>
              JIRA 티켓 번호 생성 및 Git 명령어 도구
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 입력 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="prefix" className="text-sm font-medium">
                  JIRA Prefix
                </label>
                <Input
                  id="prefix"
                  type="text"
                  value={prefix}
                  onChange={(e) => handlePrefixChange(e.target.value)}
                  placeholder="PWA-"
                  className="font-mono"
                />
              </div>

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

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  메시지
                </label>
                <Input
                  id="message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="커밋 메시지를 입력하세요"
                />
              </div>
            </div>

            {/* 출력 섹션 - 항상 표시 */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">생성된 명령어들</h3>
              
              {/* JIRA 티켓 번호 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">JIRA 티켓 번호</p>
                    <code className="text-lg font-mono font-semibold">{getJiraTicket() || '[JIRA Prefix][JIRA 번호]'}</code>
                  </div>
                  <Button
                    size="sm"
                    variant={copied === 'ticket' ? "secondary" : "outline"}
                    onClick={() => handleCopy(getJiraTicket(), 'ticket')}
                    disabled={!getJiraTicket()}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied === 'ticket' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </div>

              {/* Git 명령어들 */}
              <div className="grid gap-3">
                {[
                  { label: 'feat commit 메시지', value: getFeatCommit(), type: 'feat', placeholder: 'git commit -m "feat([JIRA Prefix]-[JIRA 번호]): [메시지]"' },
                  { label: 'fix commit 메시지', value: getFixCommit(), type: 'fix', placeholder: 'git commit -m "fix([JIRA Prefix]-[JIRA 번호]): [메시지]"' },
                  { label: 'switch(new)', value: getSwitchNewCommand(), type: 'switch-new', placeholder: 'git switch -c [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]' },
                  { label: 'switch', value: getSwitchCommand(), type: 'switch', placeholder: 'git switch [Git branch prefix]/[JIRA Prefix]-[JIRA 번호]' }
                ].map(({ label, value, type, placeholder }) => (
                  <div key={type} className="flex items-center justify-between p-4 bg-muted rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground mb-1">{label}</p>
                      <code className="text-sm font-mono break-all">{value || placeholder}</code>
                    </div>
                    <Button
                      size="sm"
                      variant={copied === type ? "secondary" : "outline"}
                      onClick={() => handleCopy(value, type)}
                      className="ml-3 flex-shrink-0"
                      disabled={!isFormValid}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied === type ? '복사됨!' : '복사'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 초기화 버튼 */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={reset}
                variant="ghost"
                className="w-full max-w-xs"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                초기화
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
