'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { FieldsPopover } from '@/components/fields-popover';
import { FilterPopover } from '@/components/filter-popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, Signal, MoreHorizontal, FolderKanban, Edit2, Trash2, GripVertical } from 'lucide-react';

import { AddProjectDialog } from '@/components/add-project-dialog';
import { EditProjectDialog } from '@/components/edit-project-dialog';
import { AddTaskDialog } from '@/components/add-task-dialog';
import { fetchProjects, createProject, deleteProject, createTask } from '@/lib/api-client';

export interface ProjectItem {
  id: string;
  name: string;
  priority: 'HIGH' | 'LOW' | 'MEDIUM' | 'URGENT';
  status?: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'BACKLOG' | string;
  leadName: string;
  leadAvatar?: string;
  tasksCount: number;
  createdAt: string;
}

const BOARD_COLUMNS = [
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'COMPLETED', title: 'Completed' },
  { id: 'ON_HOLD', title: 'On Hold' },
  { id: 'BACKLOG', title: 'Backlog' },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<ProjectItem | null>(null);

  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<string>('');

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('list');

  const loadProjects = async () => {
    const data = await fetchProjects();
    setProjects(data || []);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const priorityRank: Record<string, number> = {
    URGENT: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
  };

  const statusRank: Record<string, number> = {
    IN_PROGRESS: 1,
    DOING: 1,
    COMPLETED: 2,
    ON_HOLD: 3,
    BACKLOG: 4,
  };

  // Filter & Sort Projects
  const filteredProjects = [...(projects || [])]
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = !selectedPriority || p.priority === selectedPriority;
      const pStatus = p.status || 'IN_PROGRESS';
      const matchesStatus = !selectedStatus || pStatus.toUpperCase() === selectedStatus.toUpperCase();
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      if (sortBy === 'Priority') {
        const rankA = priorityRank[a.priority] || 99;
        const rankB = priorityRank[b.priority] || 99;
        return rankA - rankB;
      }
      if (sortBy === 'Status') {
        const rankA = statusRank[(a.status || 'IN_PROGRESS').toUpperCase()] || 99;
        const rankB = statusRank[(b.status || 'IN_PROGRESS').toUpperCase()] || 99;
        return rankA - rankB;
      }
      if (sortBy === 'Members' || sortBy === 'Lead') {
        return (a.leadName || '').localeCompare(b.leadName || '');
      }
      if (sortBy === 'DueDate' || sortBy === 'Date') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return 0;
    });

  const handleSelectProject = (project: ProjectItem) => {
    router.push(`/tasks?project=${encodeURIComponent(project.id)}`);
  };

  const handleProjectCreated = async (newProjData: ProjectItem) => {
    const created = await createProject(newProjData);
    setProjects(prev => [created, ...(prev || [])]);
  };

  const handleProjectUpdated = (updatedProj: ProjectItem) => {
    setProjects(prev => (prev || []).map(p => (p.id === updatedProj.id ? updatedProj : p)));
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete project "${name}"?`)) {
      await deleteProject(id);
      setProjects(prev => (prev || []).filter(p => p.id !== id));
    }
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setSelectedProjectForEdit(project);
    setEditProjectOpen(true);
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Header Bar */}
          <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground" />
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6 lg:p-8 w-full space-y-6">
            {/* Header Title & Action Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                  Projects
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Manage and organize your projects and team tasks
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Search Toggle */}
                {searchOpen ? (
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onBlur={() => {
                        if (!searchQuery) setSearchOpen(false);
                      }}
                      className="pl-9 pr-4 h-9 w-56 sm:w-64 text-xs bg-muted/40 border border-border"
                      autoFocus
                    />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSearchOpen(true)}
                    className="h-9 w-9 border-border bg-background shadow-xs cursor-pointer"
                    title="Search projects"
                  >
                    <Search className="h-4 w-4 text-foreground" />
                  </Button>
                )}

                {/* Fields Popover (Switches List & Board and Sorts Fields) */}
                <FieldsPopover
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                />

                {/* Filter Popover */}
                <FilterPopover
                  activePriority={selectedPriority}
                  onSelectPriority={setSelectedPriority}
                  activeStatus={selectedStatus}
                  onSelectStatus={setSelectedStatus}
                />

                {/* Add Project Button */}
                <Button
                  onClick={() => setAddProjectOpen(true)}
                  className="h-9 px-3.5 text-xs font-semibold rounded-sm bg-accent-color text-white dark:text-zinc-950 hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Project
                </Button>
              </div>
            </div>

            {/* View Switcher: List Table View vs Board Kanban View */}
            {viewMode === 'list' ? (
              /* Projects Overview Table Card */
              <Card className="p-0 border border-border rounded-lg shadow-xs overflow-hidden bg-card">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="w-[260px] text-xs font-bold text-foreground">Projects</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Priority</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Lead</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Tasks</TableHead>
                      <TableHead className="w-[80px] text-right text-xs font-bold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map(project => (
                      <TableRow
                        key={project.id}
                        onClick={() => handleSelectProject(project)}
                        className="border-b border-border/60 hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        {/* Project Name */}
                        <TableCell className="font-semibold text-xs text-foreground py-3.5">
                          <div className="flex items-center gap-2.5">
                            <FolderKanban className="h-4 w-4 text-accent-color shrink-0" />
                            <span>{project.name}</span>
                          </div>
                        </TableCell>

                        {/* Priority */}
                        <TableCell className="py-3.5">
                          {project.priority === 'HIGH' ? (
                            <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                              <Signal className="h-3.5 w-3.5 fill-red-500" />
                              High
                            </span>
                          ) : project.priority === 'MEDIUM' ? (
                            <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                              <Signal className="h-3.5 w-3.5 text-amber-500" />
                              Medium
                            </span>
                          ) : project.priority === 'URGENT' ? (
                            <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                              <Signal className="h-3.5 w-3.5 fill-red-600" />
                              Urgent
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              Low
                            </span>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3.5">
                          {project.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                              Completed
                            </span>
                          ) : project.status === 'ON_HOLD' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                              On Hold
                            </span>
                          ) : project.status === 'BACKLOG' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              Backlog
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                              In Progress
                            </span>
                          )}
                        </TableCell>

                        {/* Lead */}
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5 border border-border">
                              <AvatarImage src={project.leadAvatar} />
                              <AvatarFallback className="text-[9px] bg-pink-500 text-white font-bold">
                                {project.leadName?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-foreground">
                              {project.leadName || 'Unassigned'}
                            </span>
                          </div>
                        </TableCell>

                        {/* Tasks Count */}
                        <TableCell className="py-3.5 text-xs text-muted-foreground font-medium">
                          {project.tasksCount} Tasks
                        </TableCell>

                        {/* Actions Dropdown Menu */}
                        <TableCell className="py-3.5 text-right" onClick={e => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 rounded-xl border-border space-y-2">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProjectForTask(project.id);
                                  setAddTaskOpen(true);
                                }}
                                className="text-xs font-medium cursor-pointer flex items-center gap-2"
                              >
                                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>Add Task</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleOpenEdit(project)}
                                className="text-xs font-medium cursor-pointer flex items-center gap-2"
                              >
                                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>Update</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleDeleteProject(project.id, project.name)}
                                className="text-xs font-medium cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Add Projects Footer Trigger */}
                <div className="p-3 border-t border-border bg-card">
                  <Button
                    variant="ghost"
                    onClick={() => setAddProjectOpen(true)}
                    className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 justify-start cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Projects
                  </Button>
                </div>
              </Card>
            ) : (
              /* Project Board View (Kanban) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                {BOARD_COLUMNS.map(col => {
                  const colProjects = filteredProjects.filter(p => {
                    const statusStr = (p.status || 'IN_PROGRESS').toUpperCase();
                    return statusStr === col.id.toUpperCase();
                  });

                  return (
                    <Card key={col.id} className="flex flex-col p-2 min-h-[550px] border border-border bg-muted/80 shadow-none">
                      {/* Column Header */}
                      <div className="flex items-center justify-between px-1 pb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-sm text-foreground">{col.title}</span>
                          <span className="text-xs font-semibold bg-background px-2 py-0.5 rounded-full border border-border">
                            {colProjects.length}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAddProjectOpen(true)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Projects Cards List */}
                      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto p-0.5">
                        {colProjects.map(project => (
                          <Card
                            key={project.id}
                            onClick={() => handleSelectProject(project)}
                            className="relative cursor-pointer border border-border bg-card p-3 space-y-2.5 shadow-none hover:border-accent-color/50 transition-all"
                          >
                            <div className="flex items-center justify-between w-full gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <FolderKanban className="h-4 w-4 text-accent-color shrink-0" />
                                <span className="font-bold text-xs text-foreground truncate">{project.name}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-6 w-6 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 rounded-xl border-border">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedProjectForTask(project.id);
                                      setAddTaskOpen(true);
                                    }}
                                    className="text-xs font-medium cursor-pointer flex items-center gap-2"
                                  >
                                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Add Task</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEdit(project);
                                    }}
                                    className="text-xs font-medium cursor-pointer flex items-center gap-2"
                                  >
                                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Update</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProject(project.id, project.name);
                                    }}
                                    className="text-xs font-medium text-red-600 cursor-pointer flex items-center gap-2"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <CardContent className="p-0 space-y-2 pt-1 border-t border-border/40">
                              <div className="flex items-center justify-between text-xs pt-1">
                                <div className="flex items-center gap-1.5">
                                  <Avatar className="h-5 w-5 border border-border">
                                    <AvatarImage src={project.leadAvatar} />
                                    <AvatarFallback className="text-[9px] bg-pink-500 text-white font-bold">
                                      {project.leadName?.[0] || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{project.leadName || 'Unassigned'}</span>
                                </div>

                                <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                                  {project.tasksCount} Tasks
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            <AddProjectDialog
              open={addProjectOpen}
              onOpenChange={setAddProjectOpen}
              onProjectCreated={handleProjectCreated}
            />

            <EditProjectDialog
              project={selectedProjectForEdit}
              open={editProjectOpen}
              onOpenChange={setEditProjectOpen}
              onProjectUpdated={handleProjectUpdated}
            />

            <AddTaskDialog
              open={addTaskOpen}
              onOpenChange={setAddTaskOpen}
              onTaskCreated={async (newTaskData) => {
                await createTask(newTaskData);
                loadProjects();
              }}
              defaultProject={selectedProjectForTask}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
