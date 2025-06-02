import { Copy } from "lucide-react";
import { Button } from "./ui/button";

interface OutputItemProps {
  label: string;
  value: string;
  placeholder: string;
  copyKey: string;
  copied: string | null;
  isFormComplete: boolean;
  onCopy: (text: string, type: string) => void;
}

export function OutputItem({ 
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
