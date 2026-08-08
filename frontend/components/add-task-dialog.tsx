'use client';

import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Tag, X } from 'lucide-react';
import { fetchProjects, Task } from '@/lib/api-client';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: (task: Partial<Task>) => void;
  defaultStatus?: string;
  defaultProject?: string;
}

export interface ProjectItemOption {
  id: string;
  name: string;
}

const PRESET_LABELS = ['Research', 'Design', 'Development', 'Testing', 'Deployment', 'Bug', 'Feature'];

export function AddTaskDialog({
  open,
  onOpenChange,
  onTaskCreated,
  defaultStatus = 'TODO',
  defaultProject = '',
}: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItemOption | null>(null);
  const [availableProjects, setAvailableProjects] = useState<ProjectItemOption[]>([]);
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState('HIGH');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [customLabelInput, setCustomLabelInput] = useState('');

  React.useEffect(() => {
    if (open) {
      setStatus(defaultStatus);
      setLabels([]);
      setCustomLabelInput('');
      fetchProjects().then(projs => {
        const mapped: ProjectItemOption[] = (projs || []).map(p => ({ id: p.id, name: p.name }));
        setAvailableProjects(mapped);

        const match = mapped.find(p => p.id === defaultProject || p.name === defaultProject);
        if (match) {
          setSelectedProject(match);
        } else if (mapped.length > 0) {
          setSelectedProject(mapped[0]);
        } else if (defaultProject) {
          setSelectedProject({ id: defaultProject, name: defaultProject });
        } else {
          setSelectedProject(null);
        }
      });
    }
  }, [open, defaultStatus, defaultProject]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onTaskCreated({
      title,
      description,
      project: selectedProject?.id || undefined,
      status: status as any,
      priority: priority as any,
      dueDate: dueDate || undefined,
      labels: labels.length > 0 ? labels : undefined,
    });

    setTitle('');
    setDescription('');
    setLabels([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details to add a task to your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Title
            </label>
            <Input
              placeholder="e.g. Design Homepage"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="rounded-lg"
              required
            />
          </div>

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
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select a project">
                  {selectedProject ? selectedProject.name : 'Select a project'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-lg">
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <Input
              placeholder="Detailed task guidelines..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </label>
              <Select value={status} onValueChange={(val: any) => setStatus(val || 'TODO')}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="DOING">Doing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Priority
              </label>
              <Select value={priority} onValueChange={(val: any) => setPriority(val || 'HIGH')}>
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
          </div>

          {/* Labels Section */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>Labels</span>
            </label>
            
            {/* Active Selected Labels Badges */}
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

            {/* Quick Preset Labels */}
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

            {/* Custom Label Inline Input */}
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Due Date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="rounded-lg"
            />
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
            <Button type="submit" className="rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
