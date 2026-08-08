'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectItem } from '@/app/projects/page';
import { updateProject } from '@/lib/api-client';

interface EditProjectDialogProps {
  project: ProjectItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: (updatedProject: ProjectItem) => void;
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'LOW' | 'MEDIUM' | 'URGENT'>('MEDIUM');
  const [status, setStatus] = useState<'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'BACKLOG'>('IN_PROGRESS');
  const [leadName, setLeadName] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setPriority(project.priority || 'MEDIUM');
      setStatus((project.status as any) || 'IN_PROGRESS');
      setLeadName(project.leadName || '');
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !name.trim()) return;

    try {
      const updated = await updateProject(project.id, {
        name: name.trim(),
        priority,
        status,
        leadName: leadName.trim(),
      });
      onProjectUpdated(updated);
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update project parameters and save changes to MongoDB.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Project Name
            </label>
            <Input
              placeholder="e.g. Design System Refactor"
              value={name}
              onChange={e => setName(e.target.value)}
              className="rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Priority
              </label>
              <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                <SelectTrigger className="rounded-lg">
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
                Status
              </label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="IN_PROGRESS">In Progress 🔵</SelectItem>
                  <SelectItem value="COMPLETED">Completed 🟢</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold 🟠</SelectItem>
                  <SelectItem value="BACKLOG">Backlog ⚪</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Project Lead
              </label>
              <Input
                placeholder="Lead Name"
                value={leadName}
                onChange={e => setLeadName(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-lg bg-primary text-primary-foreground">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
