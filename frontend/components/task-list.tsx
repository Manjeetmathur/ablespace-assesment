'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/lib/api-client';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Signal } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  projects?: any[];
  onSelectTask: (task: Task) => void;
  onAddTask: (status: string) => void;
  onAddSubtask?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

const GROUPS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'DOING', title: 'Doing' },
  { id: 'COMPLETED', title: 'Completed' },
  { id: 'ON_HOLD', title: 'On Hold' },
];

export function TaskList({ tasks, projects, onSelectTask, onAddTask, onAddSubtask, onEditTask }: TaskListProps) {
  const getProjectName = (projIdOrName?: string) => {
    if (!projIdOrName) return null;
    const found = (projects || []).find(p => p.id === projIdOrName || p.name === projIdOrName);
    return found ? found.name : projIdOrName;
  };
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    TODO: true,
    DOING: true,
    COMPLETED: true,
    ON_HOLD: true,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'URGENT':
        return (
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
            <Signal className="h-3.5 w-3.5 fill-red-500" />
            <span>Urgent</span>
          </div>
        );
      case 'HIGH':
        return (
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500">
            <Signal className="h-3.5 w-3.5 fill-orange-500" />
            <span>High</span>
          </div>
        );
      case 'MEDIUM':
        return (
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
            <Signal className="h-3.5 w-3.5 fill-amber-500" />
            <span>Medium</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400">
            <Signal className="h-3.5 w-3.5" />
            <span>Low</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {GROUPS.map(grp => {
        const grpTasks = tasks.filter(t => (t.status || 'TODO').toUpperCase() === grp.id.toUpperCase());
        const isOpen = openGroups[grp.id] !== false;

        return (
          <div key={grp.id} className="space-y-3">
            {/* Accordion Group Trigger Button (Outside / Above Table) */}
            <Button
              variant="ghost"
              onClick={() => toggleGroup(grp.id)}
              className="flex items-center gap-2 p-0 h-auto font-bold text-sm text-foreground hover:bg-transparent hover:text-foreground cursor-pointer"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{grp.title}</span>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {grpTasks.length}
              </span>
            </Button>

            {/* Accordion Content Table Container Card */}
            {isOpen ? (
              <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent border-b border-border">
                      <TableHead className="w-[45%] pl-6 font-semibold text-xs text-muted-foreground uppercase">
                        Task
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                        Priority
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                        Members
                      </TableHead>
                      <TableHead className="font-semibold text-xs text-muted-foreground uppercase">
                        Due Date
                      </TableHead>
                      <TableHead className="text-right pr-6 font-semibold text-xs text-muted-foreground uppercase">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {grpTasks.map(task => (
                      <TableRow
                        key={task._id}
                        onClick={() => onSelectTask(task)}
                        className="cursor-pointer hover:bg-muted/40 transition-colors border-b border-border/60"
                      >
                        {/* Task Title */}
                        <TableCell className="pl-6 font-medium text-sm text-foreground">
                          {task.title}
                        </TableCell>

                        {/* Priority Badge */}
                        <TableCell>{renderPriorityBadge(task.priority)}</TableCell>

                        {/* Members Avatars */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-6 w-6 border border-border">
                              <AvatarImage src={task.members?.[0]?.avatar} />
                              <AvatarFallback className="text-[10px] bg-pink-500 text-white font-bold">
                                {task.members?.[0]?.name?.[0] || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-foreground/90">
                              {task.members?.[0]?.name || 'CN'}
                            </span>
                          </div>
                        </TableCell>

                        {/* Due Date */}
                        <TableCell className="text-xs text-muted-foreground font-medium">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'No Due Date'}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right pr-6" onClick={e => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 rounded-sm inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40 rounded-xl p-1 shadow-lg border border-border" align="end">
                              <DropdownMenuItem onClick={() => onSelectTask(task)}>
                                Open Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { if (onEditTask) onEditTask(task); }}>
                                Edit Task
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { if (onAddSubtask) onAddSubtask(task._id); }}>
                                Add Subtask
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Group Footer Row for Inline Task Addition */}
                    <TableRow className="hover:bg-transparent border-t border-border/40">
                      <TableCell colSpan={5} className="pl-6 py-2">
                        <Button
                          variant="ghost"
                          onClick={() => onAddTask(grp.id)}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground h-8 px-2 rounded-lg"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Add Task
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
