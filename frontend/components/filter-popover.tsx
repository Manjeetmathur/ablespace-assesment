'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Check,
  CircleDot,
  Filter,
  Signal,
  Users,
  Calendar,
  Building,
  Tag,
  UserCheck,
} from 'lucide-react';

interface FilterPopoverProps {
  activePriority: string | null;
  onSelectPriority: (priority: string | null) => void;
  activeStatus?: string | null;
  onSelectStatus?: (status: string | null) => void;
}

export function FilterPopover({
  activePriority,
  onSelectPriority,
  activeStatus,
  onSelectStatus,
}: FilterPopoverProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-9 w-9 rounded-lg border border-border bg-background inline-flex items-center justify-center hover:bg-accent transition-colors">
        <Filter className="h-4 w-4 text-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 rounded-2xl p-1.5 shadow-xl border border-border" align="end">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold px-2 py-1">
          Filter Tasks
        </DropdownMenuLabel>

        {/* Status Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer">
            <CircleDot className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44 rounded-lg p-1 shadow-lg border border-border">
            {[
              { id: null, label: 'All Statuses' },
              { id: 'TODO', label: 'To Do' },
              { id: 'DOING', label: 'Doing' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'ON_HOLD', label: 'On Hold' },
            ].map(item => (
              <DropdownMenuItem
                key={item.id || 'all'}
                onClick={() => onSelectStatus(item.id)}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer"
              >
                <span className="text-sm">{item.label}</span>
                {activeStatus === item.id ? <Check className="h-4 w-4 text-primary" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Priority Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer bg-accent/40">
            <Signal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Priority</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 rounded-2xl p-1.5 shadow-lg border border-border">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold px-2 py-1">
              Priority
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => onSelectPriority(null)}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer text-muted-foreground"
            >
              <span className="text-sm">No Priority</span>
              {activePriority === null ? <Check className="h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onSelectPriority('URGENT')}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer font-medium text-red-500"
            >
              <div className="flex items-center gap-2">
                <Signal className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                <span>Urgent</span>
              </div>
              {activePriority === 'URGENT' ? <Check className="h-4 w-4 text-red-500" /> : null}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onSelectPriority('HIGH')}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer font-medium text-orange-500"
            >
              <div className="flex items-center gap-2">
                <Signal className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                <span>High</span>
              </div>
              {activePriority === 'HIGH' ? <Check className="h-4 w-4 text-orange-500" /> : null}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onSelectPriority('MEDIUM')}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer font-medium text-amber-500"
            >
              <div className="flex items-center gap-2">
                <Signal className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>Medium</span>
              </div>
              {activePriority === 'MEDIUM' ? <Check className="h-4 w-4 text-amber-500" /> : null}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onSelectPriority('LOW')}
              className="flex items-center justify-between py-1.5 px-2.5 rounded-lg cursor-pointer font-medium text-zinc-400"
            >
              <div className="flex items-center gap-2">
                <Signal className="h-3.5 w-3.5 text-zinc-400" />
                <span>Low</span>
              </div>
              {activePriority === 'LOW' ? <Check className="h-4 w-4 text-zinc-400" /> : null}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Members Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Members</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44 rounded-lg p-1 shadow-lg border border-border">
            {['Admin', 'QA Team', 'Designer', 'Security'].map(member => (
              <DropdownMenuItem key={member} className="py-1.5 px-2.5 rounded-lg cursor-pointer text-sm">
                {member}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Due Date Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Due Date</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-44 rounded-lg p-1 shadow-lg border border-border">
            {['Today', 'This Week', 'This Month', 'Overdue'].map(dateRange => (
              <DropdownMenuItem key={dateRange} className="py-1.5 px-2.5 rounded-lg cursor-pointer text-sm">
                {dateRange}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Teams Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Teams</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44 rounded-lg p-1 shadow-lg border border-border">
            {['Engineering', 'Frontend', 'Design', 'QA'].map(team => (
              <DropdownMenuItem key={team} className="py-1.5 px-2.5 rounded-lg cursor-pointer text-sm">
                {team}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Labels Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Labels</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44 rounded-lg p-1 shadow-lg border border-border">
            {['Deployment', 'Testing', 'Design', 'Audit'].map(label => (
              <DropdownMenuItem key={label} className="py-1.5 px-2.5 rounded-lg cursor-pointer text-sm">
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Reporter Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2.5 py-2 px-3 rounded-lg cursor-pointer">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Reporter</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44 rounded-lg p-1shadow-lg border border-border">
            {['Dexter', 'Admin'].map(reporter => (
              <DropdownMenuItem key={reporter} className="py-1.5 px-2.5 rounded-lg cursor-pointer text-sm">
                {reporter}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
