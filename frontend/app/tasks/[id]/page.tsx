'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { fetchTasks, fetchProjects, updateTask, addSubtask, addComment, deleteTask, deleteSubtask, Task } from '@/lib/api-client';
import { AddSubtaskDialog } from '@/components/add-subtask-dialog';
import { EditTaskDialog } from '@/components/edit-task-dialog';
import { EditSubtaskDialog } from '@/components/edit-subtask-dialog';
import {
  Calendar as CalendarIcon,
  Check,
  CheckSquare,
  ChevronDown,
  Edit2,
  Eye,
  FolderKanban,
  Lock,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Settings,
  Share2,
  Signal,
  Smile,
  Square,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableProjects, setAvailableProjects] = useState<{ id: string; name: string }[]>([]);
  const [subtaskDialogOpen, setSubtaskDialogOpen] = useState(false);
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
  const [editSubtaskDialogOpen, setEditSubtaskDialogOpen] = useState(false);
  const [selectedSubtaskForEdit, setSelectedSubtaskForEdit] = useState<any>(null);

  const handleOpenEditSubtask = (sub: any) => {
    setSelectedSubtaskForEdit(sub);
    setEditSubtaskDialogOpen(true);
  };

  // Inline editing states
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const [showAddLabel, setShowAddLabel] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState('');

  const loadTask = async () => {
    setLoading(true);
    const allTasks = await fetchTasks();
    const found = allTasks.find(t => t._id === taskId);
    if (found) {
      setTask(found);
      setTitleValue(found.title);
      setDescriptionValue(found.description || '');
    } else {
      setTask(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (taskId) {
      loadTask();
      fetchProjects().then(projs => {
        setAvailableProjects((projs || []).map(p => ({ id: p.id, name: p.name })));
      });
    }
  }, [taskId]);

  if (loading || !task) {
    return (
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar />
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Loading task details...</span>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Find active project object
  const activeProjectObj = availableProjects.find(p => p.id === task.project || p.name === task.project);
  const displayProjectName = activeProjectObj ? activeProjectObj.name : task.project || 'General Workspace';

  // --- Handlers ---
  const handleSaveTitle = async () => {
    if (!titleValue.trim() || titleValue === task.title) {
      setEditingTitle(false);
      return;
    }
    const updated = await updateTask(task._id, { title: titleValue.trim() });
    if (updated) setTask(updated);
    setEditingTitle(false);
  };

  const handleSaveDescription = async () => {
    if (descriptionValue === (task.description || '')) {
      setEditingDescription(false);
      return;
    }
    const updated = await updateTask(task._id, { description: descriptionValue.trim() });
    if (updated) setTask(updated);
    setEditingDescription(false);
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!newPriority) return;
    const updated = await updateTask(task._id, { priority: newPriority as any });
    if (updated) setTask(updated);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!newStatus) return;
    const updated = await updateTask(task._id, { status: newStatus as any });
    if (updated) setTask(updated);
  };

  const handleProjectChange = async (newProjId: string) => {
    const updated = await updateTask(task._id, { project: newProjId });
    if (updated) setTask(updated);
  };

  const handleDueDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    const updated = await updateTask(task._id, { dueDate: dateStr || undefined });
    if (updated) setTask(updated);
  };

  const handleAddSubtaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const updated = await addSubtask(task._id, { title: newSubtaskTitle.trim(), priority: 'HIGH' });
    setNewSubtaskTitle('');
    if (updated) setTask(updated);
  };

  const handleToggleSubtask = async (subtaskId: string, currentCompleted: boolean) => {
    if (!subtaskId) return;
    const updatedSubtasks = (task.subtasks || []).map(st => {
      const idStr = String(st.id || (st as any)._id || '');
      return idStr === String(subtaskId) ? { ...st, completed: !currentCompleted } : st;
    });
    const updated = await updateTask(task._id, { subtasks: updatedSubtasks as any });
    if (updated) setTask(updated);
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!subtaskId || !task) return;
    const targetId = String(subtaskId);
    const updatedSubtasks = (task.subtasks || []).filter(
      st => String(st.id || (st as any)._id || '') !== targetId
    );
    // Optimistic UI update
    setTask(prev => (prev ? { ...prev, subtasks: updatedSubtasks as any } : null));

    try {
      const updated = await deleteSubtask(task._id, subtaskId);
      if (updated) setTask(updated);
    } catch (err) {
      console.warn('Dedicated deleteSubtask failed, falling back to updateTask:', err);
      const updated = await updateTask(task._id, { subtasks: updatedSubtasks as any });
      if (updated) setTask(updated);
    }
  };

  const handleAddCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;
    const updated = await addComment(task._id, newCommentContent.trim());
    setNewCommentContent('');
    if (updated) setTask(updated);
  };

  const handleReplySubmit = async (commentId: string) => {
    const replyText = replyTexts[commentId];
    if (!replyText || !replyText.trim()) return;
    const updated = await addComment(task._id, replyText.trim());
    setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
    if (updated) setTask(updated);
  };

  const handleAddLabel = async () => {
    if (!newLabelInput.trim() || !task) return;
    const trimmed = newLabelInput.trim();
    const current = task.labels || [];
    if (!current.includes(trimmed)) {
      const updatedLabels = [...current, trimmed];
      setTask(prev => (prev ? { ...prev, labels: updatedLabels } : null));
      const updated = await updateTask(task._id, { labels: updatedLabels });
      if (updated) setTask(updated);
    }
    setNewLabelInput('');
    setShowAddLabel(false);
  };

  const handleRemoveLabel = async (lblToRemove: string) => {
    if (!task) return;
    const target = lblToRemove.trim().toLowerCase();
    const updatedLabels = (task.labels || []).filter(l => l.trim().toLowerCase() !== target);
    // Optimistic UI update
    setTask(prev => (prev ? { ...prev, labels: updatedLabels } : null));
    const updated = await updateTask(task._id, { labels: updatedLabels });
    if (updated) setTask(updated);
  };

  const handleDeleteTask = async () => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      await deleteTask(task._id);
      router.push('/tasks');
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* App Sidebar */}
        <AppSidebar />

        {/* Main Task Inspector Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Header Bar */}
          <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-2.5 bg-background/95 backdrop-blur border-b border-border/40">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteTask}
                className="h-8 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 rounded-lg cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete Task
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/tasks')}
                className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground cursor-pointer"
                title="Close and return to tasks"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Title & Description Header */}
          <div className="flex items-start justify-between gap-4 p-6 pb-0">
            <div className="space-y-2 flex-1">
              {/* Editable Title */}
              {editingTitle ? (
                <div className="flex items-center gap-2 max-w-xl">
                  <Input
                    value={titleValue}
                    onChange={e => setTitleValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') {
                        setTitleValue(task.title);
                        setEditingTitle(false);
                      }
                    }}
                    autoFocus
                    className="text-xl lg:text-2xl font-bold h-10 rounded-lg"
                  />
                  <Button size="sm" onClick={handleSaveTitle} className="h-10 text-xs px-3 bg-accent-color text-white font-semibold">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setEditingTitle(true)}>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-snug group-hover:text-accent-color transition-colors">
                    {task.title}
                  </h1>
                  <Edit2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}

              {/* Editable Description */}
              {editingDescription ? (
                <div className="flex items-center gap-2 max-w-2xl pt-1">
                  <Input
                    value={descriptionValue}
                    onChange={e => setDescriptionValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveDescription();
                      if (e.key === 'Escape') {
                        setDescriptionValue(task.description || '');
                        setEditingDescription(false);
                      }
                    }}
                    placeholder="Add a description..."
                    autoFocus
                    className="text-xs sm:text-sm text-foreground rounded-lg"
                  />
                  <Button size="sm" onClick={handleSaveDescription} className="h-9 text-xs px-3 bg-accent-color text-white font-semibold">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="group cursor-pointer flex items-center gap-2" onClick={() => setEditingDescription(true)}>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl group-hover:text-foreground transition-colors">
                    {task.description || 'Click to add task description guidelines...'}
                  </p>
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              )}
            </div>

            {/* Actions Icons Aligned Far Right */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm border-border bg-background shadow-xs">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
              <div className="inline-flex items-center gap-1.5 bg-muted/60 px-2.5 py-1.5 rounded-sm text-xs font-semibold border border-border/40">
                <Eye className="h-3.5 w-3.5 text-accent-color" />
                <span>1</span>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-sm border-border bg-background shadow-xs">
                <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 rounded-sm border border-border bg-background shadow-xs cursor-pointer inline-flex items-center justify-center">
                  <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                  <DropdownMenuItem onClick={() => setEditTaskDialogOpen(true)} className="text-xs font-semibold text-accent-color cursor-pointer">
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingTitle(true)} className="text-xs cursor-pointer">
                    Edit Title
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingDescription(true)} className="text-xs cursor-pointer">
                    Edit Description
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteTask} className="text-xs text-red-600 cursor-pointer font-medium">
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main Task Body Content */}
          <main className="flex-1 p-4 lg:p-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols wide out of 12) */}
              <div className="lg:col-span-8 space-y-3.5">
                {/* Properties Bar */}
                <div className="flex flex-wrap items-center gap-3 text-xs pt-0.5">
                  <span className="font-semibold text-muted-foreground w-20">Project</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-md px-2.5 py-1 font-semibold flex items-center gap-1.5 bg-muted/40 border-border text-foreground">
                      <FolderKanban className="h-3.5 w-3.5 text-accent-color" />
                      <span>{displayProjectName}</span>
                    </Badge>
                  </div>
                </div>

                {/* Interactive Labels Bar */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-semibold text-muted-foreground w-20">Labels</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(task.labels || []).map((lbl, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="rounded-md text-[11px] font-medium px-2.5 py-0.5 border border-border bg-muted/40 text-foreground flex items-center gap-1"
                      >
                        <span>🏷️ {lbl}</span>
                        <X
                          className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer ml-0.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLabel(lbl);
                          }}
                        />
                      </Badge>
                    ))}

                    {showAddLabel ? (
                      <div className="flex items-center gap-1">
                        <Input
                          placeholder="Label name..."
                          value={newLabelInput}
                          onChange={e => setNewLabelInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleAddLabel();
                            if (e.key === 'Escape') setShowAddLabel(false);
                          }}
                          autoFocus
                          className="h-6 text-xs w-28 rounded-md"
                        />
                        <Button size="sm" variant="ghost" onClick={handleAddLabel} className="h-6 px-2 text-xs">
                          Add
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddLabel(true)}
                        className="h-6 px-2 text-[11px] rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Label
                      </Button>
                    )}
                  </div>
                </div>

                {/* Subtasks Section */}
                <div className="space-y-2.5 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-bold text-sm text-foreground">Subtasks</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-semibold">
                        {(task.subtasks || []).length}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubtaskDialogOpen(true)}
                      className="h-7 text-xs rounded-md font-semibold cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Subtask
                    </Button>
                  </div>

                  {/* Subtasks Table */}
                  <div className="border border-border rounded-lg overflow-hidden bg-card shadow-xs">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="border-b border-border hover:bg-transparent">
                          <TableHead className="w-[8%] pl-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                            Done
                          </TableHead>
                          <TableHead className="w-[42%] font-semibold text-xs text-muted-foreground uppercase py-2">
                            Task
                          </TableHead>
                          <TableHead className="font-semibold text-xs text-muted-foreground uppercase py-2">
                            Priority
                          </TableHead>
                          <TableHead className="font-semibold text-xs text-muted-foreground uppercase py-2">
                            Due Date
                          </TableHead>
                          <TableHead className="text-right pr-4 font-semibold text-xs text-muted-foreground uppercase py-2">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(task.subtasks && task.subtasks.length > 0) ? (
                          task.subtasks.map(sub => {
                            const stId = sub.id || (sub as any)._id;
                            return (
                              <TableRow key={stId} className="border-b border-border/60 text-xs hover:bg-muted/40 transition-colors">
                                {/* Checkbox Toggle */}
                                <TableCell className="pl-4 py-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSubtask(stId, !!sub.completed)}
                                    className="text-muted-foreground hover:text-accent-color cursor-pointer flex items-center"
                                  >
                                    {sub.completed ? (
                                      <CheckSquare className="h-4 w-4 text-accent-color" />
                                    ) : (
                                      <Square className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                </TableCell>

                                {/* Title */}
                                <TableCell className={`py-2 font-medium ${sub.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                  {sub.title}
                                </TableCell>

                                {/* Priority */}
                                <TableCell className="py-2">
                                  <span
                                    className={
                                      sub.priority === 'URGENT'
                                        ? 'text-red-500 font-semibold flex items-center gap-1'
                                        : sub.priority === 'HIGH'
                                          ? 'text-orange-500 font-semibold flex items-center gap-1'
                                          : sub.priority === 'MEDIUM'
                                            ? 'text-amber-500 font-semibold flex items-center gap-1'
                                            : 'text-zinc-400 flex items-center gap-1'
                                    }
                                  >
                                    <Signal className="h-3.5 w-3.5" />
                                    <span>{sub.priority}</span>
                                  </span>
                                </TableCell>

                                {/* Due Date */}
                                <TableCell className="py-2 text-muted-foreground font-medium">
                                  {sub.dueDate || 'No Due Date'}
                                </TableCell>

                                {/* Edit & Delete Actions */}
                                <TableCell className="py-2 text-right pr-4">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleOpenEditSubtask(sub)}
                                      className="h-6 w-6 text-muted-foreground hover:text-accent-color hover:bg-muted rounded-sm cursor-pointer"
                                      title="Edit subtask"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteSubtask(stId)}
                                      className="h-6 w-6 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-sm cursor-pointer"
                                      title="Delete subtask"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-4">
                              No subtasks yet. Use the form below to add subtasks.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {/* Inline Add Subtask Form */}
                    <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2 p-2 bg-muted/20 border-t border-border">
                      <Plus className="h-4 w-4 text-muted-foreground ml-1" />
                      <Input
                        placeholder="Add subtask title..."
                        value={newSubtaskTitle}
                        onChange={e => setNewSubtaskTitle(e.target.value)}
                        className="h-8 text-xs rounded-md border-transparent focus-visible:border-border bg-transparent flex-1"
                      />
                      <Button type="submit" size="sm" variant="ghost" disabled={!newSubtaskTitle.trim()} className="h-8 text-xs rounded-md font-semibold cursor-pointer">
                        Add
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Activity & Comments Stream */}
                <div className="space-y-3 pt-3">
                  <h3 className="font-bold text-sm text-foreground">Activity & Comments</h3>

                  {/* Comments Feed Box */}
                  <div className="space-y-2.5">
                    {(task.comments || []).map(c => (
                      <div key={c.id} className="rounded-xl bg-card border border-border shadow-xs overflow-hidden">
                        {/* Top Comment Body */}
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={c.authorAvatar} />
                                <AvatarFallback className="bg-purple-600 text-white text-[10px]">
                                  {c.authorName?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-bold text-foreground">{c.authorName}</span>
                              <span className="text-[11px] text-muted-foreground">
                                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-foreground/90 pl-8">{c.content}</p>
                        </div>

                        {/* Reply Input Form */}
                        <div className="border-t border-border px-3.5 py-2 flex items-center gap-2 bg-muted/10">
                          <Input
                            placeholder="Leave a reply..."
                            value={replyTexts[c.id] || ''}
                            onChange={e => setReplyTexts(prev => ({ ...prev, [c.id]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleReplySubmit(c.id);
                            }}
                            className="flex-1 border-none shadow-none focus-visible:ring-0 text-xs h-7 bg-transparent px-0 placeholder:text-muted-foreground"
                          />
                          <Send
                            onClick={() => handleReplySubmit(c.id)}
                            className="h-3.5 w-3.5 text-accent-color cursor-pointer hover:opacity-80 shrink-0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input Form */}
                  <form onSubmit={handleAddCommentSubmit} className="pt-1">
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3.5 py-3 bg-card shadow-xs">
                      <Input
                        placeholder="Add a comment..."
                        value={newCommentContent}
                        onChange={e => setNewCommentContent(e.target.value)}
                        className="flex-1 border-none shadow-none focus-visible:ring-0 text-xs h-7 bg-transparent px-0 placeholder:text-muted-foreground"
                      />
                      <Button type="submit" size="icon" variant="ghost" disabled={!newCommentContent.trim()} className="h-7 w-7 rounded-md hover:bg-muted cursor-pointer">
                        <Send className="h-4 w-4 text-accent-color" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column Inspector (4 cols wide out of 12) */}
              <div className="lg:col-span-4 space-y-3.5">
                {/* Details Card */}
                <div className="border border-border rounded-xl p-4 bg-card shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      <span className="font-bold text-sm text-foreground">
                        Details
                      </span>
                    </div>
                  </div>

                  {/* Project Selector Row */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-muted-foreground">Project</span>
                    <Select value={task.project || ''} onValueChange={(val: string) => handleProjectChange(val)}>
                      <SelectTrigger className="h-7 w-auto border-none shadow-none focus:ring-0 text-xs font-semibold text-foreground p-0 bg-transparent flex items-center gap-1.5 cursor-pointer">
                        <FolderKanban className="h-3.5 w-3.5 text-accent-color" />
                        <span>{displayProjectName}</span>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {availableProjects.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            📁 {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Selector Row */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-muted-foreground">Status</span>
                    <Select value={task.status} onValueChange={(val: any) => handleStatusChange(val || 'TODO')}>
                      <SelectTrigger className="h-7 w-auto border-none shadow-none focus:ring-0 text-xs font-semibold text-foreground p-0 bg-transparent flex items-center gap-1.5 cursor-pointer">
                        <span className={`h-2 w-2 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-500' : task.status === 'DOING' ? 'bg-amber-500' : task.status === 'TODO' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                        <span>{task.status === 'TODO' ? 'To Do' : task.status === 'DOING' ? 'Doing' : task.status === 'COMPLETED' ? 'Completed' : 'Backlog'}</span>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="BACKLOG">🟠 Backlog</SelectItem>
                        <SelectItem value="TODO">🔵 To Do</SelectItem>
                        <SelectItem value="DOING">🟡 Doing</SelectItem>
                        <SelectItem value="COMPLETED">🟢 Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority Selector Row */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-muted-foreground">Priority</span>
                    <Select value={task.priority} onValueChange={(val: any) => handlePriorityChange(val || 'HIGH')}>
                      <SelectTrigger className="h-7 w-auto border-none shadow-none focus:ring-0 text-xs font-semibold text-foreground p-0 bg-transparent flex items-center gap-1 cursor-pointer">
                        <Signal className={`h-3.5 w-3.5 ${task.priority === 'URGENT' ? 'fill-red-500 text-red-500' : task.priority === 'HIGH' ? 'fill-orange-500 text-orange-500' : 'fill-amber-500 text-amber-500'}`} />
                        <span>{task.priority === 'URGENT' ? 'Urgent' : task.priority === 'HIGH' ? 'High' : task.priority === 'MEDIUM' ? 'Medium' : 'Low'}</span>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="NO_PRIORITY">⚪ No Priority</SelectItem>
                        <SelectItem value="URGENT">🔴 Urgent</SelectItem>
                        <SelectItem value="HIGH">🟠 High</SelectItem>
                        <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                        <SelectItem value="LOW">⚪ Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Due Date Picker Row */}
                  <div className="space-y-3 pt-2 text-xs border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Due Date</span>
                      <Input
                        type="date"
                        value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                        onChange={handleDueDateChange}
                        className="h-7 text-xs w-36 rounded-md border-border bg-transparent cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Reporter</span>
                      <span className="font-semibold text-foreground">{task.reporter || 'User'}</span>
                    </div>
                  </div>
                </div>

                {/* Updates Audit Log Card */}
                <div className="border border-border rounded-xl p-3.5 bg-card shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                      Updates History
                    </span>
                  </div>

                  <div className="space-y-3 pt-0.5">
                    {(task.activityLogs && task.activityLogs.length > 0) ? (
                      task.activityLogs.map(log => (
                        <div key={log.id} className="text-xs flex items-start gap-3">
                          <div className="h-7 w-7 rounded-full bg-accent-color/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Signal className="h-3.5 w-3.5 text-accent-color" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-foreground">Activity</span>
                            <span className="text-muted-foreground leading-tight">{log.text}</span>
                            <span className="text-[10px] text-muted-foreground/60">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No recent update logs.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AddSubtaskDialog
        taskId={task._id}
        open={subtaskDialogOpen}
        onOpenChange={setSubtaskDialogOpen}
        onSubtaskAdded={(updated) => {
          if (updated) setTask(updated);
        }}
      />

      <EditTaskDialog
        task={task}
        open={editTaskDialogOpen}
        onOpenChange={setEditTaskDialogOpen}
        onTaskUpdated={(updated) => {
          if (updated) setTask(updated);
        }}
      />

      <EditSubtaskDialog
        taskId={task._id}
        subtask={selectedSubtaskForEdit}
        open={editSubtaskDialogOpen}
        onOpenChange={setEditSubtaskDialogOpen}
        onSubtaskUpdated={(updated) => {
          if (updated) setTask(updated);
        }}
      />
    </SidebarProvider>
  );
}
