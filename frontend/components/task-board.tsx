'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/lib/api-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, FolderKanban, GripVertical, MoreHorizontal, Plus, Tag } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  projects?: any[];
  onSelectTask: (task: Task) => void;
  onAddTask: (status: string) => void;
  onAddSubtask?: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'DOING', title: 'Doing' },
  { id: 'COMPLETED', title: 'Completed' },
  { id: 'ON_HOLD', title: 'On Hold' },
];

export function TaskBoard({ tasks, projects, onSelectTask, onAddTask, onAddSubtask, onEditTask }: TaskBoardProps) {
  const getProjectName = (projIdOrName?: string) => {
    if (!projIdOrName) return null;
    const found = (projects || []).find(p => p.id === projIdOrName || p.name === projIdOrName);
    return found ? found.name : projIdOrName;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 items-start">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => (t.status || 'TODO').toUpperCase() === col.id.toUpperCase());

        return (
          /* Column Container Card */
          <Card
            key={col.id}
            className="flex flex-col p-2 min-h-[550px] border border-border bg-muted/80 shadow-none"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <span className="font-semibold text-sm text-foreground">
                  {col.title}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAddTask(col.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Task Cards List */}
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto p-0.5">
              {colTasks.map(task => (
                <Card
                  key={task._id}
                  onClick={() => onSelectTask(task)}
                  size="sm"
                  className="relative cursor-pointer border border-border bg-card p-3 space-y-2 shadow-none hover:shadow-none transition-all"
                >
                  {/* Single Line Header: Title on Left, Options Button on Right */}
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="font-semibold text-xs text-foreground group-hover:text-accent-color transition-colors truncate">
                      {task.title}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40 rounded-xl p-1 shadow-lg border border-border" align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectTask(task); }}>
                          Open Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); if (onEditTask) onEditTask(task); }}>
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); if (onAddSubtask) onAddSubtask(task._id); }}>
                          Add Subtask
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardContent className="p-0 space-y-2">
                    {/* Card Metadata Bar */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      {/* Assignee Avatar & Name */}
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5 border border-border">
                          <AvatarImage src={task.members?.[0]?.avatar} />
                          <AvatarFallback className="text-[10px] bg-pink-500 text-white font-bold">
                            {task.members?.[0]?.name?.[0] || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-xs text-foreground/90">
                          {task.members?.[0]?.name || 'Admin'}
                        </span>
                      </div>

                      {/* Due Date Badge */}
                      {task.dueDate ? (
                        <Badge
                          variant="destructive"
                          className="h-auto px-2 py-0.5 font-medium text-[11px]"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        </Badge>
                      ) : null}
                    </div>

                    {/* Project Badge */}
                    {task.project ? (
                      <div className="pt-0.5">
                        <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground bg-muted/30 border-border flex items-center gap-1 w-fit">
                          <FolderKanban className="h-3 w-3 text-accent-color" />
                          <span>{getProjectName(task.project)}</span>
                        </Badge>
                      </div>
                    ) : null}

                    {/* Category Tag Badges */}
                    {task.labels && task.labels.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {task.labels.map((lbl, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="h-auto text-[11px] font-normal px-2.5 py-0.5"
                          >
                            <Tag className="h-3 w-3 text-muted-foreground mr-1" />
                            <span>{lbl}</span>
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}

              {/* Inline Add Task Button */}
              <Button
                variant="ghost"
                onClick={() => onAddTask(col.id)}
                className="w-full justify-start text-xs font-medium text-muted-foreground hover:text-foreground py-2 h-auto"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Task
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
