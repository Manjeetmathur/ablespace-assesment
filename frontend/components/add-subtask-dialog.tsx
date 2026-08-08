'use client';

import React, { useState } from 'react';
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
import { addSubtask, Task } from '@/lib/api-client';

interface AddSubtaskDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubtaskAdded?: (updatedTask: Task) => void;
}

export function AddSubtaskDialog({
  taskId,
  open,
  onOpenChange,
  onSubtaskAdded,
}: AddSubtaskDialogProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !taskId) return;

    setSubmitting(true);
    try {
      const updated = await addSubtask(taskId, {
        title: title.trim(),
        priority,
        dueDate: dueDate || undefined,
      });
      setTitle('');
      setDueDate('');
      onOpenChange(false);
      if (onSubtaskAdded) {
        onSubtaskAdded(updated);
      }
    } catch (err) {
      console.error('Failed to add subtask:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Subtask</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a subtask item to break down this work.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Subtask Title
            </label>
            <Input
              placeholder="e.g. Implement API endpoint"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="rounded-lg text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Priority
            </label>
            <Select value={priority} onValueChange={(val: string) => setPriority(val || 'HIGH')}>
              <SelectTrigger className="rounded-lg text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="URGENT">Urgent 🔴</SelectItem>
                <SelectItem value="HIGH">High 🟠</SelectItem>
                <SelectItem value="MEDIUM">Medium 🟡</SelectItem>
                <SelectItem value="LOW">Low ⚪</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              {submitting ? 'Adding...' : 'Add Subtask'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
