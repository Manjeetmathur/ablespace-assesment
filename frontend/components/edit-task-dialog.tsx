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
import { Badge } from '@/components/ui/badge';
import { Plus, Tag, X } from 'lucide-react';
import { Task, fetchProjects, updateTask } from '@/lib/api-client';

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
}

export interface ProjectItemOption {
  id: string;
  name: string;
}

const PRESET_LABELS = ['Research', 'Design', 'Development', 'Testing', 'Deployment', 'Bug', 'Feature'];

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItemOption | null>(null);
  const [availableProjects, setAvailableProjects] = useState<ProjectItemOption[]>([]);
  const [status, setStatus] = useState<string>('TODO');
  const [priority, setPriority] = useState<string>('HIGH');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [customLabelInput, setCustomLabelInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'TODO');
      setPriority(task.priority || 'HIGH');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setLabels(task.labels || []);
      setCustomLabelInput('');

      fetchProjects().then(projs => {
        const mapped: ProjectItemOption[] = (projs || []).map(p => ({ id: p.id, name: p.name }));
        setAvailableProjects(mapped);

        const match = mapped.find(p => p.id === task.project || p.name === task.project);
        if (match) {
          setSelectedProject(match);
        } else if (task.project) {
          setSelectedProject({ id: task.project, name: task.project });
        } else if (mapped.length > 0) {
          setSelectedProject(mapped[0]);
        } else {
          setSelectedProject(null);
        }
      });
    }
  }, [open, task]);

  const handleToggleLabel = (lbl: string) => {
    if (labels.includes(lbl)) {
      setLabels(labels.filter(l => l !== lbl));
    } else {
      setLabels([...labels, lbl]);
    }
  };

  const handleAddCustomLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabelInput.trim()) return;
    const trimmed = customLabelInput.trim();
    if (!labels.includes(trimmed)) {
      setLabels([...labels, trimmed]);
    }
    setCustomLabelInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !task) return;

    setSubmitting(true);
    try {
      const updated = await updateTask(task._id, {
        title: title.trim(),
        description: description.trim(),
        project: selectedProject?.id || undefined,
        status: status as any,
        priority: priority as any,
        dueDate: dueDate || undefined,
        labels,
      });

      onOpenChange(false);
      if (updated && onTaskUpdated) {
        onTaskUpdated(updated);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Task</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the task details and workspace assignments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Title
            </label>
            <Input
              placeholder="Task Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="rounded-lg text-xs"
              required
            />
          </div>

          {/* Project */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Project
            </label>
            <Select
              value={selectedProject?.id || ''}
              onValueChange={(val: string) => {
                const found = availableProjects.find(p => p.id === val);
                if (found) setSelectedProject(found);
              }}
            >
              <SelectTrigger className="rounded-lg text-xs">
                <SelectValue placeholder="Select a project">
                  {selectedProject ? selectedProject.name : 'Select a project'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-lg text-xs">
                {availableProjects.length > 0 ? (
                  availableProjects.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="General">General Workspace</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <Input
              placeholder="Detailed task description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="rounded-lg text-xs"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </label>
              <Select value={status} onValueChange={(val: string) => setStatus(val || 'TODO')}>
                <SelectTrigger className="rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg text-xs">
                  <SelectItem value="BACKLOG">Backlog 🟠</SelectItem>
                  <SelectItem value="TODO">To Do 🔵</SelectItem>
                  <SelectItem value="DOING">Doing 🟡</SelectItem>
                  <SelectItem value="COMPLETED">Completed 🟢</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold ⚪</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Priority
              </label>
              <Select value={priority} onValueChange={(val: string) => setPriority(val || 'HIGH')}>
                <SelectTrigger className="rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg text-xs">
                  <SelectItem value="URGENT">Urgent 🔴</SelectItem>
                  <SelectItem value="HIGH">High 🟠</SelectItem>
                  <SelectItem value="MEDIUM">Medium 🟡</SelectItem>
                  <SelectItem value="LOW">Low ⚪</SelectItem>
                  <SelectItem value="NO_PRIORITY">No Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Labels Section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>Labels</span>
            </label>

            {labels.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {labels.map((lbl) => (
                  <Badge
                    key={lbl}
                    variant="secondary"
                    className="h-6 text-xs font-medium px-2 py-0.5 flex items-center gap-1 bg-muted text-foreground border border-border"
                  >
                    <span>🏷️ {lbl}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:opacity-80 ml-0.5"
                      onClick={() => handleToggleLabel(lbl)}
                    />
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-1">
              {PRESET_LABELS.map(lbl => {
                const isSelected = labels.includes(lbl);
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => handleToggleLabel(lbl)}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-accent-color text-white border-accent-color font-semibold'
                        : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {lbl}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Input
                placeholder="Add custom label..."
                value={customLabelInput}
                onChange={e => setCustomLabelInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomLabel(e);
                  }
                }}
                className="h-8 text-xs rounded-lg flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomLabel}
                className="h-8 text-xs rounded-lg px-3 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
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
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
