'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { TaskBoard } from '@/components/task-board';
import { TaskList } from '@/components/task-list';
import { FilterPopover } from '@/components/filter-popover';
import { FieldsPopover } from '@/components/fields-popover';
import { AddTaskDialog } from '@/components/add-task-dialog';
import { AddSubtaskDialog } from '@/components/add-subtask-dialog';
import { EditTaskDialog } from '@/components/edit-task-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchTasks, fetchProjects, createTask, Task } from '@/lib/api-client';
import { FolderKanban, Plus, Search, X } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeProject = searchParams.get('project');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [defaultAddStatus, setDefaultAddStatus] = useState('TODO');

  const [subtaskDialogOpen, setSubtaskDialogOpen] = useState(false);
  const [selectedTaskForSubtask, setSelectedTaskForSubtask] = useState<string>('');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  const handleOpenAddSubtask = (taskId: string) => {
    setSelectedTaskForSubtask(taskId);
    setSubtaskDialogOpen(true);
  };

  const handleOpenEditTask = (taskToEdit: Task) => {
    setSelectedTaskForEdit(taskToEdit);
    setEditDialogOpen(true);
  };

  useEffect(() => {
    fetchProjects().then(projs => setProjects(projs || []));
  }, []);

  const activeProjectObj = projects.find(p => p.id === activeProject || p.name === activeProject);
  const displayProjectName = activeProjectObj ? activeProjectObj.name : activeProject;

  const loadTasks = async () => {
    const data = await fetchTasks({
      search: searchQuery,
      priority: selectedPriority || undefined,
      status: selectedStatus || undefined,
      project: activeProject || undefined,
    });
    setTasks(data);
  };

  const taskPriorityRank: Record<string, number> = {
    URGENT: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
    NO_PRIORITY: 5,
  };

  const taskStatusRank: Record<string, number> = {
    TODO: 1,
    DOING: 2,
    COMPLETED: 3,
    ON_HOLD: 4,
    BACKLOG: 5,
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortBy) return 0;
    if (sortBy === 'Priority') {
      const rankA = taskPriorityRank[a.priority] || 99;
      const rankB = taskPriorityRank[b.priority] || 99;
      return rankA - rankB;
    }
    if (sortBy === 'Status') {
      const rankA = taskStatusRank[a.status] || 99;
      const rankB = taskStatusRank[b.status] || 99;
      return rankA - rankB;
    }
    if (sortBy === 'Members') {
      const nameA = a.members?.[0]?.name || '';
      const nameB = b.members?.[0]?.name || '';
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'DueDate') {
      const timeA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const timeB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return timeA - timeB;
    }
    if (sortBy === 'Reporter') {
      return (a.reporter || '').localeCompare(b.reporter || '');
    }
    if (sortBy === 'Labels') {
      const countA = (a.labels || []).length;
      const countB = (b.labels || []).length;
      return countB - countA;
    }
    return 0;
  });

  useEffect(() => {
    loadTasks();
  }, [searchQuery, selectedPriority, selectedStatus, activeProject]);

  // Keyboard shortcut listener for ⌘F / Ctrl+F search bar focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => {
          document.getElementById('task-search-input')?.focus();
        }, 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTaskCreated = async (newTaskData: Partial<Task>) => {
    await createTask(newTaskData);
    loadTasks();
  };

  const handleOpenAddTask = (status: string = 'TODO') => {
    setDefaultAddStatus(status);
    setAddDialogOpen(true);
  };

  // Navigate to dedicated Task Detail Page instead of opening dialog
  const handleSelectTask = (task: Task) => {
    router.push(`/tasks/${task._id}`);
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* App Sidebar Component */}
        <AppSidebar />

        {/* Main Content Body */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Top Bar Header (Matching Figma: Contains ONLY Sidebar Trigger) */}
          <header className="sticky top-0 z-10 flex items-center px-6 py-2 bg-background/95 backdrop-blur border-b border-border/40">
            <SidebarTrigger />
          </header>

          {/* Main Page Title & Actions Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
              {activeProject ? (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-border bg-muted/40 text-foreground"
                >
                  <FolderKanban className="h-3.5 w-3.5 text-accent-color" />
                  <span>Project: {displayProjectName}</span>
                  <X
                    className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer ml-1"
                    onClick={() => router.push('/tasks')}
                  />
                </Badge>
              ) : null}
            </div>

            {/* Action Controls: Search, Fields Popover, Filter, Add Task */}
            <div className="flex items-center gap-2.5">
              {/* Search Toggle / Input */}
              {searchOpen ? (
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="task-search-input"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) setSearchOpen(false);
                    }}
                    className="pl-9 pr-12 h-9 w-56 sm:w-64 text-xs bg-muted/40 border border-border focus-visible:ring-0 focus-visible:border-border"
                  />
                  <kbd className="absolute right-2.5 text-[10px] font-semibold text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
                    ⌘F
                  </kbd>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="h-9 w-9"
                  title="Search tasks (⌘F)"
                >
                  <Search className="h-4 w-4 text-foreground" />
                </Button>
              )}

              {/* Fields Popover Button */}
              <FieldsPopover
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortByChange={setSortBy}
              />

              {/* Filter Dropdown Popover */}
              <FilterPopover
                activePriority={selectedPriority}
                onSelectPriority={setSelectedPriority}
                activeStatus={selectedStatus}
                onSelectStatus={setSelectedStatus}
              />

              {/* + Add Task Primary Action Button */}
              <Button
                onClick={() => handleOpenAddTask('TODO')}
                className="h-9 px-3.5 text-xs font-semibold rounded-sm bg-accent-color text-white dark:text-zinc-950 hover:opacity-90 transition-opacity shadow-xs"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Task
              </Button>
            </div>
          </div>

          {/* View Switcher: Board vs List */}
          <div className="flex-1 p-6 pt-3">
            {viewMode === 'board' ? (
              <TaskBoard
                tasks={sortedTasks}
                projects={projects}
                onSelectTask={handleSelectTask}
                onAddTask={handleOpenAddTask}
                onAddSubtask={handleOpenAddSubtask}
                onEditTask={handleOpenEditTask}
              />
            ) : (
              <TaskList
                tasks={sortedTasks}
                projects={projects}
                onSelectTask={handleSelectTask}
                onAddTask={handleOpenAddTask}
                onAddSubtask={handleOpenAddSubtask}
                onEditTask={handleOpenEditTask}
              />
            )}
          </div>
        </div>

        {/* Add Task Modal */}
        <AddTaskDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onTaskCreated={handleTaskCreated}
          defaultStatus={defaultAddStatus}
          defaultProject={activeProject || ''}
        />

        {/* Dedicated Add Subtask Modal */}
        <AddSubtaskDialog
          taskId={selectedTaskForSubtask}
          open={subtaskDialogOpen}
          onOpenChange={setSubtaskDialogOpen}
          onSubtaskAdded={() => {
            loadTasks();
          }}
        />

        {/* Edit Task Modal */}
        <EditTaskDialog
          task={selectedTaskForEdit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onTaskUpdated={() => {
            loadTasks();
          }}
        />
      </div>
    </SidebarProvider>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">Loading workspace tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}
