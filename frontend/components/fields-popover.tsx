'use client';

import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Check, LayoutGrid, List } from 'lucide-react';

interface FieldsPopoverProps {
  viewMode: 'board' | 'list';
  onViewModeChange: (mode: 'board' | 'list') => void;
  sortBy?: string | null;
  onSortByChange?: (field: string | null) => void;
}

export function FieldsPopover({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
}: FieldsPopoverProps) {
  const toggleField = (key: string) => {
    if (!onSortByChange) return;
    if (sortBy === key) {
      onSortByChange(null);
    } else {
      onSortByChange(key);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="h-9 px-3.5 text-xs font-semibold rounded-lg border border-border bg-background text-foreground inline-flex items-center gap-2 hover:bg-muted cursor-pointer transition-colors shadow-xs">
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Fields {sortBy ? `(${sortBy})` : ''}</span>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] rounded-xl shadow-2xl border border-border bg-popover p-3" align="start" sideOffset={8}>
        {/* View Switcher Control */}
        <div className="bg-muted/70 rounded-lg p-0.5 grid grid-cols-2 mb-3">
          <Button
            type="button"
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={`h-8 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-background text-foreground shadow-xs border border-border font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List</span>
          </Button>
          <Button
            type="button"
            variant={viewMode === 'board' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('board')}
            className={`h-8 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'board'
                ? 'bg-background text-foreground shadow-xs border border-border font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Board</span>
          </Button>
        </div>

        {/* Fields Sorting Selection */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Sort by Field
          </div>
          {[
            { id: 'Priority', label: 'Priority' },
            { id: 'Members', label: 'Members / Lead' },
            { id: 'DueDate', label: 'Due Date' },
            { id: 'Teams', label: 'Teams' },
            { id: 'Labels', label: 'Labels' },
            { id: 'Status', label: 'Status' },
            { id: 'Reporter', label: 'Reporter' },
          ].map(field => {
            const isChecked = sortBy === field.id;
            return (
              <div
                key={field.id}
                onClick={() => toggleField(field.id)}
                className={`flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-accent-color/10 text-accent-color font-semibold'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="text-xs font-medium">
                  {field.label}
                </span>

                <div
                  className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-accent-color text-white dark:text-zinc-950 font-bold'
                      : 'bg-muted border border-border/60'
                  }`}
                >
                  {isChecked ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
