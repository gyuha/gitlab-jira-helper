import React from 'react';
import { Plus, X } from 'lucide-react';
import { useJiraStore } from '../stores/jiraStore';
import type { Tab } from '../types/tabs';
import { cn } from '../lib/utils';

interface TabContainerProps {
  children: React.ReactNode;
}

interface TabHeaderProps {
  tab: Tab;
  isActive: boolean;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({
  tab,
  isActive,
  onTabClick,
  onTabClose,
}) => {
  const displayTitle = tab.number;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTabClose(tab.id);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-3 py-2 text-sm border-b-2 cursor-pointer transition-colors min-w-0',
        isActive
          ? 'border-primary bg-background text-foreground'
          : 'border-transparent bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
      onClick={() => onTabClick(tab.id)}
    >
      <span className="truncate flex-1 min-w-0">
        {displayTitle || '새 탭'}
      </span>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-0.5 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
        type="button"
        aria-label={`${displayTitle} 탭 닫기`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export const TabContainer: React.FC<TabContainerProps> = ({ children }) => {
  const {
    tabs,
    activeTabId,
    canAddTab,
    createTab,
    closeTab,
    switchToTab,
    isMultiTabMode,
    enableMultiTabMode,
  } = useJiraStore();

  // Enable multi-tab mode if not already enabled
  React.useEffect(() => {
    if (!isMultiTabMode) {
      enableMultiTabMode();
    }
  }, [isMultiTabMode, enableMultiTabMode]);

  const handleTabClick = (tabId: string) => {
    try {
      switchToTab(tabId);
    } catch (error) {
      console.error('Failed to switch tab:', error);
    }
  };

  const handleTabClose = (tabId: string) => {
    try {
      closeTab(tabId);
    } catch (error) {
      console.error('Failed to close tab:', error);
    }
  };

  const handleAddTab = () => {
    if (canAddTab()) {
      try {
        createTab();
      } catch (error) {
        console.error('Failed to create tab:', error);
      }
    }
  };

  if (!isMultiTabMode || tabs.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b bg-muted/30">
        <div className="flex flex-1 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20">
          {tabs.map((tab) => (
            <TabHeader
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onTabClick={handleTabClick}
              onTabClose={handleTabClose}
            />
          ))}
        </div>
        
        {/* Add Tab Button */}
        {canAddTab() && (
          <button
            onClick={handleAddTab}
            className="flex-shrink-0 px-3 py-2 text-sm border-b-2 border-transparent bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            type="button"
            aria-label="새 탭 추가"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};