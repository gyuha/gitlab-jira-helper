import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { useJiraStore } from '../stores/jiraStore'
import { Copy, ExternalLink, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export function JiraHelper() {
  const { prefix, number,  setPrefix, setNumber, getJiraTicket, addToHistory, reset } = useJiraStore()
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    const ticket = getJiraTicket()
    await navigator.clipboard.writeText(ticket)
    addToHistory(ticket)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const handleOpenJira = () => {
    const ticket = getJiraTicket()
    // 실제 JIRA URL로 변경하세요
    const jiraUrl = `https://your-company.atlassian.net/browse/${ticket}`
    window.open(jiraUrl, '_blank')
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
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ThemeToggle />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">JIRA Helper</CardTitle>
          <CardDescription>
            JIRA 티켓 번호를 생성하고 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* JIRA Prefix 입력 */}
          <div className="space-y-2">
            <label htmlFor="prefix" className="text-sm font-medium">
              JIRA Prefix
            </label>            <Input
              id="prefix"
              type="text"
              value={prefix}
              onChange={(e) => handlePrefixChange(e.target.value)}
              placeholder="PWA-"
              className="font-mono"
            />
          </div>

          {/* JIRA 번호 입력 */}
          <div className="space-y-2">
            <label htmlFor="number" className="text-sm font-medium">
              JIRA 번호
            </label>            <Input
              id="number"
              type="text"
              value={number}
              onChange={(e) => handleNumberChange(e.target.value)}
              placeholder="1234"
              className="font-mono"
            />
          </div>

          {/* 생성된 티켓 번호 표시 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              생성된 티켓 번호
            </label>
            <div className="p-3 bg-muted rounded-md border">
              <code className="text-lg font-mono font-semibold">
                {getJiraTicket()}
              </code>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleCopy}
              className="w-full"
              variant={copied ? "secondary" : "default"}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "복사됨!" : "복사"}
            </Button>
            
            <Button 
              onClick={handleOpenJira}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              JIRA 열기
            </Button>
          </div>

          <Button 
            onClick={reset}
            variant="ghost"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
