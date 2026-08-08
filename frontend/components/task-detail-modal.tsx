'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
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
import { Task, updateTask, addSubtask, addComment, deleteSubtask } from '@/lib/api-client';
import { EditSubtaskDialog } from '@/components/edit-subtask-dialog';
import {
  Calendar,
  ChevronDown,
  Eye,
  Lock,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Share2,
  Signal,
  Smile,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated: () => void;
}

export function TaskDetailModal({
  task,
  open,
  onOpenChange,
  onTaskUpdated,
}: TaskDetailModalProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editSubtaskDialogOpen, setEditSubtaskDialogOpen] = useState(false);
  const [selectedSubtaskForEdit, setSelectedSubtaskForEdit] = useState<any>(null);

  if (!task) return null;

  const handleOpenEditSubtask = (sub: any) => {
    setSelectedSubtaskForEdit(sub);
    setEditSubtaskDialogOpen(true);
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!newPriority) return;
    await updateTask(task._id, { priority: newPriority as any });
    onTaskUpdated();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!newStatus) return;
    await updateTask(task._id, { status: newStatus as any });
    onTaskUpdated();
  };

  const handleAddSubtaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    setSubmitting(true);
    await addSubtask(task._id, { title: newSubtaskTitle, priority: 'HIGH' });
    setNewSubtaskTitle('');
    setSubmitting(false);
    onTaskUpdated();
  };

  const handleAddCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    setSubmitting(true);
    await addComment(task._id, newCommentContent);
    setNewCommentContent('');
    setSubmitting(false);
    onTaskUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-border bg-card shadow-2xl">
        {/* Top Header Actions Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-foreground">Tasks</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </Button>
            <div className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg text-xs font-semibold">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              <span>1</span>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Grid: Left Details & Right Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Left Column (2 Cols wide) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {task.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description ||
                  'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.'}
              </p>
            </div>

            {/* Properties Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">Properties</span>
                <Badge variant="secondary" className="rounded-lg px-2 py-0.5 font-medium flex items-center gap-1.5">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={task.members?.[0]?.avatar} />
                    <AvatarFallback className="text-[9px] bg-pink-500 text-white">A</AvatarFallback>
                  </Avatar>
                  <span>Designer</span>
                </Badge>
                {task.dueDate ? (
                  <Badge variant="secondary" className="rounded-lg px-2 py-0.5 font-medium text-red-500 bg-red-50 dark:bg-red-950/40 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(task.dueDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </Badge>
                ) : null}
              </div>
            </div>

            {/* Labels Bar */}
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-muted-foreground w-20">Labels</span>
              <div className="flex flex-wrap gap-1.5">
                {(task.labels || []).map((lbl, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="rounded-lg text-[11px] font-normal px-2.5 py-0.5 border-border bg-muted/30"
                  >
                    🏷️ {lbl}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Resources Bar */}
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-muted-foreground w-20">Resources</span>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Add document or link...</span>
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-bold text-sm text-foreground">Subtasks</h3>
                </div>
              </div>

              {/* Subtasks Table */}
              <div className="border border-border/80 rounded-2xl overflow-hidden bg-card">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-b border-border/60">
                      <TableHead className="w-[40%] font-semibold text-xs text-muted-foreground uppercase pl-4">
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
                      <TableHead className="text-right pr-4 font-semibold text-xs text-muted-foreground uppercase">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(task.subtasks || []).map(sub => (
                      <TableRow key={sub.id} className="border-b border-border/40 text-xs">
                        <TableCell className="pl-4 font-medium">{sub.title}</TableCell>
                        <TableCell>
                          <span
                            className={
                              sub.priority === 'HIGH'
                                ? 'text-red-500 font-semibold'
                                : sub.priority === 'MEDIUM'
                                  ? 'text-amber-500 font-semibold'
                                  : 'text-zinc-400'
                            }
                          >
                            📶 {sub.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Avatar className="h-5 w-5 border border-border">
                            <AvatarFallback className="text-[9px] bg-pink-500 text-white font-bold">
                              {sub.members?.[0]?.name?.[0] || 'A'}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{sub.dueDate || 'No Due Date'}</TableCell>
                        <TableCell className="text-right pr-4">
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
                              onClick={async () => {
                                const stId = String(sub.id || (sub as any)._id);
                                await deleteSubtask(task._id, stId);
                                onTaskUpdated();
                              }}
                              className="h-6 w-6 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-sm cursor-pointer"
                              title="Delete subtask"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Inline Add Subtask Input Form */}
                <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2 p-3 bg-muted/20 border-t border-border/40">
                  <Plus className="h-4 w-4 text-muted-foreground ml-1" />
                  <Input
                    placeholder="Add Subtasks..."
                    value={newSubtaskTitle}
                    onChange={e => setNewSubtaskTitle(e.target.value)}
                    className="h-8 text-xs rounded-lg border-transparent focus-visible:border-border bg-transparent"
                  />
                  <Button type="submit" size="sm" variant="ghost" className="h-8 text-xs rounded-lg font-semibold">
                    Add
                  </Button>
                </form>
              </div>
            </div>

            {/* Comments & Activity Stream */}
            <div className="space-y-4 pt-4 border-t border-border/60">
              <h3 className="font-bold text-sm text-foreground">Activity & Comments</h3>

              {/* Comments Feed */}
              <div className="space-y-3">
                {(task.comments || []).map(c => (
                  <div key={c.id} className="p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={c.authorAvatar} />
                          <AvatarFallback className="bg-purple-600 text-white text-[10px]">AD</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold text-foreground">{c.authorName}</span>
                        <span className="text-[11px] text-muted-foreground">just now</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Smile className="h-3.5 w-3.5 cursor-pointer hover:text-foreground" />
                        <MoreHorizontal className="h-3.5 w-3.5 cursor-pointer hover:text-foreground" />
                      </div>
                    </div>
                    <p className="text-xs text-foreground/90 pl-8">{c.content}</p>

                    <div className="pl-8 pt-1 flex items-center gap-2">
                      <Input
                        placeholder="Leave a reply..."
                        className="h-7 text-xs rounded-lg bg-background"
                      />
                      <Paperclip className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
                      <Send className="h-3.5 w-3.5 text-accent-color cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Input Box */}
              <form onSubmit={handleAddCommentSubmit} className="flex items-center gap-2 pt-2">
                <Avatar className="h-7 w-7 border border-border">
                  <AvatarFallback className="bg-pink-500 text-white font-bold text-xs">D</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 bg-background">
                  <Input
                    placeholder="Add a comment..."
                    value={newCommentContent}
                    onChange={e => setNewCommentContent(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 text-xs h-7"
                  />
                  <Paperclip className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                  <Button type="submit" size="icon" variant="ghost" className="h-7 w-7 rounded-lg">
                    <Send className="h-4 w-4 text-accent-color" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Inspector Column (1 Col wide) */}
          <div className="space-y-6">
            {/* Details Card */}
            <div className="border border-border/80 rounded-2xl p-4 bg-muted/20 space-y-4 relative">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Details
                  </span>
                </div>
              </div>

              {/* Status Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Status</label>
                <Select value={task.status} onValueChange={(val: any) => handleStatusChange(val || 'TODO')}>
                  <SelectTrigger className="h-9 text-xs rounded-lg font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="BACKLOG">🟠 Backlog</SelectItem>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="DOING">Doing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Picker Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Priority</label>
                <Select value={task.priority} onValueChange={(val: any) => handlePriorityChange(val || 'HIGH')}>
                  <SelectTrigger className="h-9 text-xs rounded-lg font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="NO_PRIORITY">No Priority</SelectItem>
                    <SelectItem value="URGENT">🔴 Urgent</SelectItem>
                    <SelectItem value="HIGH">🟠 High</SelectItem>
                    <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                    <SelectItem value="LOW">⚪ Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Members & Attributes */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium text-foreground">Dexter, Admin</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium text-foreground">{task.dueDate || '31 Jul'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Teams</span>
                  <span className="font-medium text-foreground">Engineering</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reporter</span>
                  <span className="font-medium text-foreground">Dexter</span>
                </div>
              </div>
            </div>

            {/* Updates Audit Log Card */}
            <div className="border border-border/80 rounded-2xl p-4 bg-muted/20 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Updates
                </span>
              </div>

              <div className="space-y-2.5">
                {(task.activityLogs && task.activityLogs.length > 0) ? (
                  task.activityLogs.map(log => (
                    <div key={log.id} className="text-xs text-muted-foreground flex items-start gap-2">
                      <Signal className="h-3.5 w-3.5 text-accent-color shrink-0 mt-0.5" />
                      <span>{log.text}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No recent updates.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <EditSubtaskDialog
        taskId={task._id}
        subtask={selectedSubtaskForEdit}
        open={editSubtaskDialogOpen}
        onOpenChange={setEditSubtaskDialogOpen}
        onSubtaskUpdated={() => {
          onTaskUpdated();
        }}
      />
    </Dialog>
  );
}
