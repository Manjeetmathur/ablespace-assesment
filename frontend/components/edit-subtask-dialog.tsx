'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateTask, Task } from '@/lib/api-client';

export interface SubtaskItem {
  id: string;
  title: string;
  priority?: string;
  dueDate?: string;
  completed?: boolean;
}

interface EditSubtaskDialogProps {
  taskId: string;
  subtask: SubtaskItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubtaskUpdated?: (updatedTask: Task) => void;
}

export function EditSubtaskDialog({
  taskId,
  subtask,
  open,
  onOpenChange,
  onSubtaskUpdated,
}: EditSubtaskDialogProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && subtask) {
      setTitle(subtask.title || '');
      setPriority(subtask.priority || 'HIGH');
      setDueDate(subtask.dueDate || '');
      setCompleted(!!subtask.completed);
    }
  }, [open, subtask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subtask || !taskId) return;

    setSubmitting(true);
    try {
      const targetId = String(subtask.id || (subtask as any)._id);

      // Fetch task tasks or get current state
      const allTasks = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/tasks/${taskId}`).then(r => r.json());
      const currentSubtasks: any[] = allTasks?.subtasks || [];

      const updatedSubtasks = currentSubtasks.map(st => {
        const currentStId = String(st.id || st._id);
        if (currentStId === targetId) {
          return {
            ...st,
            title: title.trim(),
            priority,
            dueDate: dueDate || undefined,
            completed,
          };
        }
        return st;
      });

      const updatedTask = await updateTask(taskId, { subtasks: updatedSubtasks });
      onOpenChange(false);
      if (updatedTask && onSubtaskUpdated) {
        onSubtaskUpdated(updatedTask);
      }
    } catch (err) {
      console.error('Failed to update subtask:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!subtask) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Subtask</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Modify subtask details and priorities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Title
            </label>
            <Input
              placeholder="Subtask Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="rounded-lg text-xs"
              required
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Priority
            </label>
            <Select value={priority} onValueChange={(val: string) => setPriority(val || 'HIGH')}>
              <SelectTrigger className="rounded-lg text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg text-xs">
                <SelectItem value="URGENT">🔴 Urgent</SelectItem>
                <SelectItem value="HIGH">🟠 High</SelectItem>
                <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                <SelectItem value="LOW">⚪ Low</SelectItem>
                <SelectItem value="NO_PRIORITY">⚪ No Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Due Date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="rounded-lg text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !title.trim()}
              className="rounded-lg text-xs bg-accent-color text-white dark:text-zinc-950 font-semibold"
            >
              {submitting ? 'Saving...' : 'Save Subtask'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
